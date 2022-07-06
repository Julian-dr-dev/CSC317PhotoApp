var express = require('express');
var router = express.Router();
var isLoggedin = require('../middleware/routesprotector').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
//const {getNecentPosts, getPostById, getCommentsByPostId} = require('../middleware/postsmiddleware');
var db = require('../conf/database');

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
    res.render('index', {title: "IPa APP"});
});


router.get('/login', (req, res, next) => {
    res.render("login", {title: "Login"});
});

router.get('/register', (req, res, next) => {
    res.render("registration", {title: "Registration"});
});

router.use('/postImage', isLoggedin);
router.get('/postImage', (req, res, next) => {
    res.render("postimage", {title: "Post Image"});
});


router.get('/post/:id(\\d+)', (req, res, next) => {
    let baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.created \
  FROM users u \
  JOIN posts p \
  ON u.id=fk_userid \
  WHERE p.id=?";

    let postId = req.params.id;

    db.execute(baseSQL, [postId])
        .then(([results, fields]) => {
            if(results && results.length) {
                let post = results[0];
                res.render('imagepost', {currentPost: post});

            }else{
                req.flash('error', 'THis is not the post you are looking for');
                res.redirect('/');
            }

        })
    //req.session.postId=req.params.id;
    //res.render("imagepost", { title: `Post ${req.params.id}`, post:res.locals.currentPost});
});



module.exports = router;
//