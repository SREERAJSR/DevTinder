const express = require('express');
const {adminAuth, userAuth} = require('./middlewares/authMiddlewares')
const morgan = require('morgan')
const app = express();
const connectDB = require('./configs/database')
const User = require('./models/user')
const { validateSignupApi } = require('./utils/validation')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// signup Api
app.post("/signup", async (req, res) => {
    try {
        validateSignupApi(req)
        const {firstName, lastName, gender, age, photoUrl, password, email, skills} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: hashedPassword,
            skills: skills,
            gender:gender
    })
 
        await user.save()
        res.status(200).send("User data saved successfully")
    } catch (error) {
        res.status(500).send("Error in saving user datas, the error"+error)
    }
})


// login api
app.post('/login', async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentails")
        }
        const hashedPassword = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordCorrect) {
            throw new Error('Invaid credentials')
        }
        const token = jwt.sign({id:user._id}, 'sfsjfskdfkfdhfdkjfhj')
        res.cookie('token',token)
        res.send("user logged succesfully")
    } catch (error) {
        res.status(500).send('ERROR:'+error.message)
    }
  
})

app.get('/profile', async (req, res) => {
    try {
        const tokens = req.cookies;
        const { token } = tokens;
        if (!token) {
            throw new Error("No token")
        }
        const decodedJwt =  jwt.verify(token,'sfsjfskdfkfdhfdkjfhj')
        const user = await User.findById(decodedJwt.id.toString());

        if (!user) {
            throw new Error("User doesn't exist");
        }

        res.send(user)
    } catch (error) {
        res.status(500).send('ERROR:' + error.message)
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

app.patch("/user/:id", async (req, res) => {
    const userId = req.params?.id
    try {
        const data = req.body
        console.log(data);
        const allowedUpdate = ['skills', 'age', 'gender', 'photoUrl']
        const isAllowedUpdate = Object.keys(data).every((key) => allowedUpdate.includes(key))
        if (!isAllowedUpdate) {
            throw new Error("Can't update with the given datas")
        }
        if (data.skills.length > 10) {
            throw new Error("skills can't be more than 10")
        }
        if (!data.photoUrl) {
                throw new Error("photo url can't be empty ")
        }
  
        const user = await User.findByIdAndUpdate(userId, req.body, { returnDocument: "after" ,runValidators:true})
        console.log(user)

        res.send("user data updated succesfully")
    } catch (error) {
        console.log(error);
        res.status(500).send("Error with updating data"+error.message)
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

