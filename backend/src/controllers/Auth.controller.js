const User = require("../models/User.model");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const register = async (req,res)=>{
    console.log("haha");
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10); // iska matlab hua ki password ko hash karna hai 10 rounds ke liye

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
        })
        res.status(201).json({message:"User created successfully", user: newUser});
    }catch(error){
        res.status(500).json({message:"Internal server error", error:error.message});
    }
}

const Login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email}); // ye check kar raha hai ki user exist karta hai ya nahi
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password); // ye check kar raha hai ki password valid hai ya nahi
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        console.log(process.env.JWT_SECRET);
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET); // ye token generate kar raha hai
        res.status(200).json({token,user:{  // ye user ka data bhej raha hai aur token ke sath
            id:user._id,
            name:user.name,
            email:user.email
        }})
        console.log(process.env.JWT_SECRET);
    }catch(error){
        res.status(500).json({message:"Internal server error", error:error.message});
    }
}

module.exports = { register, Login };




