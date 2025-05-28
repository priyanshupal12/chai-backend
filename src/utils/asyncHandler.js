const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => next(err))
    }
}
 


export { asyncHandler }




// try catch method
//const asyncHandler = (fn) => {async() => {}} !importent to understand following code
/*const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            error: error
        });
    }
}    */          