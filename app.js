const express = require("express");



const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();



const mongoose = require( "mongoose" );
// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/note-vote");


// create a mongoose schema for a User
const userSchema = new mongoose.Schema ({
    username:   String,
    password: String
});

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model ( "User", userSchema );


// create a mongoose schema for a post

const postSchema = new mongoose.Schema ({
    _id: Number,
    text: String,
    creator: String,
    upvotes: Array,
    downvotes: Array

});

const Post = mongoose.model ( "post", postSchema );


//Add our strategy for using Passport, using the local user from MongoDB
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////////////////////////////////////////



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

// Common localhost test port
const port = 3000;

// Serve static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Start the server
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));

// Home route (Login page)
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

// POST this route is for to handle login and load posts
app.post("/note-vote", (req, res) => {
    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, async() => {
                try {
                    const posts = await Post.find()
                    return res.render("note-vote", { user: { username: req.body.username }, posts: posts });

                    
                } catch (error) {
                    console.log(error)
                    
                }
            });
        }
    });
   
   
});

// POST /register this route is to Handle user registration
app.post("/register",  (req, res) => {

    if (req.body["invite-code"] === process.env.INVITE_CODE) {
        User.register({ username : req.body.username }, 
            req.body.password, 
            ( err, user ) => {
if ( err ) {
console.log( err );
    res.redirect( "/" );
} else {
    passport.authenticate( "local" )( req, res,async () => {
         // Get all 
         try {
            const posts = await Post.find();

            console.log(posts);
            console.log("User made");
            // Render the note-vote page with user and posts data
            return res.render("note-vote", { user: { username: req.user.username}, posts: posts });

        } catch (error) {
            console.log("Error fetching posts:", error);
            return;
        }
        
    });
}
});
       
    } else {
        // Invalid invite code
        return res.send("Invalid invite code");
    }
});

// POST /addpost - this route to Handle adding a post and render updated note-vote page
app.post("/addpost", async(req, res) => {
    try {
        const posts = await Post.find();
        let length = posts.length + 1;

        const newPost = new Post(
        {
            _id: length,
            text: req.body["note"],
            creator: req.user.username,
            upvotes: [],
            downvotes: []

        })

        await newPost.save();

        try {
            const posts = await Post.find();
            return res.render("note-vote", { user: { username: req.body["user_username"] }, posts: posts });

            
        } catch (error) {
            
        }


    
        
    } catch (error) {
        return res.send("no work????")
        
    }


  
   
});

// GET /logout - this route is to Handle user logout
app.get("/logout", (req, res) => {
    res.redirect("/");
});



// POST /upvote - Handle upvoting a post and render updated note-vote page
app.post("/upvote", async (req, res) => {
    try {
        const currentUser = req.user.username;
        const postId = parseInt(req.body["post_id"]);

        // Find the post to be upvoted
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Initialize upvotes and downvotes
        let upvotes = post.upvotes;
        let downvotes = post.downvotes;

        // Update upvotes and downvotes
        if (!upvotes.includes(currentUser)) {
            upvotes.push(currentUser);
            downvotes = downvotes.filter(user => user !== currentUser);
        } else {
            upvotes = upvotes.filter(user => user !== currentUser);
        }

        // Save the updated post
        await Post.updateOne(
            { _id: postId },
            { $set: { upvotes: upvotes, downvotes: downvotes } }
        );

        // Fetch all posts for rendering or further use
        const posts = await Post.find();

        // Optionally render the view or send a response
        res.render("note-vote", { user: { username: currentUser }, posts: posts });
    } catch (error) {
        console.error("Error in upvoting:", error);
        res.status(500).send("Error in upvoting");
    }
});


// POST /downvote - Handle downvoting a post and render updated note-vote page
app.post("/downvote", async (req, res) => {
    try {
        const currentUser = req.user.username; // Correctly retrieve the logged-in user
        const postId = parseInt(req.body["post_id"]); // Get the post ID from the request body

        // Find the post to be downvoted
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Initialize upvotes and downvotes
        let upvotes = post.upvotes;
        let downvotes = post.downvotes;

        // Update downvotes and upvotes
        if (!downvotes.includes(currentUser)) {
            downvotes.push(currentUser); // Add the user to downvotes
            upvotes = upvotes.filter(user => user !== currentUser); // Remove the user from upvotes
        } else {
            downvotes = downvotes.filter(user => user !== currentUser); // Toggle downvote off
        }

        // Save the updated post
        await Post.updateOne(
            { _id: postId },
            { $set: { upvotes: upvotes, downvotes: downvotes } }
        );

        // Fetch all posts for rendering
        const posts = await Post.find();

        // Render the updated view
        res.render("note-vote", { user: { username: currentUser }, posts: posts });
    } catch (error) {
        console.error("Error in downvoting:", error);
        res.status(500).send("Error in downvoting");
    }
});


            
   
   

