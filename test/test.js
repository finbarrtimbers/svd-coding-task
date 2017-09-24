'use strict';

var expect = require('chai').expect;
var topNKeywords = require('../index');
var fs = require('fs');

// add check that sum === len(keywords)

describe('#getTopNKeywords', function() {
    it('should return N words', function() {
        var text = fs.readFile("article.txt", 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            var strings = data.split('.');
            var result = topNKeywords(strings, 10);
            expect(result.length).to.equal(10);
        });
    });
});
