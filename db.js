const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_URI,{
    useUnifiedTopology:true
}).then(()=>{
    console.log("Database Connected");
}).catch((e)=>{
    console.log("error");
    throw new Error(e);
})