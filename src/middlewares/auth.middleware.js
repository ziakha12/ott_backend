import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req , _, next)=>{
    try {
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" , "");
        if(!token){
            throw new apiError(401 , "unAuthorized Request")
        }
        const decodedToken  = jwt.verify(token , process.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new apiError(401 , "Invalid Access Token")
        }
        req.user = user

        next()
    }
     catch (error) {
        throw new apiError(401 , error?.message || "Invalid access Token in verifyJwt/catch")
    }
})


export {verifyJWT}