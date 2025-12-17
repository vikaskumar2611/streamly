import dotenv from "dotenv";

import connectDB from "./database/db.js";
import {app} from "./app.js";



//config .env file after that we can use process.env.<attribute_needed>
dotenv.config({
  path: "./.env",
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000,() => {
        console.log(`Serveris running at post: ${process.env.PORT}`)
        
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!",err);
})

/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";

import express from "express";
const app = express();

;(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",() => {
            console.log("ERRR: ",error);
            throw err;
        })

        app.listen(process.env.PORT,() => {
            console.log(`app is running at ${process.env.PORT}`)
        })
    } catch(error){
        console.error("Error: ", error);
        throw err;
    }
})()
    */