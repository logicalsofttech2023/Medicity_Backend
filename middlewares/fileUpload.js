const multer=require('multer');

//use multer
const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    },

});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});


module.exports=upload;