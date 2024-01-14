import {base} from '@/lib/airtable';
import {index} from '@/lib/algolia';
export async function GET() {
  base('Furniture')
    .select({
      pageSize: 20,
    })
    .eachPage(
      async function page(records, fetchNextPage) {
        const object = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });
        console.log(object.length);

        await index.saveObjects(object);
        fetchNextPage();
      },
      async function done(err) {
        if (err) {
          return;
        }
      }
    );
  return Response.json('Todo bien la API');
}
