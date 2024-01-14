import Airtable from 'airtable';
export async function airtableData() {
  const base = new Airtable({apiKey: process.env.AIRTABLE}).base(
    'appXu0aYFo1OsZRi0'
  );
  let newRecords: any[] = [];

  return new Promise((resolve, reject) => {
    base('Furniture')
      .select({
        pageSize: 10,
        view: 'All furniture',
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record: any) {
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
            reject(err);
            return;
          }
          resolve(newRecords);
        }
      );
  });
}
