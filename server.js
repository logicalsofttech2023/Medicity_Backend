const http=require('http');
const app=require('./app');
const server=http.createServer(app);
require('dotenv').config();

const port=process.env.PORT || 3088;  // set port dynamically or 3000 if not provided by environment variable. 127.0.0.1 is localhost. 0.0.0.0 is any IP address. 8080 is common port for web servers. 80 is common port for HTTP traffic. 443 is common port for HTTPS traffic. 8081 is a


// Connect to MongoDB
const mongoose = require('mongoose');
   mongoose.connect(process.env.URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error.message));
   

    

// start the server
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});