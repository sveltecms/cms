import"dotenv/config.js"
import generateTypes from "./utils/generateTypes.js"
import bcrypt from "bcrypt"
import cloudinary from "./utils/cloudinary.js"
import db from "./utils/db.js"
import type { GenerateDataApiData } from "./types"
import type {  AssetData, AssetLoad,RouteLoad, UserData, UserLoad } from "../src/cms/types"
import { ObjectId } from "mongodb"

type CharacterLoad = {
    email:string
    firstName:string
    lastName:string
    image:AssetData
}

/** Create default user for admin */
async function createDefaultAsset(){
    const collection = db.collection("_assets")
    const uploadRes = await cloudinary.uploadFile("package/assets/no-image.jpeg")
    const newAssetData:AssetData = {
        _id:new ObjectId("000000000000000000000000"),
        publicID: uploadRes.public_id,
        assetID: uploadRes.asset_id,
        src: uploadRes.secure_url,
        title: "No asset",
        type: uploadRes.resource_type,
        extension: uploadRes.format
    }
    const objectExists = await collection.findOne({_id:new ObjectId("000000000000000000000000")})
    if(!objectExists) await collection.insertOne(newAssetData)
    return { ...newAssetData,_id:"000000000000000000000000" }
}

/** Create default user for admin */
async function createDefaultUser(asset:AssetData){
    const collection = db.collection("_users")
    const email = "root@sveltecms.dev"
    const userData:UserLoad|UserData = {
        _id: new ObjectId("000000000000000000000000"),
        firstName: "Root",
        lastName: "User",
        email: email,
        password: await bcrypt.hash("test",10),
        role: "admin",
        image: asset,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    const objectExists = await collection.findOne({ email })
    if(!objectExists) await collection.insertOne(userData)
}

/** Create linked asset */
async function createLinkedAsset(){
    const linkedAssetsCol = db.collection("_linkedAssets")
    const linkedAssetData = {
        "fromRouteID": "characters",
        "fromKey": "image",
        "oneAsset": true
    }
    if(! await linkedAssetsCol.findOne(linkedAssetData)) await linkedAssetsCol.insertOne(linkedAssetData)
}

/** Create linked route */
async function createLinkedRoute(routeID:string){
    const linkedRoutesCol = db.collection("_linkedRoutes")
    const linkedRouteData = {
        "fromRouteID": routeID,
        "toRouteID": "characters",
        "fromKey": "character"
    }
    if(! await linkedRoutesCol.findOne(linkedRouteData)) await linkedRoutesCol.insertOne(linkedRouteData)
}

/** Create characters route */
async function createCharactersRoute(){
    const routesCol = db.collection("_routes")
    const collectionExists = await routesCol.findOne({ ID:"characters"})
    if(!collectionExists){
        const newRouteData:RouteLoad = {
            ID: "characters",
            title: "Characters",
            searchAbleKey:"email",
            elements: [
                {
                    ID:"email",
                    title:"Email",
                    type:"input",
                    value:""
                },
                {
                    ID:"firstName",
                    title:"First name",
                    type:"input",
                    value:""
                },
                {
                    ID:"lastName",
                    title:"Last name",
                    type:"input",
                    value:""
                },
                {
                    ID:"image",
                    title:"Image",
                    type:"asset",
                    value:""
                }
            ],
            meta: {
                title: "Characters",
                description: "List of all characters."
            }
        }
        // Create route
        await db.collection("_routes").insertOne(newRouteData)
    }
}

/** Create route and insert route objects */
async function createEpisodesRoute(character:GenerateDataApiData['results'][0]){
    const episodes:string[] = character.episode as any
    const routeID = character.name.trim().toLowerCase().replace(/ /g,"_").trim()+"_episodes"
    const newRouteData:RouteLoad = {
        ID: routeID,
        title: `${character.name} Episodes`,
        searchAbleKey:"title",
        elements: [
            {
                ID:"title",
                title:"Episode title",
                type:"input",
                value:""
            },
            {
                ID:"episodeNumber",
                title:"Episode number",
                type:"inputNumber",
                value:1
            },
            {
                ID:"character",
                title:"Character",
                type:"linkToRoute",
                linkTo:"characters",
                linkedSearchableKey:"email",
                value:[]
            }
        ],
        meta: {
            title: `${character.name} Episodes`,
            description: `List of all episodes that includes ${character.name}.`
        }
    }
    // Create route
    await db.collection("_routes").insertOne(newRouteData)
    // Insert episode into episodes collection
    for(const episode of episodes){
        const characterEmail = `${character.name.trim().toLowerCase().replace(" ","")}@sveltecms.dev`
        const episodeNumber = parseInt(episode.split("/episode/")[1])
        const characterData = await db.collection("characters").findOne({ email:characterEmail})
        const episodeData:{ title:string,episodeNumber:number,character:any[] } = {
            title:`Episode ${episodeNumber}`,episodeNumber,character:[{...characterData,_id:characterData?._id.toString()}]
        }
        await db.collection(routeID).insertOne(episodeData)
    }
    // return route data
    return { ...newRouteData,_id:routeID }
}

/** Create asset */
async function createAsset(src:string,title:string){
    const uploadRes = await cloudinary.uploadFile(src)
    const newAssetData:AssetLoad = {
        publicID: uploadRes.public_id,
        assetID: uploadRes.asset_id,
        src: uploadRes.secure_url,
        title: title,
        type: uploadRes.resource_type,
        extension: uploadRes.format
    }
    // Insert to collection
    const collection = db.collection("_assets")
    const insertedData = await collection.insertOne(newAssetData)
    const _id = insertedData.insertedId.toString()
    return { ...newAssetData,_id }
}

// create character
async function createUser(character:GenerateDataApiData['results'][0]) {
    const characterEmail = `${character.name.trim().toLowerCase().replace(" ","")}@sveltecms.dev`
    const newUserData:CharacterLoad = {
        firstName: character.name.split(" ")[0],
        lastName: character.name.split(" ")[1],
        email: characterEmail,
        image: await createAsset(character.image,character.name)
    }
    // Insert to collection
    const collection = db.collection("characters")
    const insertedData = await collection.insertOne(newUserData)
    return { _id:insertedData.insertedId.toString(),...newUserData }
}

/** Generate data from api */
async function generateDataFromApi() {
    let pageNum:number = 1
    while(pageNum<10){
        const apiUrl = `https://rickandmortyapi.com/api/character?page=${pageNum}`
        const request = await fetch(apiUrl)
        const response:GenerateDataApiData = await request.json()
        // Generate api response type
        generateTypes(response,"GenerateDataApiData","test/types.ts")
        // Create character and it's episodes
        for(const character of response.results){
            // check if user already exists
            const characterEmail = `${character.name.trim().toLowerCase().replace(" ","")}@sveltecms.dev`
            const characterExists = await db.collection("characters").findOne({ email:characterEmail })
            // if character do not exists, create a new one
            if(!characterExists) await createUser(character)
            // check if route already exists
            const routeID = character.name.trim().toLowerCase().replace(/ /g,"_").trim()+"_episodes"
            const routeExists = await db.collection("_routes").findOne({ ID:routeID })
            // if route do not exists, create a new one
            if(!routeExists) await createEpisodesRoute(character)
            // create linked route for character
            await createLinkedRoute(routeID)
        }
        // update page number
        pageNum = pageNum+1
    }
}

async function Main() {
    // create default asset
    const defaultAsset = await createDefaultAsset()
    // create default user
    await createDefaultUser(defaultAsset)
    // Create character route
    await createCharactersRoute()
    // create linked asset for character
    await createLinkedAsset()
    // create characters from api
    await generateDataFromApi()
}
Main().then(()=>process.exit(1))