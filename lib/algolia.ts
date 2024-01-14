import algoliasearch from 'algoliasearch';
const client = algoliasearch('M5BJRFSVUS', process.env.ALGOLIA as string);
export const index = client.initIndex('product');
