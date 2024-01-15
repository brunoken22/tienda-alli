import {base} from '@/lib/airtable';
import {index} from '@/lib/algolia';
export async function GET() {
  base('Furniture')
    .select({
      pageSize: 100,
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
      function done(err) {
        if (err) {
          return;
        }
        console.log('TERMINADO');
      }
    );
  // const data: any = await getDataAirtable();
  // console.log('GET', data.length);

  return Response.json('data.length');
}
