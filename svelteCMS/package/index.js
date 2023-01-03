#! /usr/bin/env node
// @ts-check
import svelteCMS, { defaultAsset, defaultUser } from "./build/svelteCMS.js";
import dataJson from "./build/data.json" assert { type: "json" }
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt"
import inquirer from "inquirer"
import fs from "fs"
import path from "path"
import { execSync } from "child_process"

const CWD = process.cwd()
const BUILD_PATH = `${path.dirname(new URL(import.meta.url).pathname)}/build`
let NEW_INSTALL = !fs.existsSync(`${CWD}/.svelteCMS`) && !fs.existsSync(`${CWD}/src/routes/admin`)
let APP = {
    name:"TestApp",
    email:"root@sveltecms.dev",
    password: "sveltecms",
    dbName:"svelteCMS",
    dbUrl:"mongodb://localhost:27017/",
    assetsDirPath:`${CWD}/.svelteCMS`
}

async function askQuestion(question,defaultValue){
    const objectData = { message:question,type:"input",name:"data" }
    if(defaultValue) objectData['default'] = defaultValue
    // @ts-ignore
    return inquirer.prompt(objectData)
}

const colorMe = new class {
    red(data) { return `\x1b[31m${data}\x1b[0m` }
    green(data) { return `\x1b[32m${data}\x1b[0m` }
};


/** Create needed default data for svelteCMS */
async function createDefaultDatabaseData(){
    const mongoClient = new MongoClient(String(APP.dbUrl))
    await mongoClient.connect()
    const database = mongoClient.db(APP.dbName)
    const databases = await database.admin().listDatabases()
    const databaseExists = databases.databases.find(data=>data.name===APP.dbName)
    // If database exists
    if(databaseExists){
        const canContinue = await inquirer.prompt({
            name:"result", type:"list",
            message:colorMe.red(`Looks like database: ${APP.dbName} already exists, it's data will be deleted: continue ?\n or pass --appName="youAppName" to use svelteCMS_youAppName as database name`),
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
    await usersCollection.insertOne({ ...defaultUser,password:APP.password,_id:new ObjectId(defaultUser['_id'])})
    await assetsCollection.insertOne({...defaultAsset,_id:new ObjectId(defaultAsset._id)})
    const usersLinkedAsset = { collection: svelteCMS.collections.users, target: "image" }
    const postsLinkedAsset = { collection: "posts", target: "thumbnail" }
    await linkedAssetsCollection.insertMany([usersLinkedAsset,postsLinkedAsset])
    // Close database connection
    await mongoClient.close() ; return true
}

/** Create .svelteCMS folder */
function handleAssetsFolder(){
    // Stop function if cms data folder exists
    if(fs.existsSync(APP.assetsDirPath)) return
    // Else create folder
    fs.mkdirSync(APP.assetsDirPath)
    fs.mkdirSync(`${APP.assetsDirPath}/assets`)
    fs.mkdirSync(`${APP.assetsDirPath}/assets/images`)
    fs.mkdirSync(`${APP.assetsDirPath}/assets/videos`)
    fs.mkdirSync(`${APP.assetsDirPath}/assets/audios`)
    fs.mkdirSync(`${APP.assetsDirPath}/assets/other`)
    // Copy default asset
    fs.copyFileSync(`${BUILD_PATH}/images/no-image.jpeg`,`${APP.assetsDirPath}/assets/images/no-image.jpeg`)
}

/** Copy admin route and admin images */
function handleAdminFolders(){
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
        if(!dotEnvOldData.includes("DATABASE_URL=")) dotEnvNewData+=`\nDATABASE_URL="${APP.dbUrl}"`
        if(!dotEnvOldData.includes("DATABASE_NAME=")) dotEnvNewData+=`\nDATABASE_NAME="${APP.dbName}"`
        fs.appendFileSync(dotEnvFilePath,dotEnvNewData)
    }
    // Else if .env do not exists
    // Add needed variables to .env file
    else{
        fs.appendFileSync(dotEnvFilePath,`DATABASE_URL="${APP.dbUrl}"\nDATABASE_NAME="${APP.dbName}"`)
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
    if(NEW_INSTALL){
        // ASK FOR APP NAME
        const askAppName = await askQuestion("What should we named your app:",APP.name)
        APP['name'] = askAppName.data
        APP['dbName'] = `svelteCMS_${askAppName.data}`
        // ASK FOR EMAIL
        const askEmail = await askQuestion("What should be the default email:",APP.email)
        APP['email'] = askEmail.data
        // ASK FOR PASSWORD
        const askPassword = await askQuestion("What should be the default password:",APP.password)
        APP['password'] = await bcrypt.hash(askPassword.data,10)
        // ASK FOR DB URL
        const askDatabaseUrl = await askQuestion("MongoDB url:",APP.dbUrl)
        APP['dbUrl'] = askDatabaseUrl.data
    }else{
        const warningMsg = `${colorMe.red("Looks like SvelteCMS is already installed, the following files will be overwritten, continue: yes/no")}\n    src/routes/admin\n    src/app.d.ts\n    src/hooks.server.ts`
        const askWarning = await askQuestion(warningMsg,"yes")
        const canContinue = askWarning.data
        // Stop function
        if(canContinue.toLowerCase()!=="yes") return
    }

    // Check if database exists, if yes tell user data will be deleted
    if(NEW_INSTALL){
        const canContinue = await createDefaultDatabaseData()
        // Stop function
        if(!canContinue) return
    }
    handleAssetsFolder()
    handleAdminFolders()
    HandleDotEnv()
    handleDependencies()
    handleAlias()
    handleSingleFiles()
    // Run npm install
    console.log("Running npm install, please wait") ; execSync("npm install")
    console.log(colorMe.green(`svelteCMS was ${NEW_INSTALL?"installed":"updated"}`))
}
Main()