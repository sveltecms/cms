//PROJECTION:PagesData:start
export type PagesProjection = {
    title?:boolean
    slug?:boolean
    updatedAt?:boolean
    content?:{[key:string]:boolean | {[key:string]:any}} | boolean
}
//PROJECTION:PagesProjection:end