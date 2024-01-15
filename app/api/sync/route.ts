import {getDataAirtable} from '@/lib/airtable';
export async function GET() {
  const data = await getDataAirtable();
  console.log('GET', data);
  return Response.json(data);
}
