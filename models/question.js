const mongoose=require('mongoose');


const QuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    noOfLikes:{
        type:Number,
        default:0
    },
    noofAnswers:{
        type:Number,
        default:0
    },
    askedById:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    askedBy:{
        type:"String",
    },
    answers:[{type:mongoose.Schema.Types.ObjectId,ref:'Answer'}],
});


QuestionSchema.set('timestamps',true);

module.exports=mongoose.model('Question',QuestionSchema);