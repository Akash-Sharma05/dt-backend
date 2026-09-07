const express = require('express')
const app = express();
const dbConnect = require("./config/database")
const User = require("./models/user")

app.post("/signup", async (req, res) => {
    //create a new instance of the user model
    const user = new User({
        firstName: "rohit",
        lastName: "sharma",
        emailId: "rohit@gmail.com",
        password: "rohit@123"
    })
    try {
        await user.save();
        res.send("User created successfully..")
    }catch(err){
        res.status(400).send("Error saving the user : " + err.message)
    }

})

dbConnect().then(() => {
    console.log("Databse connection established...")
    app.listen("4444", () => {
        console.log("Server is successfully listening on PORT 4444...")
    })

}).catch(err => {
    console.log("Database cannot be connected!!")
})

