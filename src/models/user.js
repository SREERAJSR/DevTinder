const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    
    firstName: {
        type:String
    },
    lastName: {
        type:String
    },
    email: {
        type:String
    },
    age: {
        type:Number
    },
    gender: {
        type:String
    },
    password: {
        type:String
    }
})

module.exports = model('user',userSchema)