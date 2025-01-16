const express = require('express');
const User = require('../models/user');
const { userAuth } = require('../middlewares/authMiddlewares');
const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', userAuth,async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId)
        
        res.send(`${user.firstName} sented connection request`)
        
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
    }
})

module.exports = requestRouter;