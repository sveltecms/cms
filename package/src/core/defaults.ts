import { ObjectId } from "mongodb"
import { hash as bcryptHash } from "bcrypt"
import Utils from "../utils.js"
import { dirname } from "path"
import type { CloudinaryConfig } from "../utils.js"
import type { AssetData, UserData } from "../types/index.js"
const packageDirPath = `${dirname(new URL(import.meta.url).pathname)}`.split("/build")[0]
const runDependencies = `npm install bcrypt cloudinary date-fns dotenv mongodb slugify`
const runDevDependencies = `npm install sass -D`

/** App information needed to install cms */
const APP = {
    NAME:"svelteCMSApp",
    EMAIL:"root@sveltecms.dev",
    PASSWORD:"test",
    DB_URL:"mongodb://localhost:27017/",
    DB_NAME:"svelteCMS",
    CLOUDINARY_CLOUD_NAME:"",
    CLOUDINARY_API_KEY:"",
    CLOUDINARY_API_KEY_SECRET:"",
}

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
}

/** User data, NOTE: update image with default image after uploading default image */
const user: UserData = {
    _id: new ObjectId('000000000000000000000000'),
    firstName: "Svelte",
    lastName: "CMS",
    email: "root@sveltecms.dev",
    password: await bcryptHash("sveltecms",10),
    role: "admin",
    image: { "_id":"","publicID": "","assetID": "","src": "","title": "","type": "","extension": "" },
    createdAt: new Date(),
    updatedAt: new Date()
}


/** Default asset */
export const assetFunc = async(cloudinaryConfig:CloudinaryConfig) => {
    const defaultAsset = await Utils.uploadAsset(cloudinaryConfig,`${process.cwd()}/helper/assets/default-image.jpeg`,"000000000000000000000000") as AssetData
    return defaultAsset
}

export default { user,appData,assetFunc,APP,packageDirPath,runDependencies,runDevDependencies }