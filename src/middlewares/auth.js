    const adminAuth=(req,res,next) =>{
    const TOKEN="abc";
    if(TOKEN !== "abc")
    {
        res.status(400).send("Unauthorized User")
    }
    else
    {
        next();
    }
}
module.exports={adminAuth}

