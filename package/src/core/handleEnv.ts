import * as fs from "fs"
import defaults from "./defaults.js"

type APP = typeof defaults.APP
const cwd = process.cwd()
const envPath = `${cwd}/.env`

export default function handleEnv(appData:APP){
    const envFileExists = fs.existsSync(envPath)
    const envData = `\nDB_URL="${appData['DB_URL']}"
DB_NAME="${appData['DB_NAME']}"
CLOUDINARY_CLOUD_NAME="${appData['CLOUDINARY_CLOUD_NAME']}"
CLOUDINARY_API_KEY="${appData['CLOUDINARY_API_KEY']}"
CLOUDINARY_API_KEY_SECRET="${appData['CLOUDINARY_API_KEY_SECRET']}"`
    // if .env file do not exists
    if(!envFileExists) fs.writeFileSync(envPath,envData)
    else fs.appendFileSync(envPath,envData)
}