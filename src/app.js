const express = require('express')

const app = express();

app.use("/test",(req, res) =>{
     res.send("Hello, world! Testing");
})
app.use("/",(req, res) =>{
    res.send("Hello, world!");
})

app.listen(7777,()=>{console.log("Server listening on")});