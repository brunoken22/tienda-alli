import {getDataAirtable} from '@/lib/airtable';

export async function GET() {
  const data: any = await getDataAirtable();
  console.log('GET', data.length);

  return Response.json('data.length');
}
