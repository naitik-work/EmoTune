const userModel= require("../models/user.model");
const redis= require("../config/cache");
const blacklistModel= require("../models/blacklist.model");
const jwt= require("jsonwebtoken");

async function authMiddleware(req,res,next){
    const token= req.cookies.token;
    
    if(!token){
        return res.status(401).json({
            message: "Token not provided."
        })
    }
    const isTokenBlacklisted= await blacklistModel.findOne({token});
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is blacklisted. Invalid token."
        })
    }

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);

        req.user= decoded;
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }
    
    next()
}

module.exports= authMiddleware