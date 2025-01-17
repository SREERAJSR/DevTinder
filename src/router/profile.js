const express = require('express');
const {userAuth,} = require('../middlewares/authMiddlewares')
const profileRouter = express.Router()
const   {validateProfileEditRequestBody, sanitizeProfileEditRequestBody} = require('../utils/validation');






profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
    }

})

profileRouter.patch('/profile/edit',userAuth, async (req, res) => {
    
    try {
        
        if (!validateProfileEditRequestBody(req)) {
            throw new Error("Can't edit with this credentials")
        }
        await sanitizeProfileEditRequestBody(req)
        const loggedUser = req.user;

        Object.keys(req.body).forEach((field) => loggedUser[field] = req.body[field])
        await loggedUser.save()

        res.json({ "message": "Profile update successfully ", data: loggedUser })
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
    }
    
})


module.exports = profileRouter;