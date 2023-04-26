import defaults from "./defaults.js"
import Utils from "../utils.js";
// @ts-ignore
import fs from "fs-extra"; 
const cwd = process.cwd()
const projectSrcPath = `${cwd}/src`
const packageDirPath = defaults.packageDirPath

/** Copy cms files
 * step 1: copy src/cms
 * step 2: copy src/routes/admin
 */
export default async function copyFileSyncFunc(){
    const cmsPath = `${packageDirPath}/files/cms`
    const cmsPathProject = `${projectSrcPath}/cms`
    const adminPath = `${packageDirPath}/files/admin`
    const adminPathProject = `${projectSrcPath}/routes/admin`
    // Remove old folders
    if(fs.existsSync(cmsPathProject)) await fs.remove(cmsPathProject)
    if(fs.existsSync(adminPathProject)) await fs.remove(adminPathProject)
    // Copy folders
    fs.copySync(cmsPath,cmsPathProject)
    fs.copySync(adminPath,adminPathProject)
    // Copy single files
    fs.copySync(`${packageDirPath}/files/app.d.ts`,`${projectSrcPath}/app.d.ts`)
    // Check if project contains hooks.server.ts
    const hooksExists = fs.existsSync(`${projectSrcPath}/hooks.server.ts`)
    if(hooksExists){
        // check if current hook file was created by svelteCMS
        const appHooksFileData = fs.readFileSync(`${projectSrcPath}/hooks.server.ts`).toString()
        const hooksByCms = appHooksFileData.includes('sequence(cmsHook,AppHooks)') || appHooksFileData.includes('sequence(cmsHook)') 
        // if hook was not created by cms, create a file to put app hooks file data
        if(!hooksByCms){
            fs.writeFileSync(`${projectSrcPath}/appHooks.server.ts`,appHooksFileData)
            // Update hooks.server.ts file and add import appHooks.server.ts
            const newHooksFileData = fs.readFileSync(`${packageDirPath}/files/hooks.server.ts`).toString()
            .replace("import cmsHook",`import { handle as AppHooks } from "./appHooks.server"\nimport cmsHook`)
            .replace("sequence(cmsHook)",`sequence(cmsHook,AppHooks)`) 
            fs.writeFileSync(`${projectSrcPath}/hooks.server.ts`,newHooksFileData) 
        }
    }
    // else just copy hooks.server.ts
    else fs.copySync(`${packageDirPath}/files/hooks.server.ts`,`${projectSrcPath}/hooks.server.ts`)
    // check if project +layout.svelte
    const layoutExists = fs.existsSync(`${projectSrcPath}/routes/+layout.svelte`)
    if(layoutExists){
        // check if current layout file was created by svelteCMS
        const layoutData = fs.readFileSync(`${projectSrcPath}/routes/+layout.svelte`).toString()
        const layoutByCms = layoutData.includes('$page.url.pathname.startsWith("/admin")')
        // if layout was not created by cms, create a new custom layout
        if(!layoutByCms){
            fs.writeFileSync(`${projectSrcPath}/routes/Layout.svelte`,layoutData)
            Utils.log.ok("src/routes/Layout.svelte was created")
            // update project layout
            fs.copySync(`${packageDirPath}/files/+layout.svelte`,`${projectSrcPath}/routes/+layout.svelte`) 
            Utils.log.ok("src/routes/+layout.svelte was updated")
        }
    }
    // else create Layout.svelte and copy +layout.svelte if it do not exists
    else if(!fs.existsSync(`${projectSrcPath}/routes/Layout.svelte`)){
        fs.writeFileSync(`${projectSrcPath}/routes/Layout.svelte`,"<slot />")
        Utils.log.ok("src/routes/Layout.svelte was created")
        fs.copySync(`${packageDirPath}/files/+layout.svelte`,`${projectSrcPath}/routes/+layout.svelte`) 
        Utils.log.ok("src/routes/+layout.svelte was updated")
    }
}