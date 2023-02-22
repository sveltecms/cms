// @ts-check
import http from "http"
import fs from "fs"
import path from "path"
import svelteCMS from "../svelteCMS.js"

const ASSETS_FOLDER_PATH = `${process.cwd()}/${svelteCMS.paths.assets}`

/** Get asset folder using file ext
 * @param {string} ext - file extension */
function getAssetFolder(ext){
    // Images
    if(["png","webp","svg","jpe","jpeg"].includes(ext)) return "images"
    // Videos
    else if(["mp4","webm"].includes(ext)) return "videos"
    // Audios
    else if(["mp3"].includes(ext)) return "audios"
    // Others
    else return "other"
}

http.createServer((req,res)=>{
    if(!req.url) res.end()
    const fileUrlPared = path.parse(String(req.url))
    const fileName = fileUrlPared.name
    const fileExtension = fileUrlPared.ext.includes("?") ? fileUrlPared.ext.split("?")[0].slice(1) : fileUrlPared.ext.slice(1)
    const assetFolder = getAssetFolder(fileExtension)
    const filePath = `${ASSETS_FOLDER_PATH}/${assetFolder}/${fileName}.${fileExtension}`
    const fileExists = fs.existsSync(filePath)
    console.log(ASSETS_FOLDER_PATH)
    console.log(filePath)
    console.log(assetFolder)
    // If file not founded
    if(!fileExists){
        res.statusCode = 400
        res.end("File not founded")
    }
    // Images
    else if(assetFolder==="images"){
        const headers = { "Content-Type": `image/${fileExtension}` }
        res.writeHead(200, headers);
        res.end(fs.readFileSync(filePath))
    }
    // Videos or audios
    else if(assetFolder==="videos" || assetFolder==="audios"){
        const requestRange = req.headers.range;
        if(!requestRange){
            const headers = { "Content-Type": `${assetFolder==="videos"?"video":"audio"}/${fileExtension}` }
            res.writeHead(200, headers);
            const stream = fs.createReadStream(filePath)
            stream.pipe(res);
        }else{
            const videoSize = fs.statSync(filePath).size;
            const chunkSize = 1 * 1e+6;
            const start = Number(requestRange?.replace(/\D/g, ''));
            const end = Math.min(start + chunkSize, videoSize -1);
            const fileLength = end - start + 1;
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": fileLength, 
                "Content-Type": `${assetFolder==="videos"?"video":"audio"}/${fileExtension}`
            }
            res.writeHead(206, headers);
            const stream = fs.createReadStream(filePath, { start, end })
            stream.pipe(res);
        }
    }
    // File type not founded
    else{
        const headers = { "Content-Type": "text/html" }
        res.writeHead(200, headers);
        const stream = fs.createReadStream(filePath)
        stream.pipe(res);
    }
}).listen(4000)