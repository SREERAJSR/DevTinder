const express = require('express');

const app = express();


app.get('/user',[ (req, res,next) => {
    console.log('first request handler')
    // res.send('first response')
    next()
    
}], [(req, res,next) => {
    console.log('second request handler')
    // res.send('second response')
    next()
}, (req, res,next) => {
    console.log('third request handler')
    res.send('third response')

}])
 

// app.get('/user/:userId/:name/:password', (req, res) => {

//     res.send({firstname:"sreeraj",lastname:"S R",userId:req.params.userId,name:req.params.name,password:req.params.password})
// })

// query params
// app.get('/user', (req, res) => {
//     res.send({firstname:"sreeraj",lastname:"S R",password:req.query.pass,userId:req.query.userId})
// })
// app.post('/user', (req, res) => {
//     res.send("saved user details")
// })
// app.delete("/user", (req, res) => {
//     res.send("deleting user data from db")
// })
app.use('/user', (req, res) => {
    res.send("hello from root")
})
app.listen(7777, () => {
    console.log('server is running on port 7777');
})