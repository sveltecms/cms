// @ts-check
import fs from "fs"
import packageJson from "../package.json" assert { type: "json" }
import svelteConfig from "../svelte.config.js"
import { execSync } from "child_process";

const CWD = process.cwd()
const BUILD_PATH = `${CWD}/svelteCMS/package/build`
/** Needed dependencies */
const NEEDED_DEPENDENCIES = [ "bcrypt","mongodb","slugify","@anthony809/svelte-editor","@anthony809/svelte-head","@anthony809/svelte-toasts","@anthony809/svelte-draggable" ]
/** Needed dev dependencies */
const NEEDED_DEV_DEPENDENCIES = [ "sass" ]

/** Delete and recreate build folder */
function mkBuildFolder(){
    const isBuild = fs.existsSync(BUILD_PATH)
    // Delete build folder
    if(isBuild) fs.rmdirSync(BUILD_PATH,{recursive:true})
    // Create build folder
    fs.mkdirSync(BUILD_PATH)
    // Create files folder
    fs.mkdirSync(`${BUILD_PATH}/files`)
}

/** Copy svelteCMS.js file to build folder */
function copySvelteCMSFile(){
    const svelteCMSPath = `${CWD}/src/routes/admin/_core/svelteCMS.ts`
    const buildSvelteCMSPath = `${BUILD_PATH}/svelteCMS.js`
    const svelteCMSData = fs.readFileSync(svelteCMSPath).toString()
    const newSvelteCMSData = svelteCMSData.replace(/import type/g,'// import type').replace(/:\w.*=+/g,' =')
    fs.writeFileSync(buildSvelteCMSPath,newSvelteCMSData)
}

/** Copy admin route and admin assets */
function copyNeededFolders(){
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
        if(NEEDED_DEPENDENCIES.includes(name)) dataJson.dependencies[name]=value
    }
    // Dev dependencies needed
    for(const dependency of Object.entries(originalDevDependencies)){
        const [name,value] = dependency
        if(NEEDED_DEV_DEPENDENCIES.includes(name)) dataJson.devDependencies[name]=value
    }
    // @ts-ignore add alias
    dataJson.alias = svelteConfig.kit.alias
    // Save data json
    const dataJsonPath = `${BUILD_PATH}/data.json`
    fs.writeFileSync(dataJsonPath,JSON.stringify(dataJson,null,4))
}

function copySingleFiles(){
    const hooksFilePath = `${CWD}/src/hooks.server.ts`
    const appDPath = `${CWD}/src/app.d.ts`
    const exportFilePath = `${CWD}/svelteCMS/files/export.js`
    const importFilePath = `${CWD}/svelteCMS/files/import.js`
    // Save files
    const newHooksFilePath = `${BUILD_PATH}/files/hooks.server.ts`
    const newAppDData = `${BUILD_PATH}/files/app.d.ts`
    const newExportFilePath = `${BUILD_PATH}/files/export.js`
    const newImportFilePath = `${BUILD_PATH}/files/import.js`
    fs.copyFileSync(hooksFilePath,newHooksFilePath)
    fs.copyFileSync(appDPath,newAppDData)
    fs.copyFileSync(exportFilePath,newExportFilePath)
    fs.copyFileSync(importFilePath,newImportFilePath)
}

async function Main(){
    mkBuildFolder()
    copySvelteCMSFile()
    copyNeededFolders()
    createNeededJsonData()
    copySingleFiles()
}
Main()