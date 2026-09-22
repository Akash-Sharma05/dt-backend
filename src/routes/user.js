const express = require('express');
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            status: "interested",
            toUserId: loggedInUser._id
        }).populate("fromUserId", USER_SAFE_DATA)

        if (!requests) {
            return res.status(200).send("No Requests pending!!!")
        }


        res.status(200).send({
            message: "Requests fetched successfully...", data: requests
        })

    } catch (err) {
        return res.status(400).send("ERROR : " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)
        if (!connections) {
            return res.status(400).send("Connections not found!!!")
        }
        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId;
        })
        res.status(200).send({
            message: "Connections feteched successfully...", data: data
        })

    } catch (err) {
        return res.status(400).send("ERROR : " + err.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) ||1;
        let limit = parseInt(req.query.limit)|| 10;
        
       limit = limit>50 ? 50 :limit
        const skip = (page-1)*limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({ 
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
       res.send(users)

    } catch (err) {
        return res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = userRouter;