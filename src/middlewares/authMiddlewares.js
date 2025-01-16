const jwt = require('jsonwebtoken');
const User = require('../models/user')


const userAuth =async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is invalid")
        }
        const decoded = await jwt.verify(token, 'sfsjfskdfkfdhfdkjfhj')
        const user = await User.findById(decoded.id)
        if (!user) {
            throw new Error('Token is expired')
        }
        req.user = user
        next()
        
    } catch (error) {
        res.status(500).send('ERROR:'+error.message)
    }
  
}



module.exports = {
    userAuth
}