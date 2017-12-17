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
	
	it('should confirm long hex', function() {
		var base64message = require('fs').readFileSync('data/6.txt', 'utf-8').replace(/(\r\n|\n|\r)/gm, "");
		var message = set1.base64ToHex(base64message);
		var result = set1.isValidHex(message);

		expect(result).to.equal(true);
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
	
	it('should confirm long hex', function() {
		var base64message = require('fs').readFileSync('data/6.txt', 'utf-8').replace(/(\r\n|\n|\r)/gm, "");
		var message = set1.base64ToHex(base64message);
		var result = set1.checkValidHex(message);

		expect(result).to.equal(true);
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
	
	it('should confirm long hex', function() {
		var base64message = require('fs').readFileSync('data/6.txt', 'utf-8').replace(/(\r\n|\n|\r)/gm, "");
		var message = set1.base64ToHex(base64message);
		var result = set1.checkValidUnicodeHex(message);

		expect(result).to.equal(true);
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

describe('#getEnglishClosenessScore', function() {
	it('should return a score for a plaintext string', function() {
		var result = set1.getEnglishClosenessScore('This is a test');
        expect(result).to.equal(0.6916251115245492);
	});
	
	it('should not return a number if non-alphanumeric, printable characters are use', function() {
		var result = set1.getEnglishClosenessScore('-----');
        expect(result).to.equal(Infinity);
	});

	it('should return infinity if non printable characters are used', function() {
		var result = set1.getEnglishClosenessScore('äÈÈÌÎÉÀêäÔËÎÌÂÆ×ÈÒÉÃÈÁÅÆÄ');
        expect(result).to.equal(Infinity);
	});
});

describe('#getSuggestedKeyForCipheredBlock', function() {
	it('should return ciphered text based on hex input', function() {
		var result = set1.getSuggestedKeyForCipheredBlock('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736');
		expect(result).to.equal('X'.charCodeAt(0));
	});
});

describe('#detectEncryptedString', function() {
	it('should detect an encrypted string in a file along with its key', function() {
		var result = set1.detectEncryptedString('data/4.txt');
		expect(result['mostProbableLine']).to.equal('1701');
		expect(result["results"][result['mostProbableLine']]["lineText"]).to.equal('7b5a4215415d544115415d5015455447414c155c46155f4058455c5b523f');
		expect(result["results"][result['mostProbableLine']]["mostProbableKey"]).to.equal('5');
	});
})

describe('#applyRepeatingKeyXOR', function() {
	it('should apply a repeating XOR to a given text', function() {
		var result = set1.applyRepeatingKeyXOR("Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal", "ICE");
		expect(result).to.equal('0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f');
	});
});

describe('#getHammingDistance', function() {
	it('should get the hamming distance between two strings', function() {
		var result = set1.getHammingDistance("this is a test", "wokka wokka!!!");
		expect(result).to.equal(37);
	});
});

describe('#breakRepeatingKeyXOR', function() {
	it('should return the most likely key size, cipher text, and message for a given base64 encoded hex file', function() {
		var result = set1.breakRepeatingKeyXOR('data/6.txt');

		expect(result).to.be.an('array');
		expect(result[0]).to.be.an('object');

		expect(result[0]['keysize']).to.equal(29);
		expect(result[0]['suggestedKey']).to.equal("Terminator X: Bring the noise");
		expect(result[0]['decryptedMessage']).to.equal("I'm back and I'm ringin' the bell \nA rockin' on the mike while the fly girls yell \nIn ecstasy in the back of me \nWell that's my DJ Deshay cuttin' all them Z's \nHittin' hard and the girlies goin' crazy \nVanilla's on the mike, man I'm not lazy. \n\nI'm lettin' my drug kick in \nIt controls my mouth and I begin \nTo just let it flow, let my concepts go \nMy posse's to the side yellin', Go Vanilla Go! \n\nSmooth 'cause that's the way I will be \nAnd if you don't give a damn, then \nWhy you starin' at me \nSo get off 'cause I control the stage \nThere's no dissin' allowed \nI'm in my own phase \nThe girlies sa y they love me and that is ok \nAnd I can dance better than any kid n' play \n\nStage 2 -- Yea the one ya' wanna listen to \nIt's off my head so let the beat play through \nSo I can funk it up and make it sound good \n1-2-3 Yo -- Knock on some wood \nFor good luck, I like my rhymes atrocious \nSupercalafragilisticexpialidocious \nI'm an effect and that you can bet \nI can take a fly girl and make her wet. \n\nI'm like Samson -- Samson to Delilah \nThere's no denyin', You can try to hang \nBut you'll keep tryin' to get my style \nOver and over, practice makes perfect \nBut not if you're a loafer. \n\nYou'll get nowhere, no place, no time, no girls \nSoon -- Oh my God, homebody, you probably eat \nSpaghetti with a spoon! Come on and say it! \n\nVIP. Vanilla Ice yep, yep, I'm comin' hard like a rhino \nIntoxicating so you stagger like a wino \nSo punks stop trying and girl stop cryin' \nVanilla Ice is sellin' and you people are buyin' \n'Cause why the freaks are jockin' like Crazy Glue \nMovin' and groovin' trying to sing along \nAll through the ghetto groovin' this here song \nNow you're amazed by the VIP posse. \n\nSteppin' so hard like a German Nazi \nStartled by the bases hittin' ground \nThere's no trippin' on mine, I'm just gettin' down \nSparkamatic, I'm hangin' tight like a fanatic \nYou trapped me once and I thought that \nYou might have it \nSo step down and lend me your ear \n'89 in my time! You, '90 is my year. \n\nYou're weakenin' fast, YO! and I can tell it \nYour body's gettin' hot, so, so I can smell it \nSo don't be mad and don't be sad \n'Cause the lyrics belong to ICE, You can call me Dad \nYou're pitchin' a fit, so step back and endure \nLet the witch doctor, Ice, do the dance to cure \nSo come up close and don't be square \nYou wanna battle me -- Anytime, anywhere \n\nYou thought that I was weak, Boy, you're dead wrong \nSo come on, everybody and sing this song \n\nSay -- Play that funky music Say, go white boy, go white boy go \nplay that funky music Go white boy, go white boy, go \nLay down and boogie and play that funky music till you die. \n\nPlay that funky music Come on, Come on, let me hear \nPlay that funky music white boy you say it, say it \nPlay that funky music A little louder now \nPlay that funky music, white boy Come on, Come on, Come on \nPlay that funky music \n");
	});
});

describe('#getRepeatingKeyXORAnalysis', function() {
	it('should get the hamming distance between two strings', function() {
		var base64message = require('fs').readFileSync('data/6.txt', 'utf-8').replace(/(\r\n|\n|\r)/gm, "");
		var message = set1.base64ToHex(base64message);

		var result = set1.getRepeatingKeyXORAnalysis(message, 29);
		
		expect(result).to.be.an('object');
		expect(result['suggestedKey']).to.equal("Terminator X: Bring the noise");
		expect(result['decryptedMessage']).to.equal("I'm back and I'm ringin' the bell \nA rockin' on the mike while the fly girls yell \nIn ecstasy in the back of me \nWell that's my DJ Deshay cuttin' all them Z's \nHittin' hard and the girlies goin' crazy \nVanilla's on the mike, man I'm not lazy. \n\nI'm lettin' my drug kick in \nIt controls my mouth and I begin \nTo just let it flow, let my concepts go \nMy posse's to the side yellin', Go Vanilla Go! \n\nSmooth 'cause that's the way I will be \nAnd if you don't give a damn, then \nWhy you starin' at me \nSo get off 'cause I control the stage \nThere's no dissin' allowed \nI'm in my own phase \nThe girlies sa y they love me and that is ok \nAnd I can dance better than any kid n' play \n\nStage 2 -- Yea the one ya' wanna listen to \nIt's off my head so let the beat play through \nSo I can funk it up and make it sound good \n1-2-3 Yo -- Knock on some wood \nFor good luck, I like my rhymes atrocious \nSupercalafragilisticexpialidocious \nI'm an effect and that you can bet \nI can take a fly girl and make her wet. \n\nI'm like Samson -- Samson to Delilah \nThere's no denyin', You can try to hang \nBut you'll keep tryin' to get my style \nOver and over, practice makes perfect \nBut not if you're a loafer. \n\nYou'll get nowhere, no place, no time, no girls \nSoon -- Oh my God, homebody, you probably eat \nSpaghetti with a spoon! Come on and say it! \n\nVIP. Vanilla Ice yep, yep, I'm comin' hard like a rhino \nIntoxicating so you stagger like a wino \nSo punks stop trying and girl stop cryin' \nVanilla Ice is sellin' and you people are buyin' \n'Cause why the freaks are jockin' like Crazy Glue \nMovin' and groovin' trying to sing along \nAll through the ghetto groovin' this here song \nNow you're amazed by the VIP posse. \n\nSteppin' so hard like a German Nazi \nStartled by the bases hittin' ground \nThere's no trippin' on mine, I'm just gettin' down \nSparkamatic, I'm hangin' tight like a fanatic \nYou trapped me once and I thought that \nYou might have it \nSo step down and lend me your ear \n'89 in my time! You, '90 is my year. \n\nYou're weakenin' fast, YO! and I can tell it \nYour body's gettin' hot, so, so I can smell it \nSo don't be mad and don't be sad \n'Cause the lyrics belong to ICE, You can call me Dad \nYou're pitchin' a fit, so step back and endure \nLet the witch doctor, Ice, do the dance to cure \nSo come up close and don't be square \nYou wanna battle me -- Anytime, anywhere \n\nYou thought that I was weak, Boy, you're dead wrong \nSo come on, everybody and sing this song \n\nSay -- Play that funky music Say, go white boy, go white boy go \nplay that funky music Go white boy, go white boy, go \nLay down and boogie and play that funky music till you die. \n\nPlay that funky music Come on, Come on, let me hear \nPlay that funky music white boy you say it, say it \nPlay that funky music A little louder now \nPlay that funky music, white boy Come on, Come on, Come on \nPlay that funky music \n");
	});
});

describe('#getAverageDistanceScoreForBlock', function() {
	it('should get the hamming distance between two strings', function() {
		var result = set1.getAverageDistanceScoreForBlock("7468697320697320612074657374776f6b6b6120776f6b6b61212121", 14);
		expect(result).to.equal(37/14);
	});
});

describe('#base64ToHex', function() {
	it('should return hex string for base64 value', function() {
		var result = set1.base64ToHex("SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t");
        expect(result).to.equal('49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d');
    });
	
	it('should return hex string for base64 value with padding length of 2', function() {
		var result = set1.base64ToHex("qqo==");
		expect(result).to.equal('aaaa');
    });
	
	it('should return hex string for base64 value with padding length of 1', function() {
		var result = set1.base64ToHex("qqoA=");
		expect(result).to.equal('aaaa0');
    });
	
	it('should return hex string for base64 value with no padding', function() {
		var result = set1.base64ToHex("qqoA");
		expect(result).to.equal('aaaa00');
    });
	
	it('should throw error for invalid base64 string', function() {
		expect(function() { set1.base64ToHex(';;;') }).to.throw(Error, "Invalid base64 string provided");
	});
});
