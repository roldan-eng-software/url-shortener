import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { getAdminOrErrorResponse } from '@/lib/admin/middleware';

async function countTable(db: ReturnType<typeof getDb>, tableName: string): Promise<number> {
  try {
    const result = await db.execute(sql`SELECT COUNT(*) FROM ${sql.identifier(tableName)}`);
    return Number(result.rows[0]?.count) || 0;
  } catch {
    return 0;
  }
}

export async function GET(request: NextRequest) {
  const { error } = await getAdminOrErrorResponse(request);

  if (error) {
    return error;
  }

  try {
    const db = getDb();

    const [users, userLinks, anonLinks, urls, marketingLeads, privacyRequests, bioPages, bioLinks] =
      await Promise.all([
        countTable(db, 'users'),
        countTable(db, 'user_links'),
        countTable(db, 'anon_links'),
        countTable(db, 'urls'),
        countTable(db, 'marketing_leads'),
        countTable(db, 'privacy_requests'),
        countTable(db, 'bio_pages'),
        countTable(db, 'bio_links'),
      ]);

    const metrics = {
      users,
      userLinks,
      anonLinks,
      urls,
      marketingLeads,
      privacyRequests,
      bioPages,
      bioLinks,
      totalRecords:
        users +
        userLinks +
        anonLinks +
        urls +
        marketingLeads +
        privacyRequests +
        bioPages +
        bioLinks,
    };

    return NextResponse.json(metrics);
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return NextResponse.json(
      { error: 'Failed to fetch metrics', code: 'METRICS_ERROR' },
      { status: 500 }
    );
  }
}
