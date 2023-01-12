/** Object data for objects inside route:posts */
export type PostsObjectData = {
    title:string
    slug:string
    images:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }[]
    content:any
    thumbnail:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
    _id:import("mongodb").ObjectId
    _status:import("$Types").StatusData
    _createdAt:number
    _updatedAt:number
    _categories:import("$Types").CategoryData[]
    _tags:import("$Types").TagData[]
}