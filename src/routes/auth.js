const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        validateSignUpData(req);

        const passHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passHash
        })
        await user.save();
        return res.status(200).send({
            message: "User created successfully"
        });
    } catch (err) {
        return res.status(400).send("ERROR : " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Credientals!!!");
        }
        const isPasswordValid = bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            const token = jwt.sign({ _id: user._id }, 'DEV@TINDER@4270');
            res.cookie('token', token);
            res.status(200).send("Login Successfull...");
        } else {
            throw new Error("Invalid Credientals!!!")
        }
    } catch (err) {
        return res.status(400).send("ERROR : " + err.message);
    }
})

authRouter.post("/logout",async(req,res)=>{
    try{
        res.cookie('token',null,{
            expires:new Date(Date.now())
        })
        res.status(200).send("User Logout successfuly...")

    }catch(err){ 
        res.status(400).send("ERROR : " + err.message)
    }
})

module.exports = authRouter;