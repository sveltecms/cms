import type { HookFuncs,HookResponse } from "./types"

/** This a demo function, will run before updating route's object */
export const beforeAddingObject:HookFuncs['beforeAdding']['object'] = async(db,funcData) => {
    const collection = db.collection(funcData.routeID)
    const slugInElements = funcData.elements.find(data=>data.type==="slug")
    // if slug exists in elements, check if object with this slug exists
    if(slugInElements){
        const slugExists = await collection.findOne({ slug:slugInElements.value })
        if(slugExists){
            // return response
            return { ok:false, msg:`Object with slug:${slugInElements.value} already exists` }
        }
    }
    // return response
    return {  ok:true, msg:"Function passed" }
}

/** This a demo function */
export async function demoFunc():Promise<HookResponse>{
    return {  ok:true, msg:"Test function passed" }
}