const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose.connect(
    "mongodb+srv://rolidixitt26:ShikharD@namasteshikharnode.01slx.mongodb.net/devTinder"
  );

};

module.exports = {connectdb};

//connectdb().then(()=>{console.log("successfull")}).catch((err)=>{console.log("didnt")})
