import mongoose from "mongoose"

import dotenv from "dotenv";
dotenv.config()


import { DB_NAME } from "../constants.js"

console.log("Mongo URI:", process.env.MONGODB_URI);

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongodb sucessfully connected to DB ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.error("error in mongodb connection",error.message)
        process.exit(1)
        
    }

}
connectDB()
export default connectDB