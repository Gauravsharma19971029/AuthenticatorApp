//jshint esversion:6
require("dotenv-extended").load();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", async function (req, res) {
  userName = req.body.username;
  userPassword = req.body.password;
  const user = new User({
    name: userName,
    password: userPassword,
  });
  await user.save();
  res.render("secrets");
});

app.post("/login", async function (req, res) {
  userName = req.body.username;
  userPassword = req.body.password;
  User.findOne(
    {
      name: userName,
    },
    function (err, user) {
      if (err) {
        console.log("Error");
      } else {
        if (user == null) {
          res.send("<h1>User Name not  found</h1>");
        } else if (user.password === userPassword) {
          res.render("secrets");
        } else {
          res.send("<h2>Wrong Password</h2>");
        }
      }
    }
  );
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
