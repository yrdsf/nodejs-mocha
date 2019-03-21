var expect  = require('chai').expect;
var request = require('request');

it('Get Product status', function(done) {
    request.get('http://localhost:3000')
     .on('response', function(response) {
        console.log(response);
        //console.log(response._events.response);
        expect(response.statusCode).to.equal(200);
        done();
    });
});