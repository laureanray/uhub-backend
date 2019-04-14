/*
  Initialize and load config file. 
*/

require("../config/config");

/*
  Load all the modules.
  Set port 
*/

const colors = require("colors");
const mongoose = require("mongoose");

let admin = require("firebase-admin");

let app = require("../app");
let port = process.env.PORT;

/*
  Initialize firebase SDK
*/

let serviceAccount = require("/home/laureanray/pupeut-c320e-firebase-adminsdk-klp04-13dd05dee7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pupeut-c320e.firebaseio.com/"
});

/*
  Set the environment. 
*/
if (process.env.NODE_ENV === "production") {
  console.log("Production".bgGreen);
} else if (process.env.NODE_ENV === "test") {
  console.log("Testing Env".bgBlue);
} else if (process.env.NODE_ENV === "dev") {
  console.log("Development".bgRed);
} else {
  console.log(`[${process.env.NODE_ENV}]`);
}

/*
  MongoDB Connection through Mongoose
*/

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  let cb;
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "dev") {
    cb = port => {
      console.log(`Server is up and running on port ${port}`);
    };
  } else {
    cb = port => {};
  }

  app.listen(port, cb(port));
});

module.exports = app;
