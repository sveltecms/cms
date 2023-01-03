#! /usr/bin/env node
// @ts-check
import fs from "fs"
import { execSync } from "child_process"
import svelteCMS, { defaultAsset, defaultUser } from "./build/svelteCMS.js";
import dataJson from "./build/data.json" assert { type: "json" }
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt"
import inquirer from "inquirer"

const CWD = process.cwd()
const BUILD_PATH = `${process.argv[1].replace(".bin/","")}/build`
// When testing
// const BUILD_PATH = `${CWD}/svelteCMS/package/build`
const APP_NAME_SEARCH =  process.argv.find(data=>data.includes("--appName="))
const DB_UR_SEARCH =  process.argv.find(data=>data.includes("--dbUrl="))
const APP_NAME = APP_NAME_SEARCH ? APP_NAME_SEARCH.split("--appName=")[1].trim() : ""
const DB_URL = DB_UR_SEARCH ? DB_UR_SEARCH.split("--dbUrl=")[1].trim() : "mongodb://localhost:27017/"
const DB_NAME = `svelteCMS${APP_NAME!==""?`_${APP_NAME}`:""}`
const CMS_DATA_PATH = `${CWD}/.svelteCMS`
let NEW_INSTALL = true
let ROOT_PASSWORD = "sveltecms"

/** Console.log on red or green */
const colorMe = new class {
    /** @param { string } data */
    red(data) { return `\x1b[31m${data}\x1b[0m` }
    /** @param { string } data */
    green(data) { return `\x1b[32m${data}\x1b[0m` }
};

/** Run simple checks, before installing svelteCMS */
async function simpleChecks(){
    const svelteCMSExists = fs.existsSync(`${CWD}/.svelteCMS`)
    const svelteCMSRoutesExists = fs.existsSync(`${CWD}/src/routes/admin`)
    // If svelteCMS is already installed
    if(svelteCMSExists && svelteCMSRoutesExists){
        const canContinue = await inquirer.prompt({
            name:"data", type:"list",
            message:`${colorMe.red("Looks like SvelteCMS is already installed, the following files will be overwritten, continue ?")}\n    src/routes/admin\n    src/app.d.ts\n    src/hooks.server.ts`,
            choices:["yes","no"]
        })
        NEW_INSTALL = false
        // Return false
        if(canContinue.data==="no") return false
    }
    // If it's new installation
    else{
        // Ask for root user password
        const rootPassword = await inquirer.prompt({
            name:"data", type:"input",
            message:"Password for root user, what would it be ?"
        })
        ROOT_PASSWORD = rootPassword.data
    }
    return true
}

/** Create needed default data for svelteCMS */
async function createDefaultDatabaseData(){
    const mongoClient = new MongoClient(String(DB_URL))
    await mongoClient.connect()
    const database = mongoClient.db(DB_NAME)
    const databases = await database.admin().listDatabases()
    const databaseExists = databases.databases.find(data=>data.name===DB_NAME)
    // If database exists
    if(databaseExists){
        const canContinue = await inquirer.prompt({
            name:"result", type:"list",
            message:colorMe.red(`Looks like database: ${DB_NAME} already exists, it's data will be deleted: continue ?\n or pass --appName="youAppName" to use svelteCMS_youAppName as database name`),
            choices:["yes","no"]
        })
        // Return false
        if(canContinue.result==="no"){
            await mongoClient.close() ; return false
        } else await database.dropDatabase()
    }
    // Database collections
    const assetsCollection = database.collection(svelteCMS.collections.assets)
    const usersCollection = database.collection(svelteCMS.collections.users)
    const linkedAssetsCollection = database.collection(svelteCMS.collections.linkedAssets)
    // Create default needed data
    await usersCollection.insertOne({ ...defaultUser,password:await bcrypt.hash(ROOT_PASSWORD,10),_id:new ObjectId(defaultUser['_id'])})
    await assetsCollection.insertOne({...defaultAsset,_id:new ObjectId(defaultAsset._id)})
    const usersLinkedAsset = { collection: svelteCMS.collections.users, target: "image" }
    const postsLinkedAsset = { collection: "posts", target: "thumbnail" }
    await linkedAssetsCollection.insertMany([usersLinkedAsset,postsLinkedAsset])
    // Close database connection
    await mongoClient.close() ; return true
}

/** Create cms folder and sub folders */
function mkCmsDataFolder(){
    // Stop function if cms data folder exists
    if(fs.existsSync(CMS_DATA_PATH)) return
    // Else create folder
    fs.mkdirSync(CMS_DATA_PATH)
    fs.mkdirSync(`${CMS_DATA_PATH}/assets`)
    fs.mkdirSync(`${CMS_DATA_PATH}/assets/images`)
    fs.mkdirSync(`${CMS_DATA_PATH}/assets/videos`)
    fs.mkdirSync(`${CMS_DATA_PATH}/assets/audios`)
    fs.mkdirSync(`${CMS_DATA_PATH}/assets/other`)
    // Copy default asset
    fs.copyFileSync(`${BUILD_PATH}/images/no-image.jpeg`,`${CMS_DATA_PATH}/assets/images/no-image.jpeg`)
}

/** Copy admin route and admin images */
function copyAdminFolders(){
    const adminRoutesPath = `${BUILD_PATH}/routes`
    const adminStaticPath = `${BUILD_PATH}/images`
    const projectAdminRoutesPath = `${CWD}/src/routes/admin`
    const projectAdminStaticPath = `${CWD}/static/admin`
    // Delete admin and admin routes folders, if exists
    if(fs.existsSync(projectAdminRoutesPath)) fs.rmSync(projectAdminRoutesPath,{recursive:true})
    if(fs.existsSync(projectAdminStaticPath)) fs.rmSync(projectAdminStaticPath,{recursive:true})
    // Copy admin and admin routes folders
    // copy admin routes
    execSync(`cp -a ${adminRoutesPath} ${projectAdminRoutesPath}`)
    // copy admin static folder
    execSync(`cp -a ${adminStaticPath} ${projectAdminStaticPath}`)
}

/** Handle .env variables */ 
function HandleDotEnv(){
    const dotEnvFilePath = `${CWD}/.env`
    const dotEnvFilePathExist = fs.existsSync(dotEnvFilePath)
    // If .env file exists
    if(dotEnvFilePathExist){
        const dotEnvOldData = fs.readFileSync(dotEnvFilePath).toString()
        let dotEnvNewData = ""
        if(!dotEnvOldData.includes("DATABASE_URL=")) dotEnvNewData+=`\nDATABASE_URL="${DB_URL}"`
        if(!dotEnvOldData.includes("DATABASE_NAME=")) dotEnvNewData+=`\nDATABASE_NAME="${DB_NAME}"`
        fs.appendFileSync(dotEnvFilePath,dotEnvNewData)
    }
    // Else if .env do not exists
    // Add needed variables to .env file
    else{
        fs.appendFileSync(dotEnvFilePath,`DATABASE_URL="${DB_URL}"\nDATABASE_NAME="${DB_NAME}"`)
    }
}

/** Handle dependencies */ 
function handleDependencies(){
    const projectPackageJson = JSON.parse(fs.readFileSync(`${CWD}/package.json`).toString())
    // Add empty object
    if(!projectPackageJson['dependencies']) projectPackageJson['dependencies'] = {}
    // Handle dependencies
    for(const dependency of Object.entries(dataJson.dependencies)){
        const [ name,value ] = dependency
        // If data json dependency do not exists in project dev dependencies, add it
        if(!projectPackageJson['dependencies'].hasOwnProperty(name)){
            projectPackageJson['dependencies'][name] = value
        }
    }
    // Handle dev dependencies
    for(const dependency of Object.entries(dataJson.devDependencies)){
        const [ name,value ] = dependency
        // If data json dependency do not exists in project dev dependencies, add it
        if(!projectPackageJson['devDependencies'].hasOwnProperty(name)){
            projectPackageJson['devDependencies'][name] = value
        }
    }
    // Update project package.json
    fs.writeFileSync(`${CWD}/package.json`,JSON.stringify(projectPackageJson,null,4))
}

/** Handle alias */ 
function handleAlias(){
    let projectSvelteConfig = fs.readFileSync(`${CWD}/svelte.config.js`).toString()
    /** If current project contains alias */
    const aliasExists = ( projectSvelteConfig.includes("alias:") || projectSvelteConfig.includes("alias :") )
    const cmsAlias = []
    // Loop needed alias for cms
    for(const aliasData of Object.entries(dataJson.alias)){
        const [ name,value ] = aliasData
        cmsAlias.push(`    ${name}:"${value}"`)
    }
    // If svelteCMS already exists in project, remove old alias
    if(projectSvelteConfig.includes("//<svelteCMS>")){
        const innerText = projectSvelteConfig.split("//<svelteCMS>")[1].split("//</\svelteCMS>")[0]
        projectSvelteConfig = projectSvelteConfig.replace(innerText,"").replace("//<svelteCMS>","").replace("//</\svelteCMS>\n","").trim()
    }
    // If project already has alias
    if(aliasExists){
        const warningFunc = `config['onwarn'] = (warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); }`
        projectSvelteConfig = projectSvelteConfig.replace(/export.*default.*config/i,`//<svelteCMS>\n${warningFunc}\nconfig['kit']['alias'] = {\n${cmsAlias.join(",\n")},\n    ...config['kit']['alias']\n}\n//</svelteCMS>\nexport default config`)
    }
    // Else if project do not has alias
    else{
        const warningFunc = `config['onwarn'] = (warning, handler)=>{ if(warning.code.startsWith('a11y-')) return ; handler(warning); }`
        projectSvelteConfig = projectSvelteConfig.replace(/export.*default.*config/i,`//<svelteCMS>\n${warningFunc}\nconfig['kit']['alias'] = {\n${cmsAlias.join(",\n")}\n}\n//</svelteCMS>\nexport default config`)
    }
    // Update svelte.config.js
    fs.writeFileSync(`${CWD}/svelte.config.js`,projectSvelteConfig)
}

/** Copy single files like hooks.server.ts */
function handleSingleFiles(){
    const hooksFilePath = `${BUILD_PATH}/files/hooks.server.ts`
    const appDFilePath = `${BUILD_PATH}/files/app.d.ts`
    const newHooksFilePath = `${CWD}/src/hooks.server.ts`
    const newAppDFilePath = `${CWD}/src/app.d.ts`
    fs.copyFileSync(hooksFilePath,newHooksFilePath)
    fs.copyFileSync(appDFilePath,newAppDFilePath)
}

async function Main(){
    const passedSimpleChecks = await simpleChecks()
    if(passedSimpleChecks){
        if(NEW_INSTALL){
            const dbPassed = await createDefaultDatabaseData()
            if(dbPassed){
                mkCmsDataFolder()
                copyAdminFolders() 
                HandleDotEnv() 
                handleDependencies()
                handleAlias()
                handleSingleFiles()
            }
        }else{
            mkCmsDataFolder()
            copyAdminFolders() 
            HandleDotEnv() 
            handleDependencies()
            handleAlias()
            handleSingleFiles()
        }
        // Run npm install
        console.log("Running npm install, please wait") ; execSync("npm install")
        console.log(colorMe.green(`svelteCMS was ${NEW_INSTALL?"installed":"updated"}`))
        if(NEW_INSTALL){
            console.log(colorMe.green(`Default root user info:\n    email:root@sveltecms.dev\n    password:${ROOT_PASSWORD}`))
        }
    }
}
Main()