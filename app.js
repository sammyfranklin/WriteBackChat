const fault = require('./globals').fault;
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const TwitchStrategy = require('passport-twitch').Strategy;
const User = require('./models/user');

const app = express();
mongoose.connect("mongodb://sam:password@ds135680.mlab.com:35680/writebackchat");

passport.serializeUser(function(user, done) {
	console.log("S");
	return done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log("D");
	return done(null, user);
});
passport.use('twitch', new TwitchStrategy({
        clientID: "97kz56gjzb92am467nfilk7ni95em0",
        clientSecret: "m7l9lug6o1ac0wciwuziulcppjktei",
        callbackURL: "http://localhost:8000/auth/twitch/callback",
        scope: "user_read"
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(()=>{
			User.findOne({ "twitch.id" : profile.id }, (err, user) => {
				if(!fault(err, ()=>done(null, false))){
					if(user) {
						console.log("Found user");
						return done(null, user);
					}
					else {
						console.log("Couldn't find user, so creating one...");
						User.create({
							twitch : profile,
							accessToken : accessToken,
							refreshToken : refreshToken
						}, (err, user)=>{
							if(!fault(err, ()=>done(null, false))){
								return done(null, user);
							}
						});
					}
				}
			});
        });
    }
));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// auth
app.use(session({
	secret: 'super duper secret 123',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/channels', require('./routes/channels'));
app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
