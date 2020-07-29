const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    _eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    token: {
        type: String,
        required: true
    },
    invitedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    invitedUserEmail: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }

});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;