const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema({
    _id: Number,        // Auto-incremented ID for posts
    text: String,       // Content of the post
    creator: String,    // Username of the post creator
    upvotes: [String],  // Array of usernames who upvoted
    downvotes: [String] // Array of usernames who downvoted
});

// Export the Post model
module.exports = mongoose.model("Post", postSchema);
