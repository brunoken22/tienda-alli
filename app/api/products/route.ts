import Airtable from 'airtable';
export async function GET() {
  const base = new Airtable({apiKey: process.env.AIRTABLE}).base(
    'appXu0aYFo1OsZRi0'
  );
  let newRecords: any[] = [];
  await new Promise<void>((resolve, reject) => {
    base('Furniture')
      .select({
        pageSize: 100,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.map(function (record: any) {
            newRecords.push({
              Name: record.get('Name'),
              img: record.get('Images')[0].url,
              id: record.id,
            });
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            reject(err); // Rechaza la promesa en caso de error
            return;
          }
          resolve(); // Resuelve la promesa cuando la operación se completa
        }
      );
  });

  return Response.json(newRecords);
}
