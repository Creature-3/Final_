const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    location: {
        type: String,
        require: true,
    },
    courses: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model("University", universitySchema);
