import algoliasearch from 'algoliasearch';
// const client = algoliasearch('M5BJRFSVUS', process.env.ALGOLIA as string);
const clientRposteria = algoliasearch(
  'NRDCDSL7R8',
  process.env.ALGOLIA as string
);

// export const index = client.initIndex('product');
export const index = clientRposteria.initIndex('products');
