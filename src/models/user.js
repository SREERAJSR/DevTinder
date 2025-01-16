const { lowerCase } = require('lodash');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50

    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
        minLegnth :1
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator(v) {
                var re =/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
                return re.test(v)
            },
            message:'provided email is not valid'
        },
        lowerCase: true,
        trim:true
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max:50
    },
    gender: {
        type: String,
        enum:['male','female','others']
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength:8
        
    },
    skills: {
        type: [String],
        default:["nodejs"]
    },
    photoUrl: {
        type: String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQABqQIdskCD9BK0I81EbVfV9tTz320XvJ35A&s'
    }
}, {
    timestamps:true
})

module.exports = model('user',userSchema)