const express=require('express');
const mongoose=require('mongoose');
const User = require('../models/user');
const Question=require('../models/question');
const router=express.Router();
const auth=require("../middleware/auth");
const jwt=require("jsonwebtoken");
const multer=require('multer');

router.post("/ask-question",auth, async(req,res)=>{
    
    const question=await Question(req.body)
    question.askedById=req.user.user_id;
    question.askedBy=req.user.name;
    
    await question.save().then((question)=>{
        question.populate("askedById").then(async(question)=>{
            const user=await User.findById({_id:question.askedById._id}).then(async(user)=>{
                console.log(user)
                user.questionsAsked.push(question._id);
                console.log(question._id);
                console.log(user.questionsAsked);
                await user.save().then((user)=>{
                    console.log("success in storing at user");
                }).catch((err)=>{
                    return res.send({status:false,message:err.message})
                })
            }).catch((err)=>{
                return res.send({status:false,message:err.message})
            })
            return res.send({status:true,question:question})
        }).catch((err)=>{
            return res.send({status:false,message:err.message})
        })
        
    }).catch((err)=>{
        return res.send({status:false,message:err.message})
    })
})

router.get("/home",auth,async(req,res)=>{
    try{
    const questions=await Question.find().sort({createdAt:-1}).exec(function(err,docs){
        if(err){
            return res.send({status:false,message:"oops! Error while fetching data,check your connection"})
        }
        return res.send({status:true,message:docs})
    })
    }catch(err){
        return res.send({status:false,err:err.message});
    }
})


router.get("/get-question/:id",async(req,res)=>{
    const question=await Question.findById({_id:req.params.id}).populate("answers").populate("askedById")
    .exec()
    .then((question)=>{
        
        if(!question){
            return res.send({status:false,message:err.message});
        }
        return res.send({status:true,message:question});

    }).catch((err)=>{
        return res.send({status:false,message:err.message});
    })
     
})



module.exports=router;