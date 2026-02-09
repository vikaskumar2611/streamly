import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        //take instance and connect database with db_link and db_name
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //check host where connection is done
        console.log(`\n MONGODB connected !! DB HOST:${connectionInstance.connection.host}`);
    } catch(error){
        //catch error
        console.log("MONGODB connection error:",error);
        process.exit(1);
    }
}

export default connectDB;