const mongoose=require('mongoose')

const connectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    toUserId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:['ignored','interested','accepted','rejected'],
            message: `{value} is invalid`
        }
    }
},{timestamps:true })

connectionRequestSchema.index({fromUserId:1 , toUserId:1})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    {
        throw new Error("Cannot send request to yourself")
    }
    next();
})


const ConnectionRequestModel =new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequestModel