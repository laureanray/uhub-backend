const User = require("./userModel");
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../../middlewares/authenticate");

router.get("/", authenticate, (req, res, next) => {
  User.find({})
    .exec()
    .then(result => {
      if (result) {
        res.status(200).send(result);
      }
    });
});

router.post("/signup", (req, res, next) => {
  const body = req.body;
  bcrypt.hash(req.body["private"]["password"], 10).then(hash => {
    body.private.password = hash;
    const user = User(req.body);
    user
      .save()
      .then(result => {
        if (result === user) res.status(201).send({ Message: "User Created" });
      })
      .catch(error => {
        if (error) {
          if (error.name === "ValidationError") {
            res.status(400).send({ Message: "Validation Error" });
          } else if (error.name === "MongoError") {
            if (error.code === 11000) {
              res.status(403).send({ Message: "Duplicate" });
            } else {
              res.status(403).send({ Message: "MongoError" });
            }
          }
        }
      });
  });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(404).send({
          message: "User doesnt Exist"
        });
      }
      bcrypt
        .compare(req.body.password, user[0].private.password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).send({
              message: "Authentication Successful",
              token: token
            });
          } else {
            return res.status(401).send({
              message: "Wrong Password"
            });
          }
        })
        .catch(error => {
          return res.status(401).send({
            message: "Authentication Failed"
          });
        });
    })
    .catch();
});

module.exports = router;
