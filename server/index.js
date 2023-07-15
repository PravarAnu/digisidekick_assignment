import mongoose from "mongoose";

import config from "./src/config/index.config.js";

import app from "./src/app.js"

(async ()=>{
    try{
        await mongoose.connect(config.MONGODB_URL);
        console.log("DB Connected");

        app.on('error', (err)=>{
            console.error("Error: ", err);
            throw err;
        })

        app.listen(config.PORT, ()=>{
            console.log(`Listening on the PORT ${config.PORT}`);
        })
    }
    catch(err){
        console.error("Error: ", err);
        throw err;
    }
})()