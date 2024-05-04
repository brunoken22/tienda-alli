import {getDataAirtable} from '@/lib/airtable';

export async function GET() {
  try {
    const data = await getDataAirtable();
    return Response.json(data.length);
  } catch (e: any) {
    return Response.json(e.message);
  }
}
