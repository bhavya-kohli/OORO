const mongoose =require('mongoose');

const EventSchema=new mongoose.Schema({
    ename:{
        type:String,
        required:true
    },
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    Dos:{
        type:String
    },
    Doe:{
        type:String
    },
    description:{
        type:"String",
        required:true
    },
    organisedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    attachmentfile:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    eImage:{
        type:String
    }
})

module.exports=mongoose.model('Event',EventSchema);