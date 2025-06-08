const express = require("express");
const userRouter = express.Router();
const { authuser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests/received", authuser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        //populate("formUserId",["firstName","lastName"])

        res
            .status(200)
            .json({ message: "Data Fetched Successfully", data: connectionRequest });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", authuser, async (req, res) => {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
        $or: [
            { fromUserId: loggedInUser._id, status: "accepted" },
            { toUserId: loggedInUser._id, status: "accepted" },
        ],
    })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequest.map((row) => {
        if (row.fromUserId._id === loggedInUser._id) {
            return row.toUserId;
        }
        return row.fromUserId;
    });
    res.status(200).json({ data });
});

userRouter.get("/feed", authuser, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page=parseInt(req.query.page) ||1;
        let limit=parseInt(req.query.limit) ||10;
        limit=limit>50? 50 :limit;
        const skip=(page-1)*limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
       
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
       
        res.status(200).json({data:users});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;
