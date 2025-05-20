//imports dependancies
const cors=require("cors");

//cors
const corsMiddleware =cors({
    origin:"*",
    methods:["GET", "POST", "PUT", "DELETE"]

});



//errorHandlerMiddleware
const errorHandlerMiddleware=(err,req,res,next)=>{
    console.error("Error",err.message);
    console.error(err.stack);//logs full error
    res.status(500).json({result:false,message:err.message || "Internal server error"})

};

//cors exports
module.exports={
    corsMiddleware ,
    errorHandlerMiddleware,
    
}