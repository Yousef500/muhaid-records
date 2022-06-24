import {MongoClient} from "mongodb";

const url = 'mongodb://localhost:27017/muhaid_records';

let cachedClient = null;
let cachedDb = null;

export const connectToDatabase = async () => {
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb
        }
    }

    let client = await new MongoClient(url);
    await client.connect();
    let db = await client.db('muhaid_records');

    cachedClient = client;
    cachedDb = db;

    return {
        client: cachedClient,
        db: cachedDb
    }

}