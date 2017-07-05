// Include node modules
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");

// Use node modules
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// ******* ROUTES ********

// Root goes to sign-in page with sign-up button
app.get("/", function(req, res) {
	res.render("landing");
});

app.get("/home", function(req, res) {
	res.render("home");
});

app.get("/*", function(req, res) {
  res.render("404");
});

// Run app on localhost:3000
app.listen(3000, function() {
	console.log("App is running on Port 3000");
});
