const express = require("express");
require("dotenv").config();



const mongoose = require( "mongoose" );
// connect to mongoose on port 27017
mongoose.connect( "mongodb://localhost:27017/note-vote");


// create a mongoose schema for a User
const userSchema = new mongoose.Schema ({
    email:   String,
    password: String
});

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




// Create the Express app
const app = express();

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
app.post("/note-vote", async(req, res) => {
    try {
        const findUser = await User.find({
            email: {$eq: req.body["email"]},
            password: {$eq: req.body["password"]}
        });

        console.log(findUser);

        if(findUser.length > 0)
            {
                try {
                    const posts = await Post.find()
                    return res.render("note-vote", { user: { email: req.body["email"] }, posts: posts });

                    
                } catch (error) {
                    return
                    
                }

            }
            else
            {
                return res.send("user doesnt exist or password is inncorrect")
            }
         
    } catch (error) {
        return res.send("error")
        
    }
   
});

// POST /register this route is to Handle user registration
app.post("/register", async (req, res) => {
    if (req.body["invite-code"] === "Note Vote 2024") {
        try {
            // Check if a user with the given email already exists
            const existingUser = await User.find({ email: { $eq: req.body["email"] } });

            console.log(existingUser);

            if (existingUser.length === 0) {
                console.log("WE ARE HERE!");
                // If the user does not exist, create a new user
                const newUser = new User({
                    email: req.body["email"],
                    password: req.body["password"]
                });

                // Save the new user to the database
                await newUser.save();

                // Get all posts
                try {
                    const posts = await Post.find();

                    console.log(posts);
                    console.log("User made");
                    // Render the note-vote page with user and posts data
                    return res.render("note-vote", { user: { email: req.body["email"] }, posts: posts });

                } catch (error) {
                    console.log("Error fetching posts:", error);
                    return;
                }

            } else {
                // If the user already exists, throw an error to be caught in the outer catch block
                throw new Error("User already exists");
            }

        } catch (error) {
            console.log("Error occurred during registration:", error.message);
            return res.send("Error occurred during registration");
        }
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
            creator: req.body["user_email"],
            upvotes: [],
            downvotes: []

        })

        await newPost.save();

        try {
            const posts = await Post.find();
            return res.render("note-vote", { user: { email: req.body["user_email"] }, posts: posts });

            
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
app.post("/upvote", async(req, res) => {
    try {
        let post = await Post.find({_id : parseInt(req.body["post_id"])})
        console.log(post);
        
    } catch (error) {
        return;
        
    }

    let postId = parseInt(req.body["post_id"]);
    let userEmail = req.body["user_email"];

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            let posts = JSON.parse(jsonString);

            posts.forEach(post => {
                if (post._id === postId) {
                    if (!post.upvotes.includes(userEmail)) {
                        post.upvotes.push(userEmail);
                        post.downvotes = post.downvotes.filter(user => user !== userEmail);
                    } else {
                        post.upvotes = post.upvotes.filter(user => user !== userEmail);
                    }
                }
            });

            fs.writeFile(__dirname + "/posts.json", JSON.stringify(posts, null, 2), "utf8", err => {
                if (err) return res.status(500).send("Server error");
                res.render("note-vote", { user: { email: userEmail }, posts: posts });
            });
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});

// POST /downvote - Handle downvoting a post and render updated note-vote page
app.post("/downvote", (req, res) => {
    let postId = parseInt(req.body["post_id"]);
    let userEmail = req.body["user_email"];

    fs.readFile(__dirname + "/posts.json", "utf8", (err, jsonString) => {
        if (err) return res.status(500).send("Server error");

        try {
            let posts = JSON.parse(jsonString);

            posts.forEach(post => {
                if (post._id === postId) {
                    if (!post.downvotes.includes(userEmail)) {
                        post.downvotes.push(userEmail);
                        post.upvotes = post.upvotes.filter(user => user !== userEmail);
                    } else {
                        post.downvotes = post.downvotes.filter(user => user !== userEmail);
                    }
                }
            });

            fs.writeFile(__dirname + "/posts.json", JSON.stringify(posts, null, 2), "utf8", err => {
                if (err) return res.status(500).send("Server error");
                res.render("note-vote", { user: { email: userEmail }, posts: posts });
            });
        } catch (err) {
            res.status(500).send("Error parsing posts JSON");
        }
    });
});
