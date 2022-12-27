/** Object data for objects inside route:blogPosts */
export type BlogPostsObjectData = {
    title:string
    slug:string
    views:number
    content:any
    thumbnail:{
        _id:string
        name:string
        path:string
        type:string
        extension:string
    }
    createdAt:number
    updatedAt:number
    seoTitle:string
    seoDesc:string
}