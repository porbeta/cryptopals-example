'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var cryptopals = require('../index');


describe('#isValidHex', function() {
	it('should confirm hex', function() {
		var result = cryptopals.isValidHex('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');
        expect(result).to.equal(true);
    });
	
	it('should reject non hex', function() {
		var result = cryptopals.isValidHex('asdf');
        expect(result).to.equal(false);
    });
	
	it('should reject capital letters', function() {
		var result = cryptopals.isValidHex('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6D');
        expect(result).to.equal(false);
    });
});

describe('#toHexValueArray', function() {
	it('should return hex value array', function() {
		var result = cryptopals.toHexValueArray('ab209');
        assert.deepEqual(result, [10, 11, 2, 0, 9]);
    });
	
	it('should throw error for invalid hex string', function() {
		expect(function() { cryptopals.toHexValueArray('QWER'); }).to.throw(Error, "Invalid hex string provided");
	});
});

describe('#hexToBase64', function() {
	it('should return base64 value of hex', function() {
		var result = cryptopals.hexToBase64('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');
        expect(result).to.equal("SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t");
    });
	
	it('should return base64 value with padding length of 2', function() {
		var result = cryptopals.hexToBase64('aaaa');
		expect(result).to.equal("qqo==");
    });
	
	it('should return base64 value with padding length of 1', function() {
		var result = cryptopals.hexToBase64('aaaa0');
		expect(result).to.equal("qqoA=");
    });
	
	it('should return base64 value with no padding', function() {
		var result = cryptopals.hexToBase64('aaaa00');
		expect(result).to.equal("qqoA");
    });
	
	it('should throw error for invalid hex string', function() {
		expect(function() { cryptopals.hexToBase64('POI') }).to.throw(Error, "Invalid hex string provided");
	});
});