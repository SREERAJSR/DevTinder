const express = require('express');

const app = express();

app.use('/user', (req, res) => {
    res.send("HAHAHAHAHAHH")
})
app.get('/user', (req, res) => {
    res.send({firstname:"sreeraj",lastname:"S R"})
})

app.post('/user', (req, res) => {
    res.send("saved user details")
})
app.delete("/user", (req, res) => {
    res.send("deleting user data from db")
})
app.use('/', (req, res) => {
    res.send("hello from root")
})
app.listen(7777, () => {
    console.log('server is running on port 7777');
})