import dotenv from "dotenv";
import connectDB from "./db/index.js";

import app from "./app.js"

dotenv.config({
    path:'./env'})

connectDB() 

.then(()=>{

    app.on("error" ,(error)=>{
        console.log("ERRR",error);
        throw error

    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`the server is listening at ${process.env.PORT}`);
        
    })
})

.catch((error)=>{

    console.log("MONGO DB CONNECTION FAILED",error)

})
