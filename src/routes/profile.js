const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');
const profileRouter = express.Router();
const bcrypt= require('bcrypt')
const validator = require('validator')

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).send(user);
    } catch (err) {
        return res.status(400).send("ERROR + " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {

        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request!!!")
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key])
        await loggedInUser.save();
        res.status(200).json({
            message: `${loggedInUser.firstName}, your profile updated successfully`, loggedInUser
        })

    } catch (err) {
        return res.status(400).send("ERROR : " + err.message);
    }
})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        const {newPassword}= req.body;
        if(!validator.isStrongPassword(newPassword)){
           throw new Error("Please Enter strong Password!!!")
        }

        const user= req.user;
        const ID = user._id;
        const hashPass=  user.password;

        const checkPrevious = await bcrypt.compare(newPassword,hashPass);
        console.log(checkPrevious)

        if(checkPrevious==true){
            return res.status(400).send("Please Enter a new Password...")
        }
        
        const updatedHashPass= await bcrypt.hash(newPassword,10)
        const updatePass = await User.findByIdAndUpdate(ID,{
            password:updatedHashPass
        })
        res.status(200).send("Password Updated successfully...")

    }catch(err){
        res.status(400).send("ERROR : " + err)
    }
})
module.exports = profileRouter;