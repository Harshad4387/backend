require('dotenv').config();
const express = require('express');
const app = express();
const dbconnect = require('./db/db.js');
dbconnect();

app.get('/', (req,res)=>{
    res.send("wlecome to server ");
})
const port = process.env.PORT   ;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})

