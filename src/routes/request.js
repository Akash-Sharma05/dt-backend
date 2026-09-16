const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router()
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const ALLOWED_STATUS = ["ignored", "interested"];

        if (!ALLOWED_STATUS.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type: " + status
            })
        }
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ]
        });
        if (existingRequest) {
            return res.status(400).send({
                message: "Connection Request already exists!!!"
            })
        }

        if (existingRequest) {
            return res.status(400).json({
                message: "Request already sent!!!"
            })
        }

        const connectionRequest = await new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const sender = await User.findOne({ _id: fromUserId });
        const receiver = await User.findOne({ _id: toUserId });


        const data = await connectionRequest.save();
        res.status(200).send({
            message: sender.firstName + " is "+ status + " in " + receiver.firstName
        })

    } catch (err) {
        return res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = requestRouter;