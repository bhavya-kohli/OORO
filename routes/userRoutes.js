const express=require('express');
const mongoose=require('mongoose');
const User = require('../models/user');
const router=express.Router();
const auth=require("../middleware/auth");
const jwt=require("jsonwebtoken");
const multer=require('multer');
//const fileStorageEngine=require('../fileStorageEngine/storageEngine');

const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images/")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + "_" + file.originalname)
    },
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
}

const upload=multer({storage:fileStorageEngine,
    limits:{
    fileSize:1024*1024*4
},
fileFilter:fileFilter
});


router.post('/create-user',upload.single('image'),async(req,res)=>{
    const isNewUser=await User.isThisEmailInUse(req.body.email);
    if(!isNewUser){
        return res.json({success:false,message:"Email existed"})
    }
    const user=await User(req.body);
    const token=jwt.sign({user_id:user._id,email:user.email,name:user.fullname},process.env.SECRETKEY);
    user.token=token;
    user.countQuestionsAsked=user.questionsAsked.length;
    user.countQuestionsAnswered=user.questionsAnswered.length;
    //user.Avatar=req.file.path
    console.log(req.file);
    if(req.file){
        user.Avatar=req.file.path
    }
    await user.save().then((user)=>{
        console.log(user);
        res.send(user);
    }).catch((err)=>{
        res.send({status:false,message:err.message});
    })
})

router.post('/login-user',async(req,res)=>{

    const isValid=await User.findOne({email:req.body.email});
    if(!isValid){
        res.send({status:false,message:"credentials doesnot match"})
    }
    const user=await User.findOne({email:req.body.email,password:req.body.password})
    if(!user){
        res.send({status:false,message:"credentials doesnot match"})
    } 

    const token=jwt.sign({user_id:user.id,email:user.email,name:user.fullname},process.env.SECRETKEY);
    user.token=token;
    res.send(user);
})

router.get('/profile',auth,async(req,res)=>{
        const user=await User.findOne({_id:req.user.user_id})
        .exec()
        .then((user)=>{
            user.populate("questionsAsked").then((user)=>{
                return res.send({status:true,user:user})
            }).catch((err)=>{
                return res.send({status:false,message:err.message});    
            })
        }).catch((err)=>{
            return res.send({status:false,message:err.message});
        })
})

router.get('/profile/:id',auth,async(req,res)=>{
    const user=await User.findById({_id:req.params.id}).populate("questionsAsked").populate("questionsAnswered")
    .select("_id fullname email questionsAsked questionsAnswered Avatar countQuestionsAsked countQuestionsAnswered")
    .exec()
    .then((user)=>{
        console.log(user);
        return res.send({status:true,user:user})
    }).catch((err)=>{
        return res.send({status:false,message:err.message})
    })
})


router.get('/authtest',auth,(req,res)=>{
    res.send("auth tested successfully");
})


module.exports=router;