// @ts-check
import svelteCMS, { defaultAsset, defaultUser } from "./svelteCMS.js";
import { pagesRouteData,postsRouteData } from "./defaults.js"
import fs from "fs"
import { MongoClient, ObjectId } from "mongodb";
import"dotenv/config"
/**
* @typedef { import("../src/admin/types/index").UserLoad } UserLoad
* @typedef { import("../src/admin/types/index").LinkedAssetLoad } LinkedAssetLoad
*/

const cwd = process.cwd()
const assetsPath = `${cwd}/.svelteCMS/assets`
const mongoClient = new MongoClient(String(process.env.DATABASE_URL))
await mongoClient.connect()
const database = mongoClient.db(process.env.DATABASE_NAME)
// Database collections
const assetsCollection = database.collection(svelteCMS.collections.assets)
const usersCollection = database.collection(svelteCMS.collections.users)
const routesCollection = database.collection(svelteCMS.collections.routes)
const linkedAssetsCollection = database.collection(svelteCMS.collections.linkedAssets)


/** Copy and update svelteCMS file */
async function copySvelteCMSPath(){
    const svelteCMSPath = `${cwd}/src/admin/svelteCMS.ts`
    const testSvelteCMSPath = `${cwd}/svelteCMS/svelteCMS.js`
    const svelteCMSData = fs.readFileSync(svelteCMSPath).toString()
    const testSvelteCMSData = svelteCMSData.replace(/import type/g,'// import type').replace(/:\w.*=+/g,' =')
    fs.writeFileSync(testSvelteCMSPath,testSvelteCMSData)
}

/** Delete and recreate assets folder */
async function resetAssetsFolder(){
    // Delete assets folders
    if(fs.existsSync(assetsPath)) fs.rmdirSync(assetsPath, { recursive: true })
    // Create assets folder and it's subfolders
    fs.mkdirSync(`${assetsPath}`)
    fs.mkdirSync(`${assetsPath}/images`)
    fs.mkdirSync(`${assetsPath}/videos`)
    fs.mkdirSync(`${assetsPath}/audios`)
    fs.mkdirSync(`${assetsPath}/others`)
    // Copy default no image founded
    fs.copyFileSync(`${cwd}/svelteCMS/package/build/images/no-image.jpeg`,`${assetsPath}/images/no-image.jpeg`)
}

/** Drop main database (svelteCMS) if it exists */
async function dropMainDatabase(){
    const databases = await database.admin().listDatabases()
    const databaseExists = databases.databases.find(data=>data.name===process.env.DATABASE_NAME)
    if(databaseExists) await database.dropDatabase()
}

/** Create need default data for svelteCMS */
async function createDefaultData(){
    await usersCollection.insertOne(defaultUser)
    await assetsCollection.insertOne({...defaultAsset,_id:new ObjectId(defaultAsset._id)})
}

/** Create default routes */
async function createDefaultRoutes(){
    // Pages
    const pagesRouteDataExists = await routesCollection.findOne({ ID:"pages" })
    // @ts-ignore
    if(!pagesRouteDataExists) await routesCollection.insertOne(pagesRouteData)
    // Posts
    const postsRouteDataExists = await routesCollection.findOne({ ID:"posts" })
    // @ts-ignore
    if(!postsRouteDataExists) await routesCollection.insertOne(postsRouteData)
}

/** Create needed default linked assets data for svelteCMS */
async function createDefaultLinkedAssets(){
    /** @type { LinkedAssetLoad } */
    const usersLinkedAsset = { collection: svelteCMS.collections.users, target: "image" }
    const postsLinkedAsset = { collection: "posts", target: "thumbnail" }
    await linkedAssetsCollection.insertMany([usersLinkedAsset,postsLinkedAsset])
}

/** Reset all development data */
async function resetDev(){
    await copySvelteCMSPath()
    await resetAssetsFolder()
    await dropMainDatabase()
    await createDefaultLinkedAssets()
    await createDefaultData()
    await createDefaultRoutes()
}
await resetDev()

await mongoClient.close()