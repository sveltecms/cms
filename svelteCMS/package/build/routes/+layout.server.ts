import cms from "$Cms"
import svelteCMS from "$svelteCMS"
import { ROUTES } from "$Stores"
import { capitalize,getElementType } from "$Utilities"
import { dev as isDevMode } from "$app/environment"
import { writeFileSync } from "fs"
import type { RouteData } from "$Types"
import type { LayoutServerLoad } from "./$types"

export const load:LayoutServerLoad = async()=>{
    const routes = await cms.Fetch.routes({ filter:{},count:svelteCMS.config.routesPerPage })
    // Set server stores
    ROUTES.set(routes)
    // Auto generate types on dev mode
    if(isDevMode && routes.length>0) makeRoutesTypes(routes)
    // Return objects
    return { routes:routes } 
}
 
/** Auto make types for object */
function makeRoutesTypes(routes:RouteData[]){
    /** All the routes objects */
    let objectsTypes = ""
    for(const route of routes){
        // Loop elements in route
        let objectType = `/** Object data for objects inside route:${route.ID} */\nexport type ${capitalize(route.ID)}ObjectData = {\n`
        for(const element of route.elements){
            const IDtype = getElementType(element.type)
            objectType+=`    ${element.ID}:${IDtype}\n`
        }
        // Complete object type for current route
        objectType+="}"
        // Add object type to objects type
        objectsTypes+=`${objectType}\n\n`
    }
    // Save types
    const typePath = `${process.cwd()}/src/admin/types/dynamically/objects.ts`
    const typeData = objectsTypes.trimEnd()
    writeFileSync(typePath,typeData)
}

