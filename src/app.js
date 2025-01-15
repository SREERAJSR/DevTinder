const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.json("hello world")
})
app.use('/test', (req, res) => {
    res.json("hello this test")
})
app.use('/hello', (req, res) => {
    res.json('hello hello hello hel')
})

app.listen(7777, () => {
    console.log('server is running on port 7777');
})