const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter= express.Router()

requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    try{
        const user= req.user;
        if(!user){
            throw new Error("User not login!!!")
        }
        res.send(user.firstName + " sent the connection request") 

    }catch(err){
        return res.status(400).send("ERROR : " + err.message);
    }
})

module.exports= requestRouter;