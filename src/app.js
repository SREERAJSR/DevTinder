const express = require('express');
const morgan = require('morgan')
const app = express();
const connectDB = require('./configs/database')
const cookieParser = require('cookie-parser');
const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/request')
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/',requestRouter)

connectDB().then(() => {
    console.log('db connection established');
    app.listen(7777, () => {
        console.log('server is running on port 7777');
    })
}).catch((err) => {
    console.log(err, 'database connection error');
})

