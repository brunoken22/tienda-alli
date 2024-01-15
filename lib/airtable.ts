import Airtable from 'airtable';
import {index} from './algolia';
export const base = new Airtable({apiKey: process.env.AIRTABLE}).base(
  'appXu0aYFo1OsZRi0'
);
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
