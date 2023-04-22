
//TFromJ:GenerateDataApiData:start
export type GenerateDataApiData = {
    info:GenerateDataApiDataInfo
    results:GenerateDataApiDataResults[]
}
export type GenerateDataApiDataResults = {
    id:number
    name:string
    status:string
    species:string
    type:string
    gender:string
    origin:GenerateDataApiDataResultsOrigin
    location:GenerateDataApiDataResultsLocation
    image:string
    episode:string
    url:string
    created:string
}
export type GenerateDataApiDataResultsLocation = {
    name:string
    url:string
}
export type GenerateDataApiDataResultsOrigin = {
    name:string
    url:string
}
export type GenerateDataApiDataInfo = {
    count:number
    pages:number
    next:string
    prev:string
}
//TFromJ:GenerateDataApiData:end

