export const dynamic = 'force-dynamic';

import {getDataAirtable} from '@/lib/airtable';
import {NextResponse} from 'next/server';

export async function GET() {
  try {
    const data = await getDataAirtable();
    return NextResponse.json(data.length);
  } catch (e: any) {
    return NextResponse.json(e.message);
  }
}
