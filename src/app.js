const express = require('express')
const app = express();
const dbConnect = require("./config/database")
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser());

const authRouter= require("./routes/auth")
const profileRouter= require("./routes/profile")
const requestRouter= require("./routes/request")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

dbConnect().then(() => {
    console.log("Databse connection established...")
    app.listen("4444", () => {
        console.log("Server is successfully listening on PORT 4444...")
    })

}).catch(err => {
     console.log("Database cannot be connected!!")
})

