const jwt =require('jsonwebtoken')
require('dotenv').config()

const verifyToken=async(req,res)=>{
    const token=req.header('x-auth-token')
    if(!token){
        return res.status(401).json({message:'No token, authorization denied'})
    }
    try{
        const decoded=jwt.verify(token,process.env.securityKey)
        req.user=decoded
        next()
    }catch(error){
        return res.status(400).json({message:'Invalid token'})
        }

};

module.exports=verifyToken;