require('dotenv').config();
const express = require('express');
const app = express();
const dbconnect = require('./db/db.js');
dbconnect();
app.use(express.json());

const port = process.env.PORT   ;
app.get('/', (req,res)=>{

    res.send("wlecome to server ");
})
const userrouter = require('./routes/user.route.js');
app.use("/api/v1/users",userrouter);
https://localhost:3000/api/v1/users/register

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
});

