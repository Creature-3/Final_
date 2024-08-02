const bcrypt = require ("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const { error } = require("console");

process.env.EMAIL_SERVICE = 'Gmail';
process.env.EMAIL_USER = 'rahafy333@gmail.com';
process.env.EMAIL_PASS = 'sfqm ivhi kmsm mogc';
process.env.RESET_PASSWORD_URL = 'http://localhost:3000/reset-password';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth:{
        user: process.env.EMAIL_USER ,
        pass: process.env.EMAIL_PASS
    }
});


const register = async (req,res) => {
    try{
        const {firstname,lastname,email,grade,courses,username, password,role} = req.body;
        const user = new User({firstname,lastname,email,grade,courses,username, password,role});
        await user.save();
        res.status(201).json({massage: "user register done"});
    }catch (e){
        res.status(500).json({error: e.massage});
    }
};

const login = async (req,res) => {
    try {
        const { username, password} = req.body;
        const user = await User.findOne({username});
        if (!user){
            return res.status(400).json({massage: "invalid username or password"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            return res.status(400).json({massage: "invalid username or password"});
        }
        const token = jwt.sign({id: user._id}, 'secret', {expiresIn: '1h'});
        res.status(200).json({token});
    }catch (e) {
        res.status(500).json({error: e.massage});
    }
};

const forgetpasseord = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(404).json({massage: "the user email not exist"});
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetpasseordExpires = Date.now() + 360000;
        await user.save();

        const resetUrl = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

        const mailOption = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'password reset',
            text: `you are reciving this email brc you has requested to reset you pass for your account. \n
            plz click here:\n
            ${resetUrl} \n\n
            if you did not request this, just ignore the mwssage. `
        };

        transporter.sendMail(mailOption , (error) => {
            if(error) {
                return res.status(500).json({message: 'error sending the email', error});

            }
            res.status(200).json({message:'email sent'});
        });
    }catch (e) {
        res.status(500).json({error: e.message});
    }    
} ;


const resetPassword = async (req,res) => {
    try {
        const {resetToken} = req.params;
        const hashedtoken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedtoken,
            resetpasseordExpires: {$gt: Date.now()}
        });

        if(!user){
            res.status(400).json({message: 'Token is invalid or expired'});
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetpasseordExpires = undefined;

        await user.save();

        res.status(200).json({message: ' password has been reset'});

    }catch (e) {
        res.status(500).json({error: e.message});
    }
};


module.exports = {
    register,
    login,
    forgetpasseord,
    resetPassword,
}