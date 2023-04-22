import { v2 as CloudinaryApi } from "cloudinary"

CloudinaryApi.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_KEY_SECRET
})


export default new class Cloudinary {
    /** Upload file */
    async uploadFile(filePath:string){
        return CloudinaryApi.uploader.upload(filePath)
    }

    /** Remove/Delete file */
    async deleteFile(publicID:string){
        return await CloudinaryApi.uploader.destroy(publicID)
    }
    /** Search files */
    async searchFile(expression:string){
        const response = CloudinaryApi.search.expression(expression)
        return response.execute()
    }
}