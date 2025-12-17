import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bycrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName:{
        type:String,
        required:true,
        trim: true,
        index: true
    },
    avatar:{
        type: String, //cloudnary url
        required:true,
    },
    coverImage:{
        type: String,//cloudnary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true,'Password is required']
    },
    refreshToken:{
        type: String
    }
},{timestamps:true})

//this things runs everytime just before saving
//if any field is modified it checks if password too was modified or not only then hashes and saves it
userSchema.pre("save", async function(next){
    //check if there is any change in password if not return
    if(!this.isModified("password")) return next();

    //hash the pass
    this.password = await bycrypt.hash(this.password, 10);
    //pass the flag
    next();
})

//authenticate password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bycrypt.compare(password,this.password)
}

//generate access token
userSchema.methods.generateAcessToken = function(){
    jwt.sign(
        {
            _id:this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//in this we only use id as they are frequently made
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);