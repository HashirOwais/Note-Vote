
const Post = require("../model/postModel");

const post_note_vote = async(req, res) =>{
    //checking if user is autheticaated to enter the /note-vote route
    console.log("A user is accessing the reviews route using get, and...");
    if ( req.isAuthenticated() ){
        try {
            const posts = await Post.find()
            return res.render("note-vote", { user: { username: req.user.username }, posts: posts });

            
        } catch (error) {
            console.log(error)
            
        }
    } else {
        console.log( "was not authorized." );
        res.redirect( "/" );
    }

    
}

const post_addpost =  async(req, res) => {
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


  
   
}

const post_upvote = async (req, res) => {
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
}

const post_downvote = async (req, res) => {
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
}

module.exports ={
    post_note_vote,
    post_addpost,
    post_upvote,
    post_downvote,


}