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

    it('should convert double digits', function() {
        var result = numFormatter(12);
        expect(result).to.equal('12');
    });

    it('should convert triple digits', function() {
        var result = numFormatter(123);
        expect(result).to.equal('123');
    });

    it('should convert 4 digits', function() {
        var result = numFormatter(1234);
        expect(result).to.equal('1,234');
    });

    it('should convert 5 digits', function() {
        var result = numFormatter(12345);
        expect(result).to.equal('12,345');
    });

    it('should convert 6 digits', function() {
        var result = numFormatter(123456);
        expect(result).to.equal('123,456');
    });

    it('should convert 7 digits', function() {
        var result = numFormatter(1234567);
        expect(result).to.equal('1,234,567');
    });

    it('should convert 8 digits', function() {
        var result = numFormatter(12345678);
        expect(result).to.equal('12,345,678');
    });
});
