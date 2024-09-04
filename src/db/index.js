import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const dbConnect = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        console.log(`database connected successfully  ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log(`database connection failed in db/index.js ${error.message}`);
        process.exit(1)
    }
}


export {dbConnect}
