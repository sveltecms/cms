import type { ObjectId } from "mongodb"
import type { AssetData } from "./asset"

/** Data needed to create new user */
export type UserLoad = {
    firstName:string
    lastName:string
    email:string
    password:string
    image:AssetData
    verified:boolean
    role:"root"|"admin"|"user"
    /** MongoDB _id only to bypass type checks */
    _id?:ObjectId
}
/** Data return from user object */
export interface UserData extends UserLoad{ _id:any }