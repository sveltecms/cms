/** Object data for objects inside route:posts */
export type PostsObjectData = {
    title:string
    slug:string
    views:number
    seoTitle:string
    seoDescription:string
    content:any
    createdAt:number
    image:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
    backupImage:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
}