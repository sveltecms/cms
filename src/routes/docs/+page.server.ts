import { error } from "@sveltejs/kit"
import db from "cms/lib/db.server"
import type { PagesData } from "cms/types/dynamically"
import type { PagesProjection } from "cms/types/dynamically/projection"
type ResultData = Omit<PagesData, "updatedAt">

export async function load(){
    const collection = db.collection("pages")
    const filter = {}
    const projection:PagesProjection = { title:true,slug:true,content:true }
    const pageData = await collection.findOne(filter,{projection})
    // if page do not exists, throw error
    if(!pageData) throw error(404,{ message:"Page not founded "})
    // else return page data
    const page = { ...pageData,_id:pageData['_id'].toString() } as ResultData
    return { page }
}