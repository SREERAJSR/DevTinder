
const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted','rejected'],
            message: '{VALUE} is not valid status'
        }
    }
},{timeStamps:true})


connectionRequestSchema.index({fromUserId:1,toUserId:1})

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    const fromUserId = connectionRequest.fromUserId;
    const toUserId = connectionRequest.toUserId;
    if (fromUserId.equals(toUserId)) {
        throw new Error("cannot send connection request to yourself")   
    }
    next()
})
const ConnectionRequestModel = mongoose.model('connectionRequest',connectionRequestSchema)

module.exports = ConnectionRequestModel
