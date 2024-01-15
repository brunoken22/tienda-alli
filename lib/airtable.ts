import Airtable from 'airtable';
import {index} from './algolia';
const base = new Airtable({apiKey: process.env.AIRTABLE}).base(
  'appXu0aYFo1OsZRi0'
);
export async function getDataAirtable() {
  const newProduct: any = [];

  return new Promise((resolve, reject) => {
    base('Furniture')
      .select({
        pageSize: 100,
      })
      .eachPage(
        async function page(records, fetchNextPage) {
          const object = records.map((r) => ({
            objectID: r.id,
            ...r.fields,
          }));

          // Add the objects to the newProduct array
          newProduct.push(...object);

          fetchNextPage();
        },
        async function done(err) {
          if (err) {
            reject(err); // Reject the promise if there is an error
            return;
          }

          try {
            // Save all objects to the index in one call after fetching all pages
            await index.saveObjects(newProduct);
            resolve(newProduct); // Resolve the promise with the newProduct array
          } catch (saveError) {
            reject(saveError); // Reject the promise if there is an error during saving
          }
        }
      );
  });
}
