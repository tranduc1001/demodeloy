// import
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        require: true,
    },
    created: {
        type: String,
        require: true,
        default: Date.now,
    },
});
module.exports = mongoose.model('User', userSchema);