var supertest = require("supertest");
var should = require("should");
var config = require("../config/config");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");
var token = 'no-token';

describe("Messages endpoint test", function () {

    it("unauthenticated call to messages", function (done) {

        server
            .get("/messages")
            .expect("Content-type", /json/)
            .expect(401) // THis is HTTP response
            .end(function (err, res) {
                res.status.should.equal(401);
                done();
            });
    });

    it("validation should fail on not giving coordinates", function (done) {

        server
            .post("/api/oauth/token")
            .send({
                client_id: config.client_id,
                client_secret: config.client_secret,
                grant_type: "password",
                username: "Do",
                password: "pass"
            })
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {
                token = res.body.token_type + ' ' + res.body.access_token;
                res.status.should.equal(200);
                done();
            });
    });

});