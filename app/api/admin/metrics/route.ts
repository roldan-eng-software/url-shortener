import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { getAdminOrErrorResponse } from '@/lib/admin/middleware';

export async function GET(request: NextRequest) {
  const { error } = await getAdminOrErrorResponse(request);

  if (error) {
    return error;
  }

  try {
    const db = getDb();

    // Query all table counts in a single request
    const counts = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM users)::integer as users_count,
        (SELECT COUNT(*) FROM user_links)::integer as user_links_count,
        (SELECT COUNT(*) FROM anon_links)::integer as anon_links_count,
        (SELECT COUNT(*) FROM urls)::integer as urls_count,
        (SELECT COUNT(*) FROM marketing_leads)::integer as marketing_leads_count,
        (SELECT COUNT(*) FROM privacy_requests)::integer as privacy_requests_count,
        (SELECT COUNT(*) FROM bio_pages)::integer as bio_pages_count,
        (SELECT COUNT(*) FROM bio_links)::integer as bio_links_count
    `);

    const row = counts.rows[0];

    const metrics = {
      users: Number(row.users_count) || 0,
      userLinks: Number(row.user_links_count) || 0,
      anonLinks: Number(row.anon_links_count) || 0,
      urls: Number(row.urls_count) || 0,
      marketingLeads: Number(row.marketing_leads_count) || 0,
      privacyRequests: Number(row.privacy_requests_count) || 0,
      bioPages: Number(row.bio_pages_count) || 0,
      bioLinks: Number(row.bio_links_count) || 0,
      totalRecords: 0,
    };

    // Calculate total
    metrics.totalRecords =
      metrics.users +
      metrics.userLinks +
      metrics.anonLinks +
      metrics.urls +
      metrics.marketingLeads +
      metrics.privacyRequests +
      metrics.bioPages +
      metrics.bioLinks;

    return NextResponse.json(metrics);
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return NextResponse.json(
      { error: 'Failed to fetch metrics', code: 'METRICS_ERROR' },
      { status: 500 }
    );
  }
}
