import {getDataAirtable} from '@/lib/airtable';

export async function GET() {
  const data = await getDataAirtable();
  return Response.json(data);
}
