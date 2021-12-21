const express=require('express');
const mongoose=require('mongoose');
const User = require('../models/user');
const Answer=require('../models/answer');
const Question=require('../models/question');
const router=express.Router();
const auth=require("../middleware/auth");


router.post('/comment/:id',auth,async(req,res)=>{
    const answer=await Answer(req.body)
    answer.answeredBy=req.user.user_id;
    answer.answerOf=req.params.id;
    await answer.save().then(async(ans)=>{
        console.log(ans);
        const question=await Question.findById({_id:ans.answerOf}).exec()
        .then(async(question)=>{
            question.answers.push(ans._id)
            await question.save()
            .then((question)=>{
                console.log(question)
                return res.send({status:true,message:"done"})
            }).catch((err)=>{
                return res.send({status:false,message:"cannot save the changes"})
            })
        }).catch((err)=>{
            return res.send({status:false,message:"cannot find post"})
        }) 
    }).catch((err)=>{
        return res.send({status:false,message:"abot"})
    })
})

module.exports=router;