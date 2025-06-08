const express = require("express");
const requestRouter = express.Router();
const { authuser } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authuser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "invalid status type" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "user not found" });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already exist" });
      }
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authuser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const {status,requestId}=req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      console.log(requestId);
      console.log(loggedInUser._id);
      // console.log(loggedInUser._id);
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({ message: "Connection Request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }
  }
);
module.exports = requestRouter;


