import { NextRequest, NextResponse } from 'next/server';
import { and, gte, lte, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { getAdminOrErrorResponse } from '@/lib/admin/middleware';
import { FUNNEL_STEPS, type FunnelStep } from '@/lib/analytics/funnel';

const { funnelEvents: funnelEventsTable } = schema;

type FunnelStepRow = {
  step: string;
  source: string;
  count: number;
  uniqueUsers: number;
};

const DEFAULT_WINDOW_DAYS = 30;

function parseDate(value: string | null, fallback: Date, endOfDay = false): Date {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(endOfDay ? `${value}T23:59:59.999Z` : `${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }

  return Number(((numerator / denominator) * 100).toFixed(2));
}

export async function GET(request: NextRequest) {
  const { error } = await getAdminOrErrorResponse(request);

  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(request.url);
    const groupBySource = searchParams.get('groupBy') === 'source';

    const now = new Date();
    const defaultFrom = new Date(now.getTime() - DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const from = parseDate(searchParams.get('from'), defaultFrom);
    const to = parseDate(searchParams.get('to'), now, true);

    const db = getDb();

    const rows = (await db
      .select({
        step: funnelEventsTable.step,
        source: funnelEventsTable.source,
        count: sql<number>`count(*)::int`,
        uniqueUsers: sql<number>`count(distinct ${funnelEventsTable.userId})::int`,
      })
      .from(funnelEventsTable)
      .where(and(gte(funnelEventsTable.occurredAt, from), lte(funnelEventsTable.occurredAt, to)))
      .groupBy(funnelEventsTable.step, funnelEventsTable.source)) as FunnelStepRow[];

    const perStep = new Map<string, { count: number; uniqueUsers: number }>();
    const perStepSource = new Map<string, { count: number; uniqueUsers: number }>();
    let totalEvents = 0;
    let unknownSourceEvents = 0;
    const distinctUsers = new Set<number>();

    for (const row of rows) {
      const stepCount = row.count ?? 0;
      totalEvents += stepCount;

      if (row.source === 'unknown') {
        unknownSourceEvents += stepCount;
      }

      const stepAgg = perStep.get(row.step) ?? { count: 0, uniqueUsers: 0 };
      stepAgg.count += stepCount;
      stepAgg.uniqueUsers += row.uniqueUsers ?? 0;
      perStep.set(row.step, stepAgg);

      const sourceAgg = perStepSource.get(`${row.step}|${row.source}`) ?? {
        count: 0,
        uniqueUsers: 0,
      };
      sourceAgg.count += stepCount;
      sourceAgg.uniqueUsers += row.uniqueUsers ?? 0;
      perStepSource.set(`${row.step}|${row.source}`, sourceAgg);

      distinctUsers.add(row.uniqueUsers ?? 0);
    }

    const countFor = (step: FunnelStep): number => perStep.get(step)?.count ?? 0;

    const steps = groupBySource
      ? Array.from(perStepSource.entries())
          .map(([key, value]) => {
            const [step, source] = key.split('|');
            return { step, source, count: value.count, uniqueUsers: value.uniqueUsers };
          })
          .sort((a, b) => a.step.localeCompare(b.step) || a.source.localeCompare(b.source))
      : FUNNEL_STEPS.map((step) => ({
          step,
          count: countFor(step),
          uniqueUsers: perStep.get(step)?.uniqueUsers ?? 0,
        }));

    const payload = {
      period: {
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
      },
      totals: {
        steps: totalEvents,
        users: distinctUsers.size,
      },
      steps,
      conversionRates: {
        visitorToAccount: ratio(countFor('account_created'), countFor('offer_viewed')),
        accountToTrial: ratio(countFor('trial_started'), countFor('account_created')),
        trialToPaid: ratio(countFor('subscription_active'), countFor('trial_started')),
        paidToCanceled: ratio(countFor('subscription_canceled'), countFor('subscription_active')),
      },
      unknownSourceShare:
        totalEvents > 0 ? Number((unknownSourceEvents / totalEvents).toFixed(4)) : 0,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error('Error fetching funnel metrics:', err);
    return NextResponse.json(
      { error: 'Falha ao carregar o funil', code: 'FUNNEL_ERROR' },
      { status: 500 }
    );
  }
}
