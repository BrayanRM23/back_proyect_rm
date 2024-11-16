// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserInfo', // Referencia al modelo UserInfo
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;



