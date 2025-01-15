const express = require('express');
const {adminAuth, userAuth} = require('./middlewares/authMiddlewares')
const morgan = require('morgan')
const app = express();

app.use(morgan('dev'))

app.use('/admin', (req, res) => {
    try {
        if (1 === 1) {
            throw new Error('1 is equal')
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

app.use("/user", (req, res) => {

    if (1 === 1) throw new Error('not token')
    else res.send('hai from home')
})
app.use('/', (err, req, res, next) => {
    if (err) {
        res.status(500).send("something went wrong")
    }
})
// app.use('/admin',adminAuth)

// app.get('/admin', (req, res) => {
//     res.send('admin dashboard')
// })

// app.use('/user/home',userAuth,   (req, res) => {
//     res.send('User home page')
// })

// app.all('/user', (req, res) => {
//     res.send('login page')
// })

// app.get('/admin/getData', (req, res) => {
//     res.send("fetching all data from admin ")
// })

// app.use('/', (err, req, res, next) => {
//     if (err) {
//         res.status(500).send("something went wrong")
//     }
// })

app.listen(7777, () => {
    console.log('server is running on port 7777');
}) 