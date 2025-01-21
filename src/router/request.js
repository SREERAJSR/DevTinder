const express = require('express');
const User = require('../models/user');

const { userAuth } = require('../middlewares/authMiddlewares');
const requestRouter = express.Router();
const mongoose = require('mongoose');
const ConnectionRequestModel = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId', userAuth ,async (req, res) => {
    try {
        const user = req.user
        const status = req.params?.status;
        const fromUserId = user?._id;
        const toUserId = req.params?.toUserId;


        // validate the status
        const allowedStatus = ["interested", "ignored"]
        const isAllowedStatus = allowedStatus.includes(status)
        if (!isAllowedStatus) {
            return res.status(400).json({ message: "wrong status" })
        } 


        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({ message: " Invalid userId format" })
        }


        // check the toUserId  is existing user or not
        const existingUser = await User.findById(toUserId)
        if (!existingUser) {
            return res.status(400).json({ message: "Error: wrong userId" })
        }

        // check the intersted guys is already 
        const existingConnectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
                
            ]
        })
        console.log(existingConnectionRequest);
        if (existingConnectionRequest.length>0) {
            return res.status(400).json({ message: "Error: Existing connection user" })
        }

        const newConnectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })

        await newConnectionRequest.save()

        res.status(200).json({message:`${user.firstName} is ${status} the ${existingUser.firstName}`})
        
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    
    try {
        const allowedStatus = ['accepted', 'rejected'];
        const { status, requestId } = req.params;
        const loggedInUser = req.user

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed" })
        }

        const isValidObjectId = mongoose.Types.ObjectId.isValid(requestId);
        if (!isValidObjectId) {
            return res.status(400).json({ message: "requestId is invalid" })
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status:'interested'
        })
        if (!connectionRequest) {
            return res.status(404).json({ message:"connection request not found "})
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({data:data,message:`successfully connection request ${status}`})
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
    }


})

module.exports = requestRouter;