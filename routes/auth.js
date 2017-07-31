const passport = require('passport');
const router = require('express').Router();
const redirects = {
    failureRedirect : "/#/login",
    successRedirect : '/'
};

router.get("/twitch", passport.authenticate("twitch"));

router.get("/twitch/callback", passport.authenticate("twitch", redirects), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;