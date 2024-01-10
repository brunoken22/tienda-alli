import Airtable from 'airtable';
export async function GET() {
  const base = new Airtable({apiKey: process.env.AIRTABLE}).base(
    'appXu0aYFo1OsZRi0'
  );
  try {
    let newRecords: any[] = [];
    await new Promise<void>((resolve, reject) => {
      base('Furniture')
        .select({
          pageSize: 10,
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.map(function (record: any) {
              newRecords.push({
                Name: record.fields.Name,
                img: record.fields.Images[0].url,
                price: record.fields['Unit cost'],
                id: record.id,
              });
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error('Error', err);
              reject(err); // Rechaza la promesa en caso de error
              return;
            }
            resolve(); // Resuelve la promesa cuando la operación se completa
          }
        );
    });
    return Response.json(newRecords);
  } catch (e) {
    console.log(e);
    return Response.json(e);
  }
}
