import { MongoClient, ObjectId } from "mongodb";
export declare type CloudinaryConfig = {
    CLOUD_NAME: string;
    API_KEY: string;
    API_KEY_SECRET: string;
};
declare const _default: {
    /** Upload asset */
    uploadAsset(cloudinary: CloudinaryConfig, filePath: string, public_id: string): Promise<{
        _id: ObjectId;
        publicID: string;
        assetID: any;
        src: string;
        title: string;
        type: "auto" | "raw" | "image" | "video";
        extension: string;
    } | null>;
    /** MongoDB clint
     * @param { string } DB_URL - url to your mongodb */
    mongoClient(DB_URL: string): Promise<MongoClient>;
    /** Test mongodb connection */
    testMongoDBCon(connectionURL: string): Promise<boolean>;
    /** Delete database if it exists */
    deleteDatabase(connectionURL: string, dbName: string): Promise<void>;
    /** Hash string */
    hash(data: string): Promise<string>;
    /** Console log error and ok */
    log: {
        normal(data: string): void;
        error(data: string): void;
        ok(data: string): void;
    };
};
export default _default;
