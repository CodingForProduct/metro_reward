// Include node modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");

// Use node modules
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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


// ******* ROUTES ********

// Root goes to sign-in page with sign-up button
app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/home", function(req, res) {
	res.render("home", {user: user, vendors:vendors});
});

app.post("/myrewards", function(req, res) {
	var first = req.body.first;
	var last = req.body.last;
	var email = req.body.email;
	var tapNum = req.body.tapNum;
	var newUser = {first: first, last: last, email: email, tapNum: tapNum, pointsBalance: 0};

	user.push(newUser);
	res.redirect("/myrewards");
})

app.get("/myrewards", function(req, res) {
	res.render("myrewards", {user: user, vendors:vendors});
})

app.get("/signup", function(req, res) {
	res.render("signup");
})

app.get("/*", function(req, res) {
  res.render("404");
});

// Run app on localhost:3000
app.listen(3000, function() {
	console.log("App is running on Port 3000");
});
