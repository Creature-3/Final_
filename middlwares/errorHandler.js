const errorHandler = (err , req,res,next) => {
    console,error(err.stack);
    const statusCode = err.statusCode || 500;
    const massage = err.massage || 'Internal Server Error';
    res.status(statusCode).json({massage});
};

module.exports = errorHandler;
