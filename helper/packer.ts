// @ts-check
import fs from "fs-extra"
import archiver from "archiver"

const CWD = process.cwd()
const FILES_DIR_PATH = `${CWD}/package/files`
const FILES_ZIP_PATH = `${CWD}/package/files.zip`


/** Create needed cms folders */
function copyFiles(){
    // If folder exists, delete to make a new one
    if(fs.existsSync(FILES_DIR_PATH)) fs.removeSync(FILES_DIR_PATH)
    // Create build folder
    fs.mkdirSync(FILES_DIR_PATH)
    // Copy folders to cms folder path
    const cmsFolderPath = `${CWD}/src/cms`
    const routesFolderPath = `${CWD}/src/routes/admin`
    fs.copySync(cmsFolderPath,`${FILES_DIR_PATH}/cms`)
    fs.copySync(routesFolderPath,`${FILES_DIR_PATH}/admin`)
    // Copy default image
    fs.copySync(`${CWD}/static/default-image.jpeg`,`${FILES_DIR_PATH}/default-image.jpeg`)
    // Copy app.d.ts file
    fs.copySync(`${CWD}/src/app.d.ts`,`${FILES_DIR_PATH}/app.d.ts`)
    // Copy hooks.server.ts file
    fs.copySync(`${CWD}/src/hooks.server.ts`,`${FILES_DIR_PATH}/hooks.server.ts`)
    // Copy +layout.svelte file
    fs.copySync(`${CWD}/src/routes/+layout.svelte`,`${FILES_DIR_PATH}/+layout.svelte`)
    // remove all from dynamically types
    fs.writeFileSync(`${FILES_DIR_PATH}/cms/types/dynamically/index.ts`,"")
    fs.writeFileSync(`${FILES_DIR_PATH}/cms/types/dynamically/projection.ts`,"")
}

/** Put all cms folders in a zip file */
async function zipFiles(){
    // if build.zip exists, delete and create a new one
    if(fs.existsSync(FILES_ZIP_PATH)) fs.removeSync(FILES_ZIP_PATH)
    // create new build zip file
    const output = fs.createWriteStream(FILES_ZIP_PATH)
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.pipe(output)
    // Add a directory and all its contents to the archive
    // archive.file(`${FILES_DIR_PATH}`, { name:""})
    archive.directory(`${FILES_DIR_PATH}/cms`, "cms")
    archive.directory(`${FILES_DIR_PATH}/admin`, "admin")
    await archive.finalize()
}

// Run function
copyFiles()
await zipFiles()