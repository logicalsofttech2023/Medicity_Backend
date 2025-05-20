const express=require('express');
const app=express();


const {
    corsMiddleware,
    errorHandlerMiddleware,
}=require("./middlewares/middleware");
const path=require('path');

// Middleware to handle CORS

// Middleware to parse JSON
app.use(express.json());
app.use("/uploads",express.static(path.join(__dirname,'uploads')));

// Serve static files from React app
app.use(express.static(path.join(__dirname, './build')));

// Catch-all handler for any request that doesn't match the above routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

//use cors middleware
app.use(corsMiddleware);

 const userRouter=require('./routers/userRouter');
 const adminRouter=require('./routers/adminRouter');

app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);



// test api
app.get("/",async(req,res)=>{
    res.send("Welcome to the server");
});

// Error handling middleware

app.use(errorHandlerMiddleware);

module.exports=app;

// This is where the server starts listening for incoming requests.