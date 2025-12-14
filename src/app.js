import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

//add cross-origin-resource-sharing
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//this will let it accept json with a certain limit
app.use(express.json({limit:"16kb"}))
//this will help it get nested objects
app.use(express.urlencoded({extended:true,limit:"16kb"}))
//this is to store images/fevicon etc. things
app.use(express.static("public"))

export {app};