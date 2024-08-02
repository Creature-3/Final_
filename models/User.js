const mongoose = require("mongoose");
const bcrypt = require ("bcrypt");
const validator = require('validator');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        require: [true, 'first name is required'],
        validate:{
            validator: (v) => /^[a-zA-Z]+$/.test(v),
            message: props => `${props.value} is not valid first name. only English`  
        }
    },
    lastname: {
        type: String,
        require: [true, 'last name is required'],
        validate: {
            validator: (v) => /^[a-zA-Z]+$/.test(v),
            message: props => `${props.value} is not a validelast name enter only english letter`
        }

    },
    username: {
        type: String,
        require: [true, ' username is required'],
        unique: true,
        validate: {
            validator: (v) => /^[a-zA-Z0-9]+$/.test(v),
            message: props => `${props.value} is not a validelast name enter only english letter`
        }
    },
    email:{
        type : String,
        require: [true, ' email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'enter valid Email']
    },
    password: {
        type: String,
        require: true,
        validate: {
            validator: (v) => /^[a-zA-Z0-9!@#$%^&*]+$/.test(v),
            message: props => `${props.value}  `
        }
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'    

    },
    grade: {
        type: Number,
        require: true,
        validate: {
            validator: (v) => /^[0-100]+$/.test(v),
            message: props => `${props.value} is not a valide grade enter between 0-100`
        }
    },
    courses: {
        type: String,
        require: true
    },
     resetPasswordToken: String,
     resetpasseordExpires: Date

});

userSchema.pre("save", async function(next) {
    if (this.isModified("password") || this.isNew){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User',userSchema);