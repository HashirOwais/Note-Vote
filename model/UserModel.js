const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Add Passport-Local Mongoose plugin
userSchema.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", userSchema);

 