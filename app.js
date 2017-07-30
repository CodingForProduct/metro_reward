// Require node modules
var express = require("express");
var app = express();
var Sequelize = require("sequelize");
var passport = require("passport");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressValidator = require('express-validator');
var flash = require("connect-flash");
var session = require("express-session");
var passportLocalSequelize = require("passport-local-sequelize");
var User = require("./models/user");
// var SequelizeStore = require('connect-session-sequelize')(session.Store);
// var sessionStore = new SequelizeStore();

// Use node modules
if (NPM_CONFIG_PRODUCTION != true){
  require('dotenv').config()
}
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(flash());
app.use(require("express-session")({
  secret: 'process.env.SESSION_SECRET',
  // cookie: { secure: true }, // For https secure must be true
	// store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ******* ROUTES ********

app.get("/", function(req, res) {
  res.redirect("/login");
});

app.get("/login", function(req, res) {
	res.render("login");
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/"
  }), function(req, res, next) {});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
});

app.get("/signup", function(req, res) {
	res.render("signup", {currentUser: req.user, vendors:vendors});
});

app.post("/signup", function(req, res) {
	// Validate form inputs for clean data & generate errors if unclean
	req.checkBody("username", "Invalid email address. Please try again.").isEmail();
	req.checkBody("username", "Email address must be between 4-100 characters long, please try again.").len(4, 100);
	req.checkBody("tapNum", "TAP card number must be 16 digits long, please try again.").len(16, 16);
	req.checkBody("password", "Password must be between 6-30 characters long.").len(6, 30);
	req.checkBody("passwordConfirm", "Password must be between 6-30 characters long.").len(6, 30);
	req.checkBody("passwordConfirm", "Passwords do not match, please try again.").equals(req.body.password);

  // Get 'newUser' details from form inputs
	var first = req.body.first;
	var last = req.body.last;
	var username = req.body.username;
	var tapNum = req.body.tapNum;
  var newUser = {first: first, last: last, username: username, tapNum: tapNum, pointsBalance: 0};

  // Create new user in database
  User.register(new User(newUser), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("/signup");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/home");
    });
  });
});

app.get("/home", isLoggedIn, function(req, res) {
	res.render("home", {currentUser: req.user, vendors:vendors});
});

app.get("/myrewards", isLoggedIn, function(req, res) {
	res.render("myrewards", {currentUser: req.user, vendors:vendors});
});

app.get("/earnpoints", isLoggedIn, function(req, res) {
	res.render("earnpoints", {currentUser: req.user, vendors:vendors});
});

app.get("/learnmore", function(req, res) {
	res.render("learnmore");
});

app.get("/*", function(req, res) {
  res.render("404", {currentUser: req.user, vendors:vendors});
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Run app on localhost:3000
app.listen(process.env.PORT || 3000, function() {
	console.log("App is running on Port 3000");
});



// ******* SEED TABLE DATA *******

// Vendor.create({
// 	name: "Menchie's",
// 	reward: "Free Small Cup",
// 	pointsNeeded: 250,
// 	imgURL: "https://works-progress.com/wp-content/uploads/2015/12/menchies.png"
// });

// ******* SEED DATA ********

var vendors = [
	{
		name: "Dominos",
		reward: "Free Breadsticks",
		pointsNeeded: 100,
		imgURL: "https://www.festisite.com/static/partylogo/img/logos/dominos_pizza.png"
	},
  {
		name: "Chipotle",
		reward: "Free Burrito",
		pointsNeeded: 150,
		imgURL: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1024px-Chipotle_Mexican_Grill_logo.svg.png"
	},
  {
    name: "Pink's Hot Dogs",
    reward: "Free Dog, Any Type",
    pointsNeeded: 150,
    imgURL: "http://www.pinkshotdogslv.com/rescon/uploads/2014/02/Pinks_logo_social.png"
  },
  {
    name: "Amoeba Music",
    reward: "1 Free Movie Poster",
    pointsNeeded: 200,
    imgURL: "https://pbs.twimg.com/profile_images/1884615902/Logo-Watermarked-Sq.jpg"
  },
  {
    name: "Philippe's The Original",
    reward: "One Sandwich",
    pointsNeeded: 200,
    imgURL: "http://4.bp.blogspot.com/-mzkXMnXKq5w/UKI6eO6ftCI/AAAAAAAAFcM/G59iu0s0_pE/s1600/philippes_logo.png"
  },
  {
    name: "Menchie's",
    reward: "Free Small Cup",
    pointsNeeded: 250,
    imgURL: "https://works-progress.com/wp-content/uploads/2015/12/menchies.png"
  },
  {
    name: "Voodoo Donuts",
    reward: "Free Donut",
    pointsNeeded: 250,
    imgURL: "https://vignette3.wikia.nocookie.net/donuts/images/5/5a/Voodoo_Doughnut_01.png"
  },
	{
		name: "Griffith Observatory",
		reward: "Free Entrance Ticket",
		pointsNeeded: 300,
		imgURL: "http://griffithobservatory.org/slideshow/slide_show00.jpg"
	}
];
