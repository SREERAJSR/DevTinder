const express = require('express');
const {adminAuth, userAuth} = require('./middlewares/authMiddlewares')
const morgan = require('morgan')
const app = express();
const connectDB = require('./configs/database')
const User = require('./models/user')

app.use(morgan('dev'))


app.post("/signup", async (req, res) => {
    
    const user = new User({
        firstName: 'Nimisha',
        lastName: "Ps",
        age: 23,
        email: 'psnimisha@gmail.ocm',
         gender:'female'
    })
    try {
        await user.save()
        res.status(200).send("User data saved successfully")
    } catch (error) {
        res.status(500).send("Error in saving user datas, the error"+error)
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

