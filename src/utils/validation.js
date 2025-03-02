const validator=require("validator")

const validateSignUp=(req)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName)
    {
        throw new Error("Name is not vvalid")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not Strong")
    }
}

const validateProfileEditData =(req)=>{
    const allowedEditFields = ["firstName","lastName","age","gender","photoUrl","about","skills"]
    const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditFields.includes(field))
    return isEditAllowed
}

module.exports={ validateSignUp,validateProfileEditData}