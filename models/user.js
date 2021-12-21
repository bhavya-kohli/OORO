const mongoose=require('mongoose');
const UserSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    questionsAsked:[{type:mongoose.Schema.Types.ObjectId,ref:'Question'}],
    questionsAnswered:[{type:mongoose.Schema.Types.ObjectId,ref:'Question'}],
    countQuestionsAsked:{
        type:Number
    },
    countQuestionsAnswered:{
        type:Number
    },
    token:{
        type:String
    },
    Avatar:{
        type:String,
    },
});



UserSchema.statics.isThisEmailInUse=async function(email){
    if(!email){
        console.log("IsEmailInUse problem")
        return false;
    }
    try{
        const user=await this.findOne({email})
        if(user){
            return false;
        }
        return true;
    }catch(err){
        console.log("Error inside isThisEmail Method",err)
        return false;
    }
}





module.exports=mongoose.model('User',UserSchema);