const multer=require('multer');

const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + "_" + file.originalname)
    },
});

module.exports=fileStorageEngine;