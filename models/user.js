var Sequelize = require("sequelize");
var passportLocalSequelize = require("passport-local-sequelize");

// Connect to postgres db via sequelize
var connection = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
	host: process.env.PGHOST,
	dialect: "postgres",
	port: process.env.PGPORT,
	pool: {
	 max: 5,
	 min: 0,
	 idle: 10000
 }
});

connection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

  // ******* Postgres MODELS ********
  var User = connection.define("user", {
  	first: Sequelize.STRING,
  	last: Sequelize.STRING,
  	username: Sequelize.STRING,
  	pointsBalance: Sequelize.INTEGER,
  	tapNum: Sequelize.STRING,
    myhash: Sequelize.TEXT,
  	mysalt: Sequelize.STRING
  });

  var Vendor = connection.define("vendor", {
  	name: Sequelize.STRING,
  	reward: Sequelize.STRING,
  	pointsNeeded: Sequelize.INTEGER,
  	imgURL: Sequelize.STRING
  });

// Activate passport-local-sequelize
passportLocalSequelize.attachToUser(User, {
    usernameField: "username",
    hashField: "myhash",
    saltField: "mysalt"
});

// Create table in database if not exists
connection.sync();

module.exports = User;
