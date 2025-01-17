const express = require('express');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest')
const { userAuth } = require('../middlewares/authMiddlewares');
const requestRouter = express.Router();
const mongoose = require('mongoose');

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
        const existingConnectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
                
            ]
        })
        console.log(existingConnectionRequest);
        if (existingConnectionRequest.length>0) {
            return res.status(400).json({ message: "Error: Existing connection user" })
        }

        const newConnectionRequest = new ConnectionRequest({
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

module.exports = requestRouter;