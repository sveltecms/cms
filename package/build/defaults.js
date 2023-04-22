import { ObjectId } from "mongodb";
import { hash as bcryptHash } from "bcrypt";
import Utils from "./utils.js";
import { dirname } from "path";
const packageDirPath = `${dirname(new URL(import.meta.url).pathname)}`.replace("/build", "");
/** App information needed to install cms */
const APP = {
    EMAIL: "root@sveltecms.dev",
    PASSWORD: "test",
    DB_URL: "mongodb://localhost:27017/",
    DB_NAME: "testCms",
    CLOUDINARY_CLOUD_NAME: "dwykkubyf",
    CLOUDINARY_API_KEY: "284855553337848",
    CLOUDINARY_API_KEY_SECRET: "MdT15FcLZXNl-T2Z0Wm0LaZH6y4",
};
/** App data, public information about your project */
const appData = {
    _id: new ObjectId('000000000000000000000000'),
    site: {
        name: 'cms',
        title: 'All in one CMS for svelteKit',
        description: 'The best CMS for your svelteKit projects',
        socialMedias: { twitter: 'svelteCMS', instagram: 'svelteCMS' },
        baseUrl: '/cms'
    },
    config: {
        assetsPerSearch: 4,
        assetsPerPage: 12,
        usersPerPage: 12,
        routesPerPage: 12,
        objectsPerPage: 12,
        routesLinkedPerPage: 12,
        allowNewUser: true,
        cmsPath: '/admin'
    }
};
/** User data, NOTE: update image with default image after uploading default image */
const user = {
    _id: new ObjectId('000000000000000000000000'),
    firstName: "Svelte",
    lastName: "CMS",
    email: "root@sveltecms.dev",
    password: await bcryptHash("sveltecms", 10),
    role: "admin",
    image: { "_id": "", "publicID": "", "assetID": "", "src": "", "title": "", "type": "", "extension": "" },
    createdAt: new Date(),
    updatedAt: new Date()
};
/** Default asset */
export const assetFunc = async (cloudinaryConfig) => {
    const defaultAsset = await Utils.uploadAsset(cloudinaryConfig, `${process.cwd()}/helper/assets/default-image.jpeg`, "000000000000000000000000");
    return defaultAsset;
};
export default { user, appData, assetFunc, APP, packageDirPath };
