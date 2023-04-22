import defaults from "./defaults.js";
import Utils from "../utils.js";
import inquirer from "inquirer";
const APP = defaults.APP;
/** Ask user information */
async function askAndSet(message, type, defaultData, setToAPP) {
    const question = await inquirer.prompt({ message, type, name: "data", default: defaultData });
    // Data is required
    if (question.data !== false && !question.data || (type === "input" && question.data.trim() === "")) {
        Utils.log.error(`Data is required:${message}`);
        process.exit(1);
    }
    // Return data
    const data = (type === "input" && question.data.trim() === "") ? question.data.trim() : question.data;
    if (setToAPP)
        APP[setToAPP] = data;
    return data;
}
export default async function install() {
    // Ask and set Project name
    await askAndSet("Give your project a unique name, it will be use for AUTH", "input", APP['NAME'], "NAME");
    // Ask and set MongoDB connection url
    await askAndSet("MongoDB connection url", "input", APP['DB_URL'], "DB_URL");
    // Test mongodb connection
    const dbConnected = await Utils.testMongoDBCon(APP['DB_URL']);
    // if mongodb test did not passed, stop function
    if (!dbConnected) {
        Utils.log.error(`Could not connect to MongoDB connection url:${APP['DB_URL']}`);
        process.exit(1);
    }
    // Ask and set Database name
    await askAndSet("MongoDB database name", "input", APP['DB_NAME'], "DB_NAME");
    // Make sure user know that db will be deleted
    const dbWillBeDeleted = await askAndSet(`Database:${APP['DB_NAME']} will be deleted, continue ?`, "confirm");
    if (!dbWillBeDeleted) {
        Utils.log.error("Installation canceled");
        process.exit(1);
    }
    else {
        // Delete database database 
        await Utils.deleteDatabase(APP['DB_URL'], APP['DB_NAME']);
        Utils.log.ok(`Database:${APP['DB_NAME']} was deleted`);
    }
    // Ask and set cloudinary information (cloud name, api key and api key secret)
    await askAndSet("CLOUDINARY > cloud name", "input", APP['CLOUDINARY_CLOUD_NAME'], "CLOUDINARY_CLOUD_NAME");
    await askAndSet("CLOUDINARY > cloud api key", "input", APP['CLOUDINARY_API_KEY'], "CLOUDINARY_API_KEY");
    await askAndSet("CLOUDINARY > cloud api key secret", "input", APP['CLOUDINARY_API_KEY_SECRET'], "CLOUDINARY_API_KEY_SECRET");
    // Test cloudinary data
    const cloudinaryConfig = { CLOUD_NAME: APP['CLOUDINARY_CLOUD_NAME'], API_KEY: APP['CLOUDINARY_API_KEY'], API_KEY_SECRET: APP['CLOUDINARY_API_KEY_SECRET'] };
    const defaultAssetPath = `${defaults.packageDirPath}/files/default-image.jpeg`;
    const defaultAsset = await Utils.uploadAsset(cloudinaryConfig, defaultAssetPath, "000000000000000000000000");
    if (!defaultAsset) {
        Utils.log.error("Could not connect to your cloudinary account\nCheck your CLOUDINARY config data");
        process.exit(1);
    }
    // Ask and set Default user and password, after that hash password
    await askAndSet("Default user email for svelteCMS", "input", APP['EMAIL'], "EMAIL");
    await askAndSet(`Default user password for email:${APP['PASSWORD']}`, "input", APP['PASSWORD'], "PASSWORD");
    APP['PASSWORD'] = await Utils.hash(APP['PASSWORD']);
    return { defaultAsset, APP };
}
