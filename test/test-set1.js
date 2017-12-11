'use strict';

var assert = require('chai').assert;
var expect = require('chai').expect;
var set1 = require('../lib/set1');


describe('#isValidHex', function() {
	it('should confirm hex', function() {
		var result = set1.isValidHex('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');
        expect(result).to.equal(true);
	});

	it('should reject non hex', function() {
		var result = set1.isValidHex('asdf');
        expect(result).to.equal(false);
    });
	
	it('should reject capital letters', function() {
		var result = set1.isValidHex('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6D');
        expect(result).to.equal(false);
    });
});

describe('#checkValidHex', function() {
	it('should confirm hex', function() {
		var result = set1.checkValidHex('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');
        expect(result).to.equal(true);
    });
	
	it('should reject non hex', function() {
        expect(function() { set1.checkValidHex('asdf'); }).to.throw(Error, "Invalid hex string provided");
    });
	
	it('should reject capital letters', function() {
		expect(function() { set1.checkValidHex('123A'); }).to.throw(Error, "Invalid hex string provided");
	});
	
	it('should confirm multiple valid hex strings', function() {
		var result = set1.checkValidHex('4927', '6d20', '6b69', '6c6c');
        expect(result).to.equal(true);
    });

	it('should reject the third hex', function() {
        expect(function() { set1.checkValidHex('0000', 'aaaa', 'asdf'); }).to.throw(Error, "Invalid hex string provided");
    });
});

describe('#checkValidUnicodeHex', function() {
	it('should confirm hex', function() {
		var result = set1.checkValidUnicodeHex('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');
        expect(result).to.equal(true);
	});
	
	it('should confirm hex from file', function() {
		var result = set1.checkValidUnicodeHex('0e3647e8592d35514a081243582536ed3de6734059001e3f535ce6271032');
        expect(result).to.equal(true);
	});

	it('should reject non hex', function() {
        expect(function() { set1.checkValidUnicodeHex('asdf'); }).to.throw(Error, "Invalid unicode hex string provided");
    });
	
	it('should reject capital letters', function() {
		expect(function() { set1.checkValidUnicodeHex('123A'); }).to.throw(Error, "Invalid unicode hex string provided");
	});

	it('should confirm multiple valid hex strings', function() {
		var result = set1.checkValidUnicodeHex('4927', '6d20', '6b69', '6c6c');
        expect(result).to.equal(true);
    });
	
	it('should reject the third hex', function() {
        expect(function() { set1.checkValidUnicodeHex('0000', 'aaaa', 'asdf'); }).to.throw(Error, "Invalid unicode hex string provided");
	});
	
	it('should reject a hex with an odd number of bytes', function() {
        expect(function() { set1.checkValidUnicodeHex('0000', 'aaa', '1111'); }).to.throw(Error, "Invalid unicode hex string provided");
    });
});

describe('#toHexValueArray', function() {
	it('should return hex value array', function() {
		var result = set1.toHexValueArray('ab209');
        assert.deepEqual(result, [10, 11, 2, 0, 9]);
    });
	
	it('should throw error for invalid hex string', function() {
		expect(function() { set1.toHexValueArray('QWER'); }).to.throw(Error, "Invalid hex string provided");
	});
});

describe('#hexToBase64', function() {
	it('should return base64 value of hex', function() {
		var result = set1.hexToBase64('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');
        expect(result).to.equal("SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t");
    });
	
	it('should return base64 value with padding length of 2', function() {
		var result = set1.hexToBase64('aaaa');
		expect(result).to.equal("qqo==");
    });
	
	it('should return base64 value with padding length of 1', function() {
		var result = set1.hexToBase64('aaaa0');
		expect(result).to.equal("qqoA=");
    });
	
	it('should return base64 value with no padding', function() {
		var result = set1.hexToBase64('aaaa00');
		expect(result).to.equal("qqoA");
    });
	
	it('should throw error for invalid hex string', function() {
		expect(function() { set1.hexToBase64('POI') }).to.throw(Error, "Invalid hex string provided");
	});
});

describe('#getFixedXOR', function() {
	it('should return XOR result for strings of equal length', function() {
		var result = set1.getFixedXOR('1c0111001f010100061a024b53535009181c', '686974207468652062756c6c277320657965');
        expect(result).to.equal("746865206b696420646f6e277420706c6179");
    });
	
	it('should throw error for non matching string lengths', function() {
		expect(function() { set1.getFixedXOR('1c0111001f010100061a024b53535009181c', '686974207468652062756c6c27732065796'); }).to.throw(Error, "Input strings are not the same length");
    });
	
	it('should throw error for invalid first hex string', function() {
		expect(function() { set1.getFixedXOR('1c0111001f010100061a024b53535009181A', '686974207468652062756c6c277320657965'); }).to.throw(Error, "Invalid hex string provided");
    });
	
	it('should throw error for invalid second hex string', function() {
		expect(function() { set1.getFixedXOR('1c0111001f010100061a024b53535009181c', '686974207468652062756c6c27732065796Z'); }).to.throw(Error, "Invalid hex string provided");
    });
});

describe('#hexToChar', function() {
	it('should return the unicode character conversion of a valid hex string', function() {
		var result = set1.hexToChar('436f6f6b696e67204d432773206c696b65206120706f756e64206f66206261636f6e');
        expect(result).to.equal("Cooking MC's like a pound of bacon");
	});
	
	it('should throw error for hex string with odd bytes', function() {
		expect(function() { set1.hexToChar('36f6f6b696e67204d432773206c696b65206120706f756e64206f66206261636f6e') }).to.throw(Error, "Invalid unicode hex string provided");
	});

	it('should throw error for hex string with invalid characters', function() {
		expect(function() { set1.hexToChar('436z6f6b696e67204d432773206c696b65206120706f756e64206f66206261636f6e') }).to.throw(Error, "Invalid unicode hex string provided");
	});
});

describe('#getCipherMask', function() {
	it('should return a cipher mask of equal length based on character provided', function() {
		var result = set1.getCipherMask('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', ['X'.charCodeAt(0)]);
        expect(result).to.equal('58585858585858585858585858585858585858585858585858585858585858585858');
	});

	it('should throw an error for hex string with odd bytes', function() {
		expect(function() { set1.getCipherMask('b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', ['X'.charCodeAt(0)]); }).to.throw(Error, "Invalid unicode hex string provided");
	});

	it('should throw an error for hex string with invalid characters', function() {
		expect(function() { set1.getCipherMask('1z37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', ['X'.charCodeAt(0)]); }).to.throw(Error, "Invalid unicode hex string provided");
	});
	
	it('should throw an error for non-numeric character code', function() {
		expect(function() { set1.getCipherMask('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', ['X']); }).to.throw(Error, "Invalid character code provided");
	});

	it('should throw an error for a negative character code', function() {
		expect(function() { set1.getCipherMask('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', [-1]); }).to.throw(Error, "Invalid character code provided");
	});

	it('should throw an error for character code greater than 255', function() {
		expect(function() { set1.getCipherMask('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', [300]); }).to.throw(Error, "Invalid character code provided");
	});
});

describe('#getCipher', function() {
	it('should return ciphered text based on hex input', function() {
		var result = set1.getCipher('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', '58585858585858585858585858585858585858585858585858585858585858585858');
        expect(result).to.equal("Cooking MC's like a pound of bacon");
	});
	
	it('should throw an error for hex string with odd bytes', function() {
		expect(function() { set1.getCipher('b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', '58585858585858585858585858585858585858585858585858585858585858585858'); }).to.throw(Error, "Invalid unicode hex string provided");
	});

	it('should throw an error for hex string with invalid characters', function() {
		expect(function() { set1.getCipher('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393z3736', '58585858585858585858585858585858585858585858585858585858585858585858'); }).to.throw(Error, "Invalid unicode hex string provided");
	});

	it('should throw an error for a hex mask with odd bytes', function() {
		expect(function() { set1.getCipher('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', '5858585858585858585858585858585858585858585858585858585858585858585'); }).to.throw(Error, "Invalid unicode hex string provided");
	});

	it('should throw an error for a hex mask with invalid characters', function() {
		expect(function() { set1.getCipher('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', '5858585858585858585858585858585858585858585858585858585858585858585z'); }).to.throw(Error, "Invalid unicode hex string provided");
	});
});


describe('#getCipherArray', function() {
	it('should return an array of all potential ciphers', function() {
		var hexString = '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736';
		var result = set1.getCipherArray(hexString);
		
		expect(result.length).to.equal(256);

		for(var i=0; i<result.length; i++) {
			expect(result[i]).to.equal(set1.getCipher(hexString, set1.getCipherMask(hexString, [i])));
		}
    });
});

describe('#getChiSquaredScoreForEnglish', function() {
	it('should return a score for a plaintext string', function() {
		var result = set1.getChiSquaredScoreForEnglish('This is a test');
        expect(result).to.equal(21.616859662144673);
	});
	
	it('should not return a number if non-alphanumeric, printable characters are use', function() {
		var result = set1.getChiSquaredScoreForEnglish('-----');
        expect(result).to.be.NaN;
	});

	it('should return infinity if non printable characters are used', function() {
		var result = set1.getChiSquaredScoreForEnglish('äÈÈÌÎÉÀêäÔËÎÌÂÆ×ÈÒÉÃÈÁÅÆÄ');
        expect(result).to.equal(Infinity);
	});
});

describe('#getChiSquaredScoreForCiphers', function() {
	it('should return a chi-squared score report on all ciphers for a given hex string', function() {
		var result = set1.getChiSquaredScoreForCiphers('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736');
		expect(result).to.be.an('object');
		
		expect(result['mostProbableKey']).to.equal('X');
		expect(result['results']).to.be.an('object');

		for(var character in result['results']) {
			expect(result['results'][character]).to.be.an('object');
			expect(result['results'][character]['score']).to.equal(set1.getChiSquaredScoreForEnglish(result['results'][character]['text']));
		}
    });
});

describe('#loadDictionary', function() {
	it('should return the default dictionary object', function() {
		var result = set1.loadDictionary("data/dictionary.txt");
		expect(result).to.be.an('object');
		
		expect(Object.keys(result).length).to.equal(45304);
	});
	
	it('should throw an error for a non-existing dictionary file', function() {
		expect(function() { set1.loadDictionary("data/no-dictionary.txt"); }).to.throw(Error, "no such file or directory");
    });
});

describe('#isInDictionary', function() {
	it('should return true on matched results and false if otherwise', function() {
		var dictionary = set1.loadDictionary("data/dictionary.txt");
		expect(set1.isInDictionary(dictionary, "technical")).to.equal(true);
		expect(set1.isInDictionary(dictionary, "preposterous")).to.equal(true);
		expect(set1.isInDictionary(dictionary, "lucid")).to.equal(true);

		expect(set1.isInDictionary(dictionary, "zygote")).to.equal(false);
		expect(set1.isInDictionary(dictionary, "regurgitate")).to.equal(false);
		expect(set1.isInDictionary(dictionary, "wingnut")).to.equal(false);
	});
	
	it('should throw an error for a null dictionary', function() {
		expect(function() { set1.isInDictionary(null, "word"); }).to.throw(Error, "Dictionary is not valid");
	});
	
	it('should throw an error for an invalid dictionary', function() {
		expect(function() { set1.isInDictionary("", "word"); }).to.throw(Error, "Dictionary is not valid");
	});
	
	it('should throw an error for an empty dictionary', function() {
		expect(function() { set1.isInDictionary({}, "word"); }).to.throw(Error, "Dictionary is not valid");
    });
});


describe('#hasRecognizableWords', function() {
	it('should return true on matched results and false if otherwise', function() {
		var dictionary = set1.loadDictionary("data/dictionary.txt");
		expect(set1.hasRecognizableWords(dictionary, "this is a test")).to.equal(true);
		expect(set1.hasRecognizableWords(dictionary, "to see if this will check")).to.equal(true);
		expect(set1.hasRecognizableWords(dictionary, "sentences with real words")).to.equal(true);

		expect(set1.hasRecognizableWords(dictionary, "etaoin shrdlu")).to.equal(false);
		expect(set1.hasRecognizableWords(dictionary, "hocus pocus")).to.equal(false);
		expect(set1.hasRecognizableWords(dictionary, "e pluribus unim")).to.equal(false);
	});
});

describe('#applyRepeatingKeyXOR', function() {
	it('should apply a repeating XOR to a given text', function() {
		var result = set1.applyRepeatingKeyXOR("Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal", "ICE");
		expect(result).to.equal('0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f');
	});
});
