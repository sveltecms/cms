import { hash as bcryptHash } from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";
import { v2 as CloudinaryApi } from "cloudinary";
export default new class Utils {
    /** Upload asset */
    async uploadAsset(cloudinary, filePath, public_id) {
        CloudinaryApi.config({
            cloud_name: cloudinary.CLOUD_NAME,
            api_key: cloudinary.API_KEY,
            api_secret: cloudinary.API_KEY_SECRET
        });
        try {
            const uploadRes = await CloudinaryApi.uploader.upload(filePath, { public_id });
            const assetData = {
                _id: new ObjectId(public_id),
                publicID: uploadRes.public_id,
                assetID: uploadRes.asset_id,
                src: uploadRes.secure_url,
                title: "No asset",
                type: uploadRes.resource_type,
                extension: uploadRes.format
            };
            return assetData;
        }
        catch {
            return null;
        }
    }
    /** MongoDB clint
     * @param { string } DB_URL - url to your mongodb */
    async mongoClient(DB_URL) {
        const client = new MongoClient(DB_URL);
        await client.connect();
        return client;
    }
    /** Test mongodb connection */
    async testMongoDBCon(connectionURL) {
        try {
            const mongoClient = await this.mongoClient(connectionURL);
            mongoClient.db("TEST");
            await mongoClient.close(); // Close connection
            return true;
        }
        catch {
            return false;
        }
    }
    /** Delete database if it exists */
    async deleteDatabase(connectionURL, dbName) {
        const mongoClient = await this.mongoClient(connectionURL);
        const db = mongoClient.db(dbName);
        const databases = (await db.admin().listDatabases()).databases;
        const dbExists = databases.find(data => data.name === dbName);
        // drop database
        if (dbExists)
            await db.dropDatabase();
        // Close connection
        await mongoClient.close();
    }
    /** Hash string */
    async hash(data) {
        return bcryptHash(data, 10);
    }
    /** Console log error and ok */
    log = new class {
        normal(data) { console.log(`\x1B[34m${data}\x1b[0m`); }
        error(data) { console.log(`\x1b[31m${data}\x1b[0m`); }
        ok(data) { console.log(`\x1b[32m${data}\x1b[0m`); }
    };
};
