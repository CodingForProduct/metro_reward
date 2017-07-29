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

User.create({
 	first: 'Richard',
 	last: 'Snyder',
 	username: 'rs@b.com',
 	pointsBalance: 472,
 	tapNum: '1234567891012131',
	myhash: '9f1cc06c335a59b4928ff7f812b0e854858016ce5a7b78b277fe5beafefbb0babaaa52847693e8a577c9986fe0db89f8b8a72412ded9a084d03e14fbe8d644f3fd81793b8b15238dfb96b6f351e3b57a1746a0f666acb942aab56ca3765148b3c3949eacce5fda447dff59616d7d4395dbaf1b60c98789083b2c5be65fe2197316d22e2fcf2f98301c027a1cb9de60fe754bdfc09dfd24eb429836dde8880db20672188974f468826c6ececc21619e3b9699af8a160b61d69bba0fa14221990027fae3a2aba60f4aad94be9b1145c23493fb93a2c48c2aca4cbe9f8c6610628671195c35a063a10a3ca305a6cecef2866ab5f16433400f9417a81a550444ed94b0a2e3153250dbf9ca2f657b413c5e6bc84af859427ff6e521035cc03fd3663ceaf3f9bedd4b1f49d35b0038d265c8126154e5baf8d4ef905d1338b561296b57eaf6d0ca512e76fd21a202d105fdf5665e30fae82261f1ef9ad4ed8b90f01c568560cc0166483a3ba29a42e3413b38dbb5a926cc5bc1e64202facf4f265db1a2bc6d8e673b045a22d409c24f5bd4bd3983e5b6d298b0a6a0f4c5b7e8cc724264cf6a7c120316e9dfbd2dc8cd0ad222783d1aa351625cbac7be6d02ac4ec64a3350632325254790589a0bbe8c0acb10341d1b63f238f30ab67a4c990b4daa8c276c15f6dd2e167610d141371c7f85dc0addf45a96772fa986d24a5b23b4772959',
	mysalt: 'd3295907af4681929896e97be20f903b815df92825403686640c27395b95e7d8'
 });

// Create table in database if not exists
connection.sync();

module.exports = User, Vendor;
