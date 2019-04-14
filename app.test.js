"use strict";
const colors = require("colors");

let app = require("./bin/www");
let chai = require("chai"),
  chaiHttp = require("chai-http");

const expect = chai.expect;

chai.use(chaiHttp);

let data = [];

describe("APP ".blue, () => {
  describe("GET /", () => {
    it("should throw an 404 error", done => {
      chai
        .request(app)
        .get("/")
        .end((err, res, body) => {
          if (err) {
            done(err);
          } else {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
          }
        });
    });
  });
  describe("POST /", () => {
    it("should throw an 404 error", done => {
      chai
        .request(app)
        .post("/")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({ data: "dummy" })
        .end((err, res, body) => {
          if (err) {
            done(err);
          } else {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            done();
          }
        });
    });
  });
});
