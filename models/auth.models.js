import mongoose from "mongoose";

const Authschema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    emailId:{
        type:String,
        required:true
    }
},{timestamps:true})

const AuthModel = mongoose.model("AuthModel",Authschema)

export default AuthModel

