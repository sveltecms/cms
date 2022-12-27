// @ts-check
import fs from "fs"
import { globby } from "globby"
import { execSync } from "child_process"

const srcFilesList = await globby("./src",{expandDirectories:{files: ['*.ts','*.svelte']}})

for(const filePath of srcFilesList){
    const fileData = fs.readFileSync(filePath).toString()
    const keys = [ 'routeObjectsPerPage' ]
    const newKeys = [ 'objectsPerPage' ]
    // const keys = [
    //     "ApiSearchCategoryLoad", "ApiSearchCategoryData", "ApiCreateCategoryLoad", "ApiCreateCategoryData", "ApiUpdateCategoryLoad", "ApiUpdateCategoryData", "ApiDeleteCategoryLoad", "ApiDeleteCategoryData",
    //     "ApiSearchTagLoad", "ApiSearchTagData", "ApiCreateTagLoad", "ApiCreateTagData", "ApiUpdateTagLoad", "ApiUpdateTagData", "ApiDeleteTagLoad", "ApiDeleteTagData",
    //     "ApiCreateRouteLoad", "ApiCreateRouteData", "ApiUpdateRouteLoad", "ApiUpdateRouteData", "ApiDeleteRouteLoad", "ApiDeleteRouteData",
    //     "ApiCreateRouteObjectLoad", "ApiCreateRouteObjectData", "ApiUpdateRouteObjectLoad", "ApiUpdateRouteObjectData", "ApiDeleteObjectLoad", "ApiDeleteObjectData",
    //     "ApiCreateUserLoad", "ApiCreateUserData", "ApiUpdateUserLoad", "ApiUpdateUserData", "ApiDeleteUserLoad", "ApiDeleteUserData",
    // ]
    // const newKeys = [
    //     "ApiCategorySearchLoad", "ApiCategorySearchData", "ApiCategoryCreateLoad", "ApiCategoryCreateData", "ApiCategoryUpdateLoad", "ApiCategoryUpdateData", "ApiCategoryDeleteLoad", "ApiCategoryDeleteData",
    //     "ApiTagSearchLoad", "ApiTagSearchData", "ApiTagCreateLoad", "ApiTagCreateData", "ApiTagUpdateLoad", "ApiTagUpdateData", "ApiTagDeleteLoad", "ApiTagDeleteData" ,
    //     "ApiRouteCreateLoad", "ApiRouteCreateData", "ApiRouteUpdateLoad", "ApiRouteUpdateData", "ApiRouteDeleteLoad", "ApiRouteDeleteData",
    //     "ApiObjectCreateLoad", "ApiObjectCreateData", "ApiObjectUpdateLoad", "ApiObjectUpdateData", "ApiObjectDeleteLoad", "ApiObjectDeleteData",
    //     "ApiUserCreateLoad", "ApiUserCreateData", "ApiUserUpdateLoad", "ApiUserUpdateData", "ApiUserDeleteLoad", "ApiUserDeleteData",
    // ]
    // Loop all keys
    keys.forEach(async (key,index)=>{
        if(fileData.includes(key) && (keys.length===newKeys.length)){
            const newKey = newKeys[index]
            const newFileData = fileData.replace(new RegExp(key,"g"),newKey)
            fs.writeFileSync(filePath,newFileData)
            // execSync(`code ${filePath}`)
            // await new Promise(r=>setTimeout(r,500))
            console.log(filePath)
            // console.log(key,newKey,index)
            // console.log(newFileData)
        }
    })
}