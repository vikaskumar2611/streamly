//promise way to do the same

const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err));
    }
}



//this is a higher order function that accepts a function and returns a wrapper function with error handling

//this is try catch approach
// const asyncHandler = (fn) => async (req, res, next)=> {
//     try{
//         await fn(req,res,next);
//     } catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message: error.message
//         })
//     }

// }

export {asyncHandler}