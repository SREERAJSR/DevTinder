const express = require('express');
const {adminAuth, userAuth} = require('./middlewares/authMiddlewares')

const app = express();

app.use('/admin',adminAuth)

app.get('/admin', (req, res) => {
    res.send('admin dashboard')
})

app.use('/user/home',userAuth,   (req, res) => {
    res.send('User home page')
})

app.use('/user/login', (req, res) => {
    res.send('login page')
})

app.get('/admin/getData', (req, res) => {
    res.send("fetching all data from admin ")
})

app.listen(7777, () => {
    console.log('server is running on port 7777');
})