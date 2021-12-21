const mongoose=require('mongoose');

const AnswerSchema=new mongoose.Schema({
    answer:{
        type:String,
    },
    likes:{
        type:Number,
    },
    dislike:{
        type:Number,
    },
    answeredBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    answerOf:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    },
})

AnswerSchema.set('timestamps',true);

module.exports=mongoose.model('Answer',AnswerSchema);