const express = require('express');
const bcrypt = require('bcrypt');
const { userAuth, } = require('../middlewares/authMiddlewares')
const profileRouter = express.Router()
const { validateProfileEditRequestBody,
    sanitizeProfileEditRequestBody, checkOldPasswordAndNewPassword
    , checkOldPasswordIsRight, validateNewPassword } = require('../utils/validation');


profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
    }

})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

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

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        if (!checkOldPasswordAndNewPassword(req)) {
            throw new Error("invalid credentials")
        }
        const { oldPassword, newPassword } = req.body
        const user = req.user
        if (! await checkOldPasswordIsRight(oldPassword, user.password)) {
            throw new Error("Entered old password is wrong")
        }
        validateNewPassword(newPassword)
        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "new password updated succesfully" })
    } catch (error) {
        console.log(error);
        res.status(500).send('ERROR:' + error.message)
    }
})

module.exports = profileRouter;