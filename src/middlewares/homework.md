// app.use("/admin",adminAuth)

// app.use("/admin/login",(req,res,next) =>{
//     console.log("login");
//     res.send("login Sucessfully");
// })

app.use("/user",(req,res)=>{
    try{
    console.log("error is comming");
    throw new Error("errorrrrrrhhhhhhh");
    res.send("helloooooooo")
    }
    catch(err){
        res.status(501).send("error is catch"+ err)
    }
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("error in last")
    }
})

// app.use("/user",[(req, res, next) =>{
//     console.log("step 1")
//     next();
// },
// (req,res,next)=>{
//     console.log("step 1.1")
//     next();
// }
// ] )

// app.use("/user",(req, res,next) =>{
//     console.log("step 2")
//     res.send("hello")
//     next();
//     console.log("step2.1")
    
// })

// app.use("/",(req, res,next) =>{
//     console.log("step 3")
//     //res.send("yo yo")
//     console.log("step 3.1")
//     next()
// })


// app.delete("/user",(req, res) =>{
//     res.send("Database deleted successfully");
// })

// app.get("/user/:userid?/:name?/:phone?",(req, res) =>{
//     console.log(req.params);
// })
// app.post("/user",(req, res) =>{
//     res.send("Namaste Test");
// })



// app.delete("/user",(req, res) =>{
//     res.send("Namaste");
// })
