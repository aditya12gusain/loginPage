const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose.connect("mongodb://localhost:27017/newusersDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/views/register.html");
});

app.post("/register", function (req, res) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.sendFile(__dirname + "/views/hello.html");
        }
      });
    });
  });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.sendFile(__dirname + "/views/hello.html");
          }
        });
      }
    }
  });
});
//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
