// Include node modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressValidator = require('express-validator');
var request = require("request");
var Sequelize = require("sequelize");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
var saltRounds = 10;

// Use node modules
app.set("view engine", "ejs");
app.use(express.static("public"));
require('dotenv').config()
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
// app.use(flash());
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   store: store
// }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to postgres db via sequelize
var connection = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
	host: process.env.PGHOST,
	dialect: 'postgres',
	port: process.env.PGPORT,
	pool: {
	 max: 5,
	 min: 0,
	 idle: 10000
 }
});

connection.sync();
connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// ******* Postgres MODELS ********
var User = connection.define('user', {
	first: Sequelize.STRING,
	last: Sequelize.STRING,
	email: Sequelize.STRING,
	pointsBalance: Sequelize.INTEGER,
	tapNum: Sequelize.STRING,
	password: Sequelize.STRING
});

var Vendor = connection.define('vendor', {
	name: Sequelize.STRING,
	reward: Sequelize.STRING,
	pointsNeeded: Sequelize.INTEGER,
	imgURL: Sequelize.STRING
});

// Initialize passport for login/authentication
passport.use(new LocalStrategy({
    usernameField: "email"
  },
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Initialize bcrypt hash/salt





// ******* ROUTES ********

// Root goes to sign-in page with sign-up button
app.get("/", function(req, res) {
	res.render("login");
});

app.post('/', passport.authenticate('local', {
	successRedirect: '/home',
	failureRedirect: '/',
	failureFlash: true })
);

app.get("/signup", function(req, res) {
	res.render("signup");
})

app.post("/signup", function(req, res) {
	// Get 'newUser' details from form inputs
	var first = req.body.first;
	var last = req.body.last;
	var email = req.body.email;
	var tapNum = req.body.tapNum;
	var password = req.body.password;

	// Validate form inputs for clean data & generate errors if unclean
	req.checkBody("email", "Invalid email address. Please try again.").isEmail();
	req.checkBody("email", "Email address must be between 4-100 characters long, please try again.").len(4, 100);
	req.checkBody("tapNum", "TAP card number must be 16 digits long, please try again.").len(16, 16);
	req.checkBody("password", "Password must be between 6-30 characters long.").len(6, 30);
	req.checkBody("passwordConfirm", "Password must be between 6-30 characters long.").len(6, 30);
	req.checkBody("passwordConfirm", "Passwords do not match, please try again.").equals(req.body.password);
	var errors = req.validationErrors();

	// Hash password & create new user then redirect to login screen
	if (!errors) {
		bcrypt.hash(password, saltRounds, function(err, hash) {
			var newUser = {first: first, last: last, email: email, tapNum: tapNum, pointsBalance: 0, password: hash};
			User.create(newUser);
		});
		res.redirect("/");
	} else {
		console.log(errors);
		res.redirect("/signup");
		// !!! PRINT ERRORS FOR USER
	}
});

app.get("/home", function(req, res) {
	res.render("home", {user: user, vendors:vendors});
});

app.get("/myrewards", function(req, res) {
	res.render("myrewards", {user: user, vendors:vendors});
})

app.get("/earnpoints", function(req, res) {
	res.render("earnpoints");
})

app.get("/*", function(req, res) {
  res.render("404");
});

// Run app on localhost:3000
app.listen(3000, function() {
	console.log("App is running on Port 3000");
});



// ******* TABLE DATA *******

// FIGURE OUT HOW TO REMOVE THIS SO WE DON'T CREATE A NEW USER EVERY TIME THE APP STARTS
// connection.sync();
// .then(function () {
// 	User.create({
// 		first: 'John',
// 		last: 'Bello',
// 		email: 'a@b.com',
// 		pointsBalance: 697,
// 		tapNum: '1234567891012131',
// 		password: '123'
// 	});
// });

// ******* SEED DATA ********

var user = [
	{
		first: "John",
		last: "Bello",
		email: "a@b.com",
		pointsBalance: 697,
		tapNum: 1234567891012131
	},
	{
		first: "Erica",
		last: "Cerulo",
		email: "e@b.com",
		pointsBalance: 253,
		tapNum: 7649683429652100
	}
];

var vendors = [
	{
		name: "Chipotle",
		reward: "Free Burrito",
		pointsNeeded: 150,
		imgURL: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/1024px-Chipotle_Mexican_Grill_logo.svg.png"
	},
	{
		name: "Dominos",
		reward: "Free Breadsticks",
		pointsNeeded: 100,
		imgURL: "https://www.festisite.com/static/partylogo/img/logos/dominos_pizza.png"
	},
	{
		name: "Menchie's",
		reward: "Free Small Cup",
		pointsNeeded: 250,
		imgURL: "https://works-progress.com/wp-content/uploads/2015/12/menchies.png"
	}
];
