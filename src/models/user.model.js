import mongoose,{Schema} from "mongoose"

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
     email:{
        type:String,// cloudnary url is used
        required:true,
        
    },
    coverImage:{
        type:String,// cloudnary url is used

    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"video"



        }


    ],
    password:{
        type:String,
        required:[true , "password is required"]
    },
    refreshToken:{
        type:String
    }
        
    



},{timestamps:true})


export const User = mongoose.model("user",userSchema)