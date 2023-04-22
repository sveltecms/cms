import { ObjectId } from "mongodb";
import type { CloudinaryConfig } from "../utils.js";
import type { AssetData, UserData } from "../types/index.js";
/** Default asset */
export declare const assetFunc: (cloudinaryConfig: CloudinaryConfig) => Promise<AssetData>;
declare const _default: {
    user: UserData;
    appData: {
        _id: ObjectId;
        site: {
            name: string;
            title: string;
            description: string;
            socialMedias: {
                twitter: string;
                instagram: string;
            };
            baseUrl: string;
        };
        config: {
            assetsPerSearch: number;
            assetsPerPage: number;
            usersPerPage: number;
            routesPerPage: number;
            objectsPerPage: number;
            routesLinkedPerPage: number;
            allowNewUser: boolean;
            cmsPath: string;
        };
    };
    assetFunc: (cloudinaryConfig: CloudinaryConfig) => Promise<AssetData>;
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
    packageDirPath: string;
    runDependencies: string;
    runDevDependencies: string;
};
export default _default;
