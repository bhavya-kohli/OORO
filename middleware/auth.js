const { request } = require('express');
const jwt=require('jsonwebtoken');

const verifyToken=(req,res,next)=>{
    const token=req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({status:false,message:"Need authorization as login to access"})
    }
    try{
        const extract_user_if_possible=jwt.verify(token,process.env.SECRETKEY);
        req.user=extract_user_if_possible;
    }catch(err){
        return res.status(403).send({status:false,message:"Authorization error"});
    }
    return next();
}

module.exports=verifyToken;