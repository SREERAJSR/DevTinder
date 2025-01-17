const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignupApi } = require('../utils/validation');
const authRouter = express.Router();

// signup Api
authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupApi(req)
        const { firstName, lastName, gender, age, photoUrl, password, email, skills } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)


        const user = new User({
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: hashedPassword,
            skills: skills,
            gender: gender
        })

        await user.save()
        res.status(200).send("User data saved successfully")
    } catch (error) {
        res.status(500).send("Error in saving user datas, the error" + error)
    }
})


// login api
authRouter.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentails")
        }
        const isPasswordCorrect = await user.validatePassword(password)

        if (!isPasswordCorrect) {
            throw new Error('Invaid credentials')
        }
        const token = await user.getJwtToken()
        res.cookie('token', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.send("user logged succesfully")
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
    }

})


// logout api

authRouter.post('/logout', (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()) })
    res.send("Logut successfully")
})
module.exports = authRouter;