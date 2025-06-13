require('dotenv').config({path :'./env'});
const express = require('express');
const app = express();
const dbconnect = require('./db/db.js');
dbconnect();

app.get('/', (req,res)=>{
    res.send("wlecome to server ");
})
const port = process.env.PORT  || 3000 ;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})

