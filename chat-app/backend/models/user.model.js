import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {AvailableUserRoles,UserRolesEnum} from "../constants/index.js"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
          },
        
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
  
        avatar: {
            type: {
              url: String,
              localPath: String,
            },
            default: {
              url: `https://via.placeholder.com/200x200.png`,
              localPath: "",
            },
          },

        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.USER,
            required: true,
          },

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
          process.env.ACCESS_TOKEN_SECRET
    )
}

export const User = mongoose.model("User", userSchema)