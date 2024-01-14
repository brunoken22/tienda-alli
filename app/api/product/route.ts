import {airtableData} from '@/lib/airtable';
export async function GET() {
  try {
    const data = await airtableData();
    return Response.json(data);
  } catch (e) {
    return Response.json(e);
  }
}
