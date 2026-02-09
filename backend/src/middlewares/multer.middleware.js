import multer from "multer";

//this is a middleware it catches the file from the user via frontend form and saves the file to public/temp after that cloudinary.js uploads it to cloud

//You are using multer.diskStorage. This tells Multer: "I want to keep full control over where the file goes and what it is named."

//It takes two functions: destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //save the file destination
    cb(null, "./public/temp")
  },
  //tell multer to about naming the file
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})

// this is a function and will may be called by the controller
export const upload = multer({ 
    storage,
})


/*

flow diagram

[Frontend Request] (Contains 'avatar.jpg')
       ⬇️
[Route Handler] ( router.route("/register").post( ... ) )
       ⬇️
[Middleware: Multer] 🛑 STOP!
   1. Read 'avatar.jpg'
   2. Save it to './public/temp/avatar.jpg'
   3. Add path info to req.file
   4. Continue ➡️
       ⬇️
[Controller: registerUser]
   1. Read req.file.path
   2. Call uploadOnCloudinary('./public/temp/avatar.jpg')
   3. ...Cloudinary takes over...

*/