export default function install(): Promise<{
    defaultAsset: {
        _id: import("bson").ObjectId;
        publicID: string;
        assetID: any;
        src: string;
        title: string;
        type: "image" | "video" | "raw" | "auto";
        extension: string;
    };
    APP: {
        NAME: string;
        EMAIL: string;
        PASSWORD: string;
        DB_URL: string;
        DB_NAME: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_KEY_SECRET: string;
    };
}>;
