const express = require("express");
const mongoose = require( "mongoose" );

// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/note-vote");

// importing the authcontroller and postcontroller

const authcontroller = require("./controller/authController")
const postcontroller = require("./controller/postController")


const session = require("express-session")
const passport = require("passport")
require("dotenv").config();


// importing the user 
const User = require("./model/UserModel");

passport.use(User.createStrategy()); //This tells Passport to use the local authentication strategy provided by passport-local-mongoose.

passport.serializeUser(User.serializeUser()); //This defines how Passport will store user information in the session.

passport.deserializeUser(User.deserializeUser()); //This defines how Passport will retrieve the full user information from the unique identifier stored in the session.



// Create the Express app
const app = express();

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());

// Set EJS as the templating engine
app.set("view engine", "ejs");



// Serve static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));

// Home route (Login page)
app.get("/", (req, res) => res.render("index"));

// POST this route is for to handle login and load posts
app.post("/login", authcontroller.auth_login);

//GET this route is for the home page of the note vote app
app.get("/note-vote", postcontroller.post_note_vote)

// POST /register this route is to Handle user registration
app.post("/register", authcontroller.auth_register )

// POST /addpost - this route to Handle adding a post and render updated note-vote page
app.post("/addpost", postcontroller.post_addpost)

// GET /logout - this route is to Handle user logout
app.get('/logout', authcontroller.auth_logout)


// POST /upvote - Handle upvoting a post and render updated note-vote page
app.post("/upvote", postcontroller.post_upvote)


// POST /downvote - Handle downvoting a post and render updated note-vote page
app.post("/downvote",  postcontroller.post_downvote)


            
   
   

