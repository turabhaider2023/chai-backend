import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessandRefreshTokens = async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating Access and Refresh Tokens") 
        
    }


}

const registerUser = asyncHandler( async(req,res,next)=>{
   // get user details from frontend
   // validation - not empty
   // check if user already exist: username,email
   // check for images, check for avatar
   // upload them to cloudinary
   // create user object-create entry in db
   // remove password and refresh token field from response
   // check for user creation :
   // return res
   console.log("registerUser route hit ✅");



  const { fullname, username, password, email } = req.body;

  console.log("email", email);

 if(
    [fullname,username,password,email].some((field)=>field?.trim()==="")
)
{
    throw new ApiError(400,"all field are compulsory")  
}

 const existed_user=await User.findOne({
    $or:[{username},{email}]
})
if(existed_user){
    throw new ApiError(409,"User with email or username alredy exist")
}
const avatarLocalPath=req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"avatar path is required")
}

const avatar =await uploadoncloudinary(avatarLocalPath)
const coverImage = await uploadoncloudinary(coverImageLocalPath)

if(!avatar){
   throw new ApiError(400,"avatar path is required for it ") 
}
const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username.toLowerCase()

})


const createdUser =await User.findById(user._id).select(
    "-password -refreshToken"
)
if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
}

return res.status(201).json(
 
    new ApiResponse(201,createdUser,"user registered sucessfully")

)

})

const loginUser = asyncHandler(async (req,res)=>{
    // reqbody->data
    // username ,email
    // find the user
    // password check
    //access token ,refresh token 
    // send cookies
   const  {username,email,password}=req.body

   if(!username||!email){
    throw new ApiError(400,"username or email is required")
   }

  const user= await User.findOne({
    $or:[{email},{username}]
   })
   if(!user){
    throw new ApiError(404,"user does not exist")
   }
   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid){
    throw new ApiError(401,"invalid user ceredentials")
   }
   const {accessToken,refreshToken} = await generateAccessandRefreshTokens(user._id)

   const loggedInUser=await User.findById(user._id).
   select("-password -refreshToken")

   const options = {
    httpOnly:true,
    secure:true
   }
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user logged in sucessfully"
    )
   )


})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        },
        
    },
    {
        new:true
    }

    )

    
   const options = {
    httpOnly:true,
    secure:true
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged out"))
})

export { registerUser,loginUser,logoutUser }
