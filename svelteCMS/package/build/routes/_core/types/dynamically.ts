/** Object data for objects inside route:posts */
export type PostsObjectData = {
    title:string
    _id:import("mongodb").ObjectId
    _status:import("$Types").StatusData
    _createdAt:number
    _updatedAt:number
    _categories:import("$Types").CategoryData[]
    _tags:import("$Types").TagData[]
}