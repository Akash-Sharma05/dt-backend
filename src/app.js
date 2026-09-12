const express = require('express')
const app = express();
const dbConnect = require("./config/database")
const User = require("./models/user");
const validator = require('validator');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cookieParser());

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("Invalid Credinetals!!!")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            //sever will create a JWT token 
            const token = await jwt.sign({ _id: user._id }, "DEV@TINDER@4270")

            //Add the token in a cookie and send the response
            res.cookie('token', token)
            res.status(400).send("Login successfull...")

        } else {
            throw new Error("Invalid and Credientals!!!")
        }


    } catch (err) {
        return res.status(500).send("ERROR : " + err.message)
    }
})

app.get('/profile', async (req, res) => {
    try {
        const cookies = req.cookies
        const { token } = cookies;

        if (!token) {
            throw new Error("Invalid Token!!!")
        }

        //validate my token
        const decodeMessage = await jwt.verify(token, 'DEV@TINDER@4270');
        const {_id}= decodeMessage;

        const user  = await User.findById(_id);

        if(!user){
            throw new Error("User does not exists!!!")
            
        }
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send("ERROR : "+ err.message);

    }


})

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        //validation of data 
        validateSignUpData(req)

        //step 1 - encytion of pass then store the user into the database
        const passwordHash = await bcrypt.hash(password, 10);

        //Here I'm creating the new instance of the user model
        const user = await new User({
            firstName, lastName, emailId, password: passwordHash
        })


        await user.save()
        return res.status(200).send({ message: "User created successfully", user });
    } catch (err) {
        return res.status(500).send("ERROR : " + err.message)
    }
})

//get user by email 
app.get("/user", async (req, res) => {
    try {
        const ID = req.body._id;

        const user = await User.findById(ID)
        if (!user) {
            return res.status(400).send({
                message: "User is not available"
            })
        }
        return res.status(200).send({
            message: "User fetched successfully",
            user
        })

    } catch (err) {
        return res.status(500).send("ERROR : " + err)
    }
})

//get all the users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find()
        if (users.length == 0) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        return res.status(200).send({
            message: "User fetched successfully",
            users
        })

    } catch (err) {
        return res.status(500).send("ERROR : " + err)
    }
})

//to delete the user
app.delete("/delete", async (req, res) => {
    const id = req.body._id
    try {
        const user = await User.findByIdAndDelete(id);

        return res.status(400).send("User Deleted successfully...")


    } catch (err) {
        return res.status(500).send("ERROR : " + err)
    }
})

//find by id and update 
app.patch("/user/:userId", async (req, res) => {
    const ID = req.params?.userId
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["password", "photoUrl", "about", "gender", "age", "skills"]

        const isUpadteAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
        if (!isUpadteAllowed) {
            throw new Error("Update not allowed ")
        }
        if (data.skills.length > 10) {
            throw new Error("Skills cannot be more than 10 ")
        }

        await User.findByIdAndUpdate(ID, data, { runValidators: true })
        return res.status(400).send("User updated successfully")

    } catch (err) {
        return res.status(500).send("ERROR : " + err)
    }
})


dbConnect().then(() => {
    console.log("Databse connection established...")
    app.listen("4444", () => {
        console.log("Server is successfully listening on PORT 4444...")
    })

}).catch(err => {
     .log("Database cannot be connected!!")
})

