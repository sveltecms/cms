/** Object data for objects inside route:posts */
export type PostsObjectData = {
    _id:import("mongodb").ObjectId
    title:string
    slug:string
    views:number
    content:any
    addedAt:number
    updatedAt:number
    image:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}