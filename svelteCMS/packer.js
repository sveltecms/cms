// @ts-check
import fs from "fs"
import packageJson from "../package.json" assert { type: "json" }
import svelteConfig from "../svelte.config.js"
import { execSync } from "child_process";

const CWD = process.cwd()
const BUILD_PATH = `${CWD}/svelteCMS/package/build`
const CMS_DATA_PATH = `${BUILD_PATH}/.svelteCMS`
const ASSETS_PATH = `${CMS_DATA_PATH}/assets`
/** Needed dependencies */
const NEEDED_D = [ "bcrypt","mongodb","slugify" ]
/** Needed dev dependencies */
const NEEDED_D_D = [ "sass" ]

/** Delete and recreate build folder */
function mkBuild(){
    const isBuild = fs.existsSync(BUILD_PATH)
    // Delete build folder
    if(isBuild) fs.rmdirSync(BUILD_PATH,{recursive:true})
    // Create build folder
    fs.mkdirSync(BUILD_PATH)
}

/** Copy admin,images(static) and admin routes folders */
function copyNeededFolders(){
    // copy admin data
    execSync(`cp -a ${CWD}/src/admin/ ${BUILD_PATH}/admin`)
    // copy admin routes
    execSync(`cp -a ${CWD}/src/routes/admin/ ${BUILD_PATH}/routes`)
    // copy admin static folder
    execSync(`cp -a ${CWD}/static/admin/ ${BUILD_PATH}/images`)
}

/** Create data.json to save needed data */
function createNeededJsonData(){
    const originalDependencies = { ...packageJson.dependencies }
    const originalDevDependencies = { ...packageJson.devDependencies }
    const dataJson = { dependencies:{}, devDependencies:{}, alias:{} }
    // Dependencies needed
    for(const dependency of Object.entries(originalDependencies)){
        const [name,value] = dependency
        if(NEEDED_D.includes(name)) dataJson.dependencies[name]=value
    }
    // Dev dependencies needed
    for(const dependency of Object.entries(originalDevDependencies)){
        const [name,value] = dependency
        if(NEEDED_D_D.includes(name)) dataJson.devDependencies[name]=value
    }
    // @ts-ignore add alias
    dataJson.alias = svelteConfig.kit.alias
    // Save data json
    const dataJsonPath = `${BUILD_PATH}/data.json`
    fs.writeFileSync(dataJsonPath,JSON.stringify(dataJson,null,4))
}

/** Copy svelteCMS.js file to build folder */
function copySvelteCMSFile(){
    const svelteCMSPath = `${CWD}/src/admin/svelteCMS.ts`
    const buildSvelteCMSPath = `${BUILD_PATH}/svelteCMS.js`
    const svelteCMSData = fs.readFileSync(svelteCMSPath).toString()
    const newSvelteCMSData = svelteCMSData.replace(/import type/g,'// import type').replace(/:\w.*=+/g,' =')
    fs.writeFileSync(buildSvelteCMSPath,newSvelteCMSData)

}

async function Main(){
    mkBuild()
    copyNeededFolders()
    createNeededJsonData()
    copySvelteCMSFile()
}
Main()