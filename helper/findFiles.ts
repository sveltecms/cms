import fs from "fs"
import { globby } from "globby"
import { execSync } from "child_process"

const srcFilesList = await globby("./src",{expandDirectories:{files: ['*.ts','*.svelte']}})

for(const filePath of srcFilesList){
    const fileData = fs.readFileSync(filePath).toString()
    const keys = [
        { name:"Utils.getAppData",replaceWith:"Utils.getAppData" }
    ] 
    // check if current file contains any of the given keys
    for(const keyData of keys){
        const key = keyData.name
        const replaceWith = keyData.replaceWith
        const containsKey = fileData.match(new RegExp(key,"ig"))
        // if keys were founded in current file
        if(containsKey){
            console.log(filePath,key,replaceWith,containsKey)
            execSync(`code ${filePath}`)
        }
    }
}