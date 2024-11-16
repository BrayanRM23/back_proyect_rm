// models/UserInfo.js
const mongoose = require('mongoose');

const UserInfoSchema = new mongoose.Schema({
    birthdate: {
        type: Date,
        required: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cellphone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

const UserInfo = mongoose.model('UserInfo', UserInfoSchema);

module.exports = UserInfo;
