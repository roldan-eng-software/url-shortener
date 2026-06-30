import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { getAdminOrErrorResponse } from '@/lib/admin/middleware';

const { marketingLeads } = schema;

export async function GET(request: NextRequest) {
  const { error } = await getAdminOrErrorResponse(request);

  if (error) {
    return error;
  }

  try {
    const db = getDb();
    const url = new URL(request.url);

    // Parse query parameters
    const statusFilter = url.searchParams.get('status') || 'all';
    const interestFilter = url.searchParams.get('interest') || 'all';
    const sourceFilter = url.searchParams.get('source') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);
    const offset = (page - 1) * limit;

    // Fetch leads
    const leads = await db.query.marketingLeads.findMany({
      orderBy: [desc(marketingLeads.createdAt)],
      limit: limit + 1, // Fetch one extra to check if there are more
      offset: offset,
    });

    // Apply filters
    let filteredLeads = leads;
    if (statusFilter !== 'all') {
      filteredLeads = filteredLeads.filter((lead) => lead.status === statusFilter);
    }
    if (interestFilter !== 'all') {
      filteredLeads = filteredLeads.filter((lead) => lead.interest === interestFilter);
    }
    if (sourceFilter !== 'all') {
      filteredLeads = filteredLeads.filter((lead) => lead.source === sourceFilter);
    }

    // Check if there are more results
    const hasMore = filteredLeads.length > limit;
    if (hasMore) {
      filteredLeads = filteredLeads.slice(0, limit);
    }

    // Get total count for pagination
    const totalLeads = await db.query.marketingLeads.findMany();
    const total = totalLeads.length;

    return NextResponse.json({
      leads: filteredLeads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore,
      },
    });
  } catch (err) {
    console.error('Error fetching leads:', err);
    return NextResponse.json(
      { error: 'Failed to fetch leads', code: 'LEADS_ERROR' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await getAdminOrErrorResponse(request);

  if (error) {
    return error;
  }

  try {
    const db = getDb();
    const body = await request.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json(
        { error: 'leadId and status are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['new', 'contacted', 'converted', 'lost'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Update lead status
    const updatedLead = await db
      .update(marketingLeads)
      .set({ status })
      .where(eq(marketingLeads.id, leadId))
      .returning();

    if (updatedLead.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLead[0]);
  } catch (err) {
    console.error('Error updating lead:', err);
    return NextResponse.json(
      { error: 'Failed to update lead', code: 'LEAD_UPDATE_ERROR' },
      { status: 500 }
    );
  }
}
