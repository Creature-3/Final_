const User = require('../models/User');


// get all user

const getallUsers = async (req,res,next) =>{
    const users = await User.find();
    res.status(200).json({users});
};

//get user by id

const getUserbyId = async (req,res,next) =>{
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user){
        const error = new error("User idnot found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({user});
};

// create new user

const createUser = async (req,res,next) => {
    const data = req.body;
    const user = new User(data);
    await User.create(user);
    res.status(201).json({user});
}

//update user
const updateUser = async (req,res,next) => {
    const id = req.params.id;
    const data = req.body;
    const user = await User.findByIdAndUpdate(id,data, {new:true});
    if(!user){
        const error = new error("User idnot found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({user});
};

// delet user

const deletUser = async (req,res,next) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if(!user){
        const error = new error("User idnot found");
        error.statusCode = 404;
        throw error;
    }
    res.status(204).json({massage: 'user id delet'});
};

module.exports = {
    getallUsers,
    getUserbyId,
    createUser,
    updateUser,
    deletUser
}
   