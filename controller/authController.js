const User = require("../model/UserModel");
const Post = require("../model/postModel");
const passport = require("passport")




const auth_login = (req, res) =>{
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
            passport.authenticate( "local" )( req, res, () => {
                res.redirect("note-vote");
                
            });
        }
    });

}

const auth_register = (req, res) => {

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
}

const auth_logout = function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      res.redirect('/');
    });
  }


module.exports = {
    auth_login,
    auth_register,
    auth_logout
}