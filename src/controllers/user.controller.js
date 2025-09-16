import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async(req,res)=>{
    console.log("requestcheck" ,req.body)
    res.status(200).json({
        message:"ok ji shukriya"
    })
})


export {registerUser}
