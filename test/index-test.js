var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

describe("Index page test", function () {

    it("should return home page", function (done) {
        
        server
            .get("/")
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });

});