import {airtableData} from '@/lib/airtable';
import Airtable from 'airtable';
import {NextResponse} from 'next/server';
export async function GET() {
  const base = new Airtable({apiKey: process.env.AIRTABLE}).base(
    'appXu0aYFo1OsZRi0'
  );
  try {
    const data = await airtableData();
    return NextResponse.json(data, {status: 200});
  } catch (e) {
    return Response.json(e);
  }
}
