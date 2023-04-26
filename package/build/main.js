#! /usr/bin/env node
import { existsSync } from "fs";
import { execSync } from "child_process";
import install from "./core/install.js";
import handleEnv from "./core/handleEnv.js";
import copyFiles from "./core/copyFiles.js";
import Utils from "./utils.js";
import defaults from "./core/defaults.js";
import * as templates from "./templates/index.js";
const cwd = process.cwd();
const templateNameSearch = process.argv.findIndex(data => data.includes("--t="));
const templateName = templateNameSearch > 0 ? process.argv[templateNameSearch].split("--t=")[1].trim() : "none";
const isNewInstallation = (!existsSync(`${cwd}/src/cms`) && !existsSync(`${cwd}/src/routes/admin`));
// Run new installation
if (isNewInstallation) {
    const installData = await install();
    const mongoClient = await Utils.mongoClient(installData['APP']['DB_URL']);
    const db = mongoClient.db(installData['APP']['DB_NAME']);
    // Create default asset
    await db.collection("_assets").insertOne(installData.defaultAsset);
    const defaultAssetID = installData.defaultAsset['_id'].toString();
    // Create default user and update some values with installation Data
    const userData = defaults.user;
    userData['email'] = installData['APP']['EMAIL'];
    userData['password'] = installData['APP']['PASSWORD'];
    userData['image'] = { ...installData['defaultAsset'], _id: defaultAssetID };
    await db.collection("_users").insertOne(userData);
    // Insert default app information
    await db.collection("_app").insertOne(defaults.appData);
    // Check if user wants a default template
    if (templateName !== "none") {
        // Create pages route
        await db.collection("_routes").insertMany(templates.pages.routes);
        // Create blog
        if (templateName === "blog") {
            await db.collection("_routes").insertMany(templates.blog.routes);
            await db.collection("_linkedRoutes").insertMany(templates.blog.linkedRoutes);
            await db.collection("_linkedAssets").insertMany(templates.blog.linkedAssets);
            // Show message
            Utils.log.ok("Created routes needed for blog template");
        }
    }
    // Handle .env file
    handleEnv(installData.APP);
    // Copy files
    await copyFiles();
    // Run npm commands
    Utils.log.normal("Running npm run for needed dependencies");
    execSync(defaults.runDependencies);
    Utils.log.normal("Running npm run for needed dev dependencies");
    execSync(defaults.runDevDependencies);
    Utils.log.error('WHAT TO DO NOW:\n  add alias {"cms/*":"src/cms/*"} to svelte.config.js config.kit.alias');
    // Show message
    Utils.log.ok("svelteCMS was installed");
    // Close MongoDB connection 
    await mongoClient.close();
}
// Run update
else {
    // Copy files
    await copyFiles();
    // Run npm commands
    Utils.log.normal("Running npm run for needed dependencies");
    execSync("npm install");
    execSync(defaults.runDependencies);
    Utils.log.normal("Running npm run for needed dev dependencies");
    execSync(defaults.runDevDependencies);
    // Show message
    Utils.log.ok("svelteCMS was updated");
}
