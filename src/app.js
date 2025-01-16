const express = require('express');
const {adminAuth, userAuth} = require('./middlewares/authMiddlewares')
const morgan = require('morgan')
const app = express();
const connectDB = require('./configs/database')
const User = require('./models/user')

app.use(express.json())

app.use(morgan('dev'))


app.post("/signup", async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        res.status(200).send("User data saved successfully")
    } catch (error) {
        res.status(500).send("Error in saving user datas, the error"+error)
    }
})

app.get('/user', async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404).send("user not found    ")
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send("something went wrong")
    }
    
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.findById(req.body.id)
        
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send("something went wrong")
    }

})
 
app.delete('/user', async(req, res) => {
    const userId = req.body.id;

    try {
        await User.findByIdAndDelete(userId)
        res.send("user data deleted succesfully")
    } catch (error) {
        res.status(500).send("something went wrong")
    }

})

app.patch("/user", async (req, res) => {
    const userId = req.body.id
    try {
        const user = await User.findByIdAndUpdate(userId, req.body, { returnDocument: "after" ,runValidators:true})
        console.log(user)

        res.send("user data updated succesfully")
    } catch (error) {
        console.log(error);
        res.status(500).send("something went wrong")
    }

}) 



connectDB().then(() => {
    console.log('db connection established');
    app.listen(7777, () => {
        console.log('server is running on port 7777');
    })
}).catch((err) => {
    console.log(err, 'database connection error');
})

