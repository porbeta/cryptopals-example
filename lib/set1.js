(function() {
  var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  base64ValueMap = {
	  'A': 0x00, 'B': 0x01, 'C': 0x02, 'D': 0x03, 'E': 0x04, 'F': 0x05, 'G': 0x06, 'H': 0x07,
	  'I': 0x08, 'J': 0x09, 'K': 0x0A, 'L': 0x0B, 'M': 0x0C, 'N': 0x0D, 'O': 0x0E, 'P': 0x0F,
	  'Q': 0x10, 'R': 0x11, 'S': 0x12, 'T': 0x13, 'U': 0x14, 'V': 0x15, 'W': 0x16, 'X': 0x17,
	  'Y': 0x18, 'Z': 0x19, 'a': 0x1A, 'b': 0x1B, 'c': 0x1C, 'd': 0x1D, 'e': 0x1E, 'f': 0x1F,
	  'g': 0x20, 'h': 0x21, 'i': 0x22, 'j': 0x23, 'k': 0x24, 'l': 0x25, 'm': 0x26, 'n': 0x27,
	  'o': 0x28, 'p': 0x29, 'q': 0x2A, 'r': 0x2B, 's': 0x2C, 't': 0x2D, 'u': 0x2E, 'v': 0x2F,
	  'w': 0x30, 'x': 0x31, 'y': 0x32, 'z': 0x33, '0': 0x34, '1': 0x35, '2': 0x36, '3': 0x37,
	  '4': 0x38, '5': 0x39, '6': 0x3A, '7': 0x3B, '8': 0x3C, '9': 0x3D, '+': 0x3E, '/': 0x3F
  },
  hexMap = '0123456789abcdef',
  hexValueMap = { 
	  '0':0x0, '1':0x1, '2':0x2, '3':0x3, '4':0x4, '5':0x5, '6':0x6, '7':0x7, 
	  '8':0x8, '9':0x9, 'a':0xA, 'b':0xB, 'c':0xC, 'd':0xD, 'e':0xE, 'f':0xF
  },
  english_freq = [
    0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015,  // A-G
    0.06094, 0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749,  // H-N
    0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758,  // O-U
    0.00978, 0.02360, 0.00150, 0.01974, 0.00074, 0.19181            // V-Z, space character
  ],
  
  set1 = {
	// Checks if a string conforms to a valid hex format (lower case letters only) 
	isValidHex: function(hexString) {
		var hexRegex = new RegExp('^[a-f0-9]+$');
		return hexRegex.test(hexString);
	},

	// Throws an Error if an argument is not a valid hex string
	checkValidHex: function() {
		for (var i = 0; i < arguments.length; i++) {
			if(!this.isValidHex(arguments[i])) {
				throw new Error ("Invalid hex string provided: " + arguments[i]);
			}
		}

		return true;
	},

	// Throws an Error if an argument is not a valid hex string to be converted to plaintext
	checkValidUnicodeHex: function() {
		for (var i = 0; i < arguments.length; i++) {
			if(!this.isValidHex(arguments[i]) || arguments[i].length % 2 != 0) {
				throw new Error ("Invalid unicode hex string provided (length: " + arguments[i].length + "): " + arguments[i]);
			}
		}

		return true;
	},
	
	// Converts a hex string to an array of hex values
	toHexValueArray: function(hexString) {
		var hexValueArray = [];
	
		this.checkValidHex(hexString);

		for(var i=0; i<hexString.length; i++) {
			hexValueArray.push(hexValueMap[hexString.charAt(i)]);
		}
		
		return hexValueArray;
	},
	
	// Converts a hex string to a base64 string
	hexToBase64: function(hexString) {
		this.checkValidHex(hexString);
		
		var base64 = [];
		var hexValueArray = this.toHexValueArray(hexString);
		
		for(var i=0; i < hexValueArray.length; i += 3) {
			var base64FirstHalf = 0;
			var base64SecondHalf = 0;
			var paddingCount = 0;
			
			for(var j=0; j < 3; j++) {
				if(i + j < hexValueArray.length) {
					if(j == 0) {
						base64FirstHalf += hexValueArray[i + j] << 2;
					}
					else if(j == 1) {
						base64FirstHalf += hexValueArray[i + j] >> 2;
						base64SecondHalf += (hexValueArray[i + j] % 4) << 4;
					}
					else if(j == 2) {
						base64SecondHalf += hexValueArray[i + j];
					}
				}
				else {
					paddingCount++;
				}
			}
			
			base64.push(base64map.charAt(base64FirstHalf));
			
			if(paddingCount < 2) {
				base64.push(base64map.charAt(base64SecondHalf));
			}
			
			for(var k=0; k < paddingCount; k++) {
				base64.push("=");
			}
		}
		
		return base64.join('');
	},
	
	// applies an XOR operation between hex strings of equal length
	getFixedXOR: function(aStr, bStr) {
		if(aStr.length != bStr.length) {
			throw new Error("Input strings are not the same length: " + aStr.length + " <> " + bStr.length);
		}

		this.checkValidHex(aStr, bStr);

		var ret = [];
		var aHexValues = this.toHexValueArray(aStr);
		var bHexValues = this.toHexValueArray(bStr);
		
		for(var i=0; i<aHexValues.length; i++) {
			ret.push(hexMap.charAt(aHexValues[i] ^ bHexValues[i]));
		}
		
		return ret.join('');
	},

	// Converts a valid hex string to plaintext
	hexToChar: function(hexString) {
		this.checkValidUnicodeHex(hexString);

		var chars = [];
		for(var i=0; i<hexString.length; i += 2) {
			var unicode = (hexValueMap[hexString.charAt(i)] << 4) + hexValueMap[hexString.charAt(i+1)];
			chars.push(String.fromCharCode(unicode));   
		}

		return chars.join('');
	},

	// Creates a cipher mask for a given hex string using a key of a specified character code
	getCipherMask: function(hexString, charCodes) {
		this.checkValidUnicodeHex(hexString);

		for(var index in charCodes) {
			if(!Number.isInteger(charCodes[index]) || charCodes[index] < 0 || charCodes[index] > 255) {
				throw new Error("Invalid character code provided: " + charCodes[index]);
			}
		}

		var mask = [];
		var counter = 0;
		for(var j=0; j < hexString.length; j += 2) {
			var charCodeIndex = counter % charCodes.length;
			counter++;

			mask.push(hexMap.charAt(charCodes[charCodeIndex] >> 4));
			mask.push(hexMap.charAt(charCodes[charCodeIndex] % 16));
		}

		return mask.join('');
	},

	// Returns the plaintext representation of a hex string XOR'd against a cipher mask of the same length
	getCipher: function(hexString, mask) {
		this.checkValidUnicodeHex(hexString, mask);

		return this.hexToChar(this.getFixedXOR(hexString, mask));
	},
	
	// Returns a closeness score for a given plaintext string based on the frequencies of characters in English
	getEnglishClosenessScore: function(str) {
		var count = [], ignored = 0;
		for (var i = 0; i <= 26; i++) count[i] = 0;
	
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			if (c >= 65 && c <= 90) count[c - 65]++;        // uppercase A-Z
			else if (c >= 97 && c <= 122) count[c - 97]++;  // lowercase a-z
			else if (c == 32) count[26]++;  // space character
			else if (c >= 32 && c <= 126) ignored++;        // numbers and punct.
			else if (c == 9 || c == 10 || c == 13) ignored++;  // TAB, CR, LF
			else return Infinity;  // not printable ASCII = impossible(?)
		}

		var score = 0;
		for(var index in count) {
			score += count[index] * english_freq[index];
		}
		
		return 1 / score;
	},
	
	// Returns the most likely key for a given cipher block
	getSuggestedKeyForCipheredBlock: function(block, blockIndex) {
		var maxCount = Infinity;
		var maxIndex = 0;

		for(var i=0; i<256; i++) {
			var cipher = this.getCipher(block, this.getCipherMask(block, [i]));
			var count = this.getEnglishClosenessScore(cipher);

			if(count < maxCount) {
				maxCount = count;
				maxIndex = i;
			}
		}

		return maxIndex;
	},

	// Returns a report of scores for the most likely string that has been encrypted in a file
	detectEncryptedString: function(filename) {
		var ret = {};
		var results = {};
		var mostProbableLine = 0;
		var minScore = Infinity;

		var lines = require('fs').readFileSync(filename, 'utf-8').split('\n').filter(Boolean);
		
		for(var index in lines) {
			var line = lines[index].replace(/(\r\n|\n|\r)/gm, "");
			var result = {};

			result["mostProbableKey"] = String.fromCharCode(this.getSuggestedKeyForCipheredBlock(line));
			result["lineText"] = line;
			result["decipheredText"] = this.getCipher(line, this.getCipherMask(line, [this.getSuggestedKeyForCipheredBlock(line)]));
			result["score"] = this.getEnglishClosenessScore(result["decipheredText"]);			

			var lineNum = index + 1;
			results[lineNum] = result;

			if(result["score"] < minScore) {
				mostProbableLine = lineNum;
				minScore = result["score"];
			}
		}

		ret["mostProbableLine"] = mostProbableLine;
		ret["results"] = results;

		return ret;
	},

	// Applies a repeating XOR of value key to a plaintext string
	applyRepeatingKeyXOR: function(text, key) {
		var hexStringArray = [];
		var charCodes = [];

		for(var i=0; i < text.length; i++) {
			hexStringArray.push(hexMap.charAt(text.charCodeAt(i) >> 4));
			hexStringArray.push(hexMap.charAt(text.charCodeAt(i) % 16));
		}

		var hexString = hexStringArray.join('');
		
		for(var j=0; j < key.length; j++) {
			charCodes.push(key.charCodeAt(j));
		}

		return this.getFixedXOR(hexString, this.getCipherMask(hexString, charCodes));
	},

	// Returns the number of differing bits between two strings
	getHammingDistance: function(aStr, bStr) {
		var distance = 0;
		var longerLength = (aStr.length > bStr.length) ? aStr.length : bStr.length;

		for(var i=0; i<longerLength; i++) {
			if(i >= aStr.length || i >= bStr.length) {
				distance += 8;
			}
			else {
				var aCharCode = aStr.charCodeAt(i);
				var bCharCode = bStr.charCodeAt(i);

				for(var j=0; j<8; j++) {
					var aLastBit = aCharCode % 2;
					var bLastBit = bCharCode % 2;

					if(aLastBit != bLastBit) {
						distance++;
					}

					aCharCode = aCharCode >> 1;
					bCharCode = bCharCode >> 1;
				}
			}
		}

		return distance;
	},

	// Break the repeating key XOR for a given encrypted file
	breakRepeatingKeyXOR: function(filename) {
		var base64message = require('fs').readFileSync(filename, 'utf-8').replace(/(\r\n|\n|\r)/gm, "");
		var message = this.base64ToHex(base64message);

		var possibilities = [];
		var ret = [];

		var firstPossibility = { score: Infinity };
		var secondPossibility = { score: Infinity };
		var thirdPossibility = { score: Infinity };

		for(var i=2; i<=40; i++) {
			var distanceScore = this.getAverageDistanceScoreForBlock(message, i);

			if(distanceScore <= firstPossibility["score"]) {
				thirdPossibility = secondPossibility;
				secondPossibility = firstPossibility;
				firstPossibility = { keysize: i, score: distanceScore };
			}
			else if(distanceScore <= secondPossibility["score"]) {
				thirdPossibility = secondPossibility;
				secondPossibility = { keysize: i, score: distanceScore };
			}
			else if(distanceScore <= thirdPossibility["score"]) {
				thirdPossibility = { keysize: i, score: distanceScore };
			}
		}

		possibilities.push(firstPossibility);
		possibilities.push(secondPossibility);
		possibilities.push(thirdPossibility);

		for(var index in possibilities) {
			var possibility = possibilities[index];
			var analysis = this.getRepeatingKeyXORAnalysis(message, possibility['keysize']);
			possibility['suggestedKey'] = analysis['suggestedKey'];
			possibility['decryptedMessage'] = analysis['decryptedMessage'];

			ret.push(possibility);
		}

		return ret;
	},

	// Return the full suggested key and decrypted message based on a hex message split into a given keysize
	getRepeatingKeyXORAnalysis: function(message, keysize) {
		var ret = {};
		var blocks = [];

		for(var i=0; i<keysize; i++) {
			blocks[i] = [];
		}

		var byteCounter = 0;
		for(var j=0; j<message.length; j += 2) {
			var index = byteCounter % keysize;
			
			blocks[index].push(message.charAt(j));
			blocks[index].push(message.charAt(j + 1));

			byteCounter++;
		}

		var suggestedKeys = [];
		for(var blockIndex in blocks) {
			suggestedKeys.push(this.getSuggestedKeyForCipheredBlock(blocks[blockIndex].join(''), blockIndex));
		}

		var suggestedKeyString = [];
		for(var keyIndex in suggestedKeys) {
			suggestedKeyString.push(String.fromCharCode(suggestedKeys[keyIndex]));
		}

		ret['suggestedKey'] = suggestedKeyString.join('');
		ret['decryptedMessage'] = this.getCipher(message, this.getCipherMask(message, suggestedKeys));

		return ret;
	},

	// Returns the normalized Hamming distance averaged over, at most, the first four blocks
	getAverageDistanceScoreForBlock: function(message, numBytes) {
		var blockLength = numBytes * 2;
		var maxNumBlocks = message.length / blockLength;
		var numBlocksToObserve = (maxNumBlocks > 4) ? 4 : maxNumBlocks;

		var sumOfHammingDistances = 0;
		var totalLoops = 0;

		for(var j=0; j<numBlocksToObserve; j++) {
			for(var k=j+1; k<numBlocksToObserve; k++) {
				var aBlock = this.hexToChar(message.substring(j*blockLength,j*blockLength+blockLength));
				var bBlock = this.hexToChar(message.substring(k*blockLength,k*blockLength+blockLength));

				sumOfHammingDistances += this.getHammingDistance(aBlock, bBlock);
				totalLoops++;
			}
		}

		return (sumOfHammingDistances / totalLoops) / numBytes;
	},
	
	// Converts a base64 encoded string to hex
	base64ToHex: function(base64String) {
		var hexBytes = [];
		var carrier = 0;
		var append = true;

		for(var i=0; i<base64String.length; i++) {
			if(base64String.charAt(i) != "=" && typeof base64ValueMap[base64String.charAt(i)] == 'undefined') {
				throw new Error("Invalid base64 string provided (invalid character: " + base64String.charAt(i) + ")");
			}

			var base64Value = base64ValueMap[base64String.charAt(i)];

			if(i % 2 == 0) {
				if(append) {
					if(base64String.charAt(i) != "=") {
						hexBytes.push(hexMap.charAt(base64Value >> 2));
						carrier += (base64Value % 4) << 2;
					}
					else {
						hexBytes.pop();
					}
				}
			}
			else {
				if(base64String.charAt(i) != "=") {
					carrier += (base64Value >> 4);
					hexBytes.push(hexMap.charAt(carrier));
					hexBytes.push(hexMap.charAt(base64Value % 16));

					carrier = 0;
				}
				else {
					append = false;
				}
			}
		}
		
		return hexBytes.join('');
	},

	decryptAES128EBC: function(filename, key) {
		var base64message = require('fs').readFileSync(filename, 'utf-8').replace(/(\r\n|\n|\r)/gm, "");
		var decipher = require('crypto').createDecipheriv('aes-128-ecb', key, "");
		
		var ret = decipher.update(base64message, 'base64', 'utf8');
		ret += decipher.final('utf8');
		
		return ret;
	}
  };

  module.exports = set1;
})();
