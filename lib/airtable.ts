import Airtable from 'airtable';
export const base = new Airtable({apiKey: process.env.AIRTABLE}).base(
  'appXu0aYFo1OsZRi0'
);
