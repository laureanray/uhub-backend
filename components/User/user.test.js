"use strict";
const colors = require("colors");

let app = require("../../bin/www");
let chai = require("chai"),
  chaiHttp = require("chai-http");

const expect = chai.expect;
const User = require("./userModel");
chai.use(chaiHttp);

let data = [];

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
            expect(res).to.have.status(201);

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
            expect(res).to.have.status(201);
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
                  expect(res).to.have.status(403);
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
});
