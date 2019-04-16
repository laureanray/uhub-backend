"use strict";
const colors = require("colors");
const axios = require("axios");
const check_token = require("../../utils/functions");

let app = require("../../bin/www");
let chai = require("chai"),
  chaiHttp = require("chai-http");

const expect = chai.expect;
const User = require("./userModel");
chai.use(chaiHttp);

let data = [];
let data2 = [];

beforeEach(done => {
  data = {
    name: {
      firstName: "John",
      lastName: "Doe"
    },
    university: "Polytechnic University of the Philippines",
    degree: "B.S.",
    major: "Computer Engineering",
    studentNumber: "2000-00000-MN-0",
    email: "johndoe@example.com",
    birthday: "September-19-1999",
    private: {
      password: "password"
    }
  };

  data2 = {
    name: {
      firstName: "Dummy",
      lastName: "Data"
    },
    university: "Polytechnic University of the Philippines",
    degree: "B.S.",
    major: "Computer Engineering",
    studentNumber: "2000-00001-MN-0",
    email: "dummydata@example.com",
    birthday: "September-19-1999",
    private: {
      password: "password"
    }
  };

  User.deleteMany({}).then(() => {
    done();
  });
});

describe("USER Component".blue, () => {
  describe("POST /user/signup", () => {
    it("should create user successfully ", done => {
      chai
        .request(app)
        .post("/user/signup")
        .set("content-type", "application/json")
        .send(data)
        .end((err, res, body) => {
          if (err) {
            done(err);
          } else {
            expect(err).to.be.null;
            expect(res.body.message).to.equal("USER_CREATED");

            User.findOne({ studentNumber: data.studentNumber }, (err, docs) => {
              if (docs.length !== 0) {
                if (docs.studentNumber === data.studentNumber) {
                  done();
                }
              }
              if (err) done(err);
            });
          }
        });
    });

    it("should not allow duplicate user signup ", done => {
      chai
        .request(app)
        .post("/user/signup")
        .set("content-type", "application/json")
        .send(data)
        .end((err, res, body) => {
          if (err) {
            done(err);
          } else {
            expect(err).to.be.null;
            expect(res.body.message).to.equal("USER_CREATED");
            chai
              .request(app)
              .post("/user/signup")
              .set("content-type", "application/json")
              .send(data)
              .end((err, res, body) => {
                if (err) {
                  done(err);
                } else {
                  expect(err).to.be.null;
                  expect(res.body.message).to.equal("DUPLICATE");
                  done();
                }
              });
          }
        });
    });

    it("should not allow incomplete information", done => {
      data.studentNumber = "";
      chai
        .request(app)
        .post("/user/signup")
        .set("content-type", "application/json")
        .send(data)
        .end((err, res, body) => {
          if (err) {
            done(err);
          } else {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
          }
        });
    });
  });

  describe("POST /user/login", () => {
    // delete
    it("should logged in (valid credentials) checks res.body.message ", done => {
      chai
        .request(app)
        .post("/user/signup")
        .set("content-type", "application/json")
        .send(data2)
        .end((err, res, body) => {
          if (err) {
            done(err);
          } else {
            expect(err).to.be.null;
            expect(res.body.message).to.satisfy(statusMessage => {
              if (
                statusMessage === "USER_CREATED" ||
                statusMessage === "DUPLICATE"
              ) {
                return true;
              } else {
                return false;
              }
            });
            User.findOne({ email: data2.email }, (err, docs) => {
              if (docs.length !== 0) {
                if (docs.email === data2.email) {
                  chai
                    .request(app)
                    .post("/user/login")
                    .set("content-type", "application/json")
                    .send({
                      email: data2.email,
                      password: data2.private.password
                    })
                    .end((err, res, body) => {
                      if (err) {
                        done(err);
                      } else {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.equal("AUTH_SUCCESS");
                        done();
                      }
                    });
                }
              }
              if (err) done(err);
            });
          }
        });
    });
    it("should logged in and respond with a valid token  ", done => {
      chai
        .request(app)
        .post("/user/signup")
        .set("content-type", "application/json")
        .send(data2)
        .end((err, res, body) => {
          if (err) {
            done(err);
          } else {
            expect(err).to.be.null;
            expect(res.body.message).to.satisfy(statusMessage => {
              if (
                statusMessage === "USER_CREATED" ||
                statusMessage === "DUPLICATE"
              ) {
                return true;
              } else {
                return false;
              }
            });
            User.findOne({ email: data2.email }, (err, docs) => {
              if (docs.length !== 0) {
                if (docs.email === data2.email) {
                  chai
                    .request(app)
                    .post("/user/login")
                    .set("content-type", "application/json")
                    .send({
                      email: data2.email,
                      password: data2.private.password
                    })
                    .end((err, res, body) => {
                      if (err) {
                        done(err);
                      } else {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.equal("AUTH_SUCCESS");
                        expect(res.body.token).to.satisfy(token => {
                          return check_token(token);
                        });
                        done();
                      }
                    });
                }
              }
              if (err) done(err);
            });
          }
        });
    });
  });
});
