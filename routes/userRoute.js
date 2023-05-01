const express = require('express');
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateToken = require("../middleWares/accesstokenValidation");

// Register User

router.post("/register",expressAsyncHandler(async(req,res)=>{
    const {username,email,password} = req.body
    
    if(!username || !email || !password){
        res.status(400)
        throw new Error("Please enter all details")        
    }

    const existingUser =await User.findOne({email})
    if(existingUser){
        res.status(400)
        throw new Error("User already exists") 
    }
    const hashedPassword = await bcrypt.hash(password,10)
    console.log(hashedPassword);
    
    const user =await User.create({
        username : username,
        email : email,
        password : hashedPassword,
    })

    console.log(user);
    
    if(user){
        res.status(200).json({_id:user.id,email:user.email})
    }
    else{
        res.status(400)
        throw new Error("Details are invalid")
    }
}))

// Login User

router.post("/login",expressAsyncHandler(async(req,res)=>{
    
    const {email,password} = req.body
    
    if(!email || !password){
        res.status(400);
        throw new Error("Enter the required details")
    }
    
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user: {
                username : user.username,
                email : user.email,
                id : user.id,
            },
        },process.env.ACCESS_SECRET,{expiresIn:"15m"})
        res.status(200).json({accessToken})
    }else{
        res.status(401)
        throw new Error("email or password is not valid")
    }
    
}))


// current User

router.get("/current",validateToken,expressAsyncHandler(async(req,res)=>{
    res.status(200).json(req.user)
}))


module.exports = router