import {airtableData} from '@/lib/airtable';
import {NextResponse} from 'next/server';
export async function GET() {
  try {
    const data = await airtableData();
    return NextResponse.json(data, {status: 200});
  } catch (e) {
    return Response.json(e);
  }
}
