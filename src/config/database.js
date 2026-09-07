const mongoose = require('mongoose')

const dbConnect = async () => {
    await mongoose.connect("mongodb+srv://akladwa64_db_user:nBzuQ33MlrtSR6OX@cluster0.unjizyn.mongodb.net/dev-Tinder?appName=Cluster0/dev-Tinder")
}
module.exports=dbConnect

