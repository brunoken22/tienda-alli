import {base} from '@/lib/airtable';
import {index} from '@/lib/algolia';

// import {getDataAirtable} from '@/lib/airtable';
export async function GET() {
  const data = await getDataAirtable();
  console.log('GET', data);
  return Response.json(data);
}
export async function getDataAirtable() {
  const newBase = base('Furniture').select({
    pageSize: 100,
  });
  const response = await newBase.all();
  const object = response.map((r) => ({
    objectID: r.id,
    ...r.fields,
  }));
  await index.saveObjects(object);
  return object.length;
}
