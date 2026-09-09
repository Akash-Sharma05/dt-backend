const express = require('express')
const app = express();
const dbConnect = require("./config/database")
const User = require("./models/user");

app.use(express.json())

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, gender } = req.body;
        const user = await User.create({
            firstName, lastName, emailId, password, gender
        })
        await user.save()
        return res.status(200).send({ message: "User created successfully", user });
    } catch (err) {
        return res.status(500).send("ERROR : " + err)
    }
    // console.log(req.body)

})

//get user by email 
app.get("/user", async (req, res) => {
    try {
        const ID = req.body._id;
        console.log(ID)

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
        if(data.skills.length>10){
             throw new Error("Skills cannot be more than 10 ")
        }

        await User.findByIdAndUpdate(ID, data)
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
    console.log("Database cannot be connected!!")
})

