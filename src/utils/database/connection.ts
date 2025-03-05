import { MongoClient } from "mongodb";

const mongoUrl = "mongodb://localhost:27017";
const client = new MongoClient(mongoUrl);
export const db = client.db('Next_Practies');
// export default db;