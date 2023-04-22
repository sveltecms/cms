import { MongoClient } from "mongodb"
const client = new MongoClient(process.env.DB_URL!)
await client.connect()
export default client.db(process.env.DB_NAME)