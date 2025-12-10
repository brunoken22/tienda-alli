import Airtable from "airtable";
import { index } from "./algolia";

export const base = new Airtable({ apiKey: process.env.AIRTABLE }).base("appXu0aYFo1OsZRi0");

export async function getDataAll() {
  const newBase = base("Furniture").select({
    view: "All furniture",
  });
  const response = await newBase.all();
  const object = response.map((r) => ({
    objectID: r.id,
    ...r.fields,
  }));

  const res = await index.replaceAllObjects(object);
  return res.objectIDs;
}
