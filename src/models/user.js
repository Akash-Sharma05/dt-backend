const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 40,
    },

    lastName: {
        type: String
    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid!!! ' + value)
            }
        }
    },

    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password!!!" + value)
            }
        }
    },

    age: {
        type: Number,
        min: 18,
    },

    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },

    photoUrl: {
        type: String,
        default: "https://w7.pngwing.com/pngs/910/606/png-transparent-head-the-dummy-avatar-man-tie-jacket-user-thumbnail.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid Photo URL!!!' + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is default user photo"
    },
    skills: {
        type: [String]
    },
   
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User