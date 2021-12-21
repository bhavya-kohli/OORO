const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();
const User=require('../models/user');
const Event=require('../models/event');
const auth =require('../middleware/auth');
const moment=require('moment');
const multer=require('multer');
const fs=require('fs');
const question = require('../models/question');
const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + "_" + file.originalname)
    },
});


const fileFilter=(req,file,cb)=>{
    if(file.mimetype.split("/")[1]==='pdf' || file.mimetype.split("/")[1]==='jpeg' || file.mimetype.split("/")[1]==='png'){
        cb(null,true);
    }else{
        cb(new Error("Not the suported file type PDF| jpeg| png under 8 Mb size!"),false);
    }
}


const upload=multer({storage:fileStorageEngine,
    limits:{
    fileSize:1024*1024*8
},
    fileFilter:fileFilter
})

function datetime(){
    const yourDate = new Date()
    return yourDate.toISOString().split('T')[0]
}

router.get('/',(req,res)=>{
    res.send("you have entered event")
})

router.post('/create-event',auth,upload.array('event_doc',2),async(req,res)=>{
    const data=req.body;
    console.log(req.user);
    data.organisedBy=req.user.user_id;
    data.Dos=datetime()
    data.Doe=req.body.Doe
    console.log(req.files);

    if(req.files[0]){
        data.attachmentfile=req.files[0].path;
    }
    if(req.files[1]){
        data.eImage=req.files[1].path;
    }
    if(!data){
        return res.send({status:false,message:"Please Provide Sufficient Data"});
    }
    const event=await Event(data);
    await event.save().then((event)=>{
        console.log(event);
        return res.send(event);
    }).catch((err)=>{
        return res.send({status:false,message:err.message});
    })
})


router.get('/get-event',auth,async(req,res)=>{
    try{
    const events=await Event.find({isActive:true});
    if(!events){
        return res.send({status:true,message:"No even is active for now!"});
    }
    const data={
        status:true,
        message:"success",
        events:events,
    }
    return res.send(data);

    }catch(err){
        return res.send({status:false,message:"Error While fetching Events"});
    }
})

router.post('/register-user-event/:id',auth,async(req,res)=>{
    const event=await Event.findOne({_id:req.params.id});
    if(!event || event.isActive==false){
        return res.send({status:false,message:"Event might be expired"});
    }
    event.participants.push(req.user.user_id);
    await event.save();
    return res.send({status:true,message:"user registered successfully"})
})

router.get('/get-register-list/:id',auth,async(req,res)=>{
    const filename='newfile'+Date.now().toISOString()+'.txt';
    var content='';
    await Event.findById({_id:req.params.id}).populate("participants").exec()
    .then((event)=>{
        event.participants.map((participant)=>{
            content+=participant.fullname +"\t" +participant.email +"\n"
        })
    }).catch((err)=>{
        return res.send({status:false,message:"Error while downloading file"})
    })
    fs.writeFile(filename,content,function(err){
        if(!err){
            return express.download();
        }else{
            return res.send({status:false,message:"Error while fetching file"})
        }
    })
})

router.get('/get-event-byId/:id',async(req,res)=>{
    await Event.findById({id:req.params.id}).populate("participants").exec()
    .then((event)=>{
        return res.send({status:true,message:event});
    }).catch((err)=>{
        return res.send({status:false,message:"cannot fetch the event"})
    })
})


module.exports=router;