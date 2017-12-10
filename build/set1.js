(function() {
  var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  hexMap = '0123456789abcdef',
  hexValueMap = { '0':0x0, '1':0x1, '2':0x2, '3':0x3, '4':0x4, '5':0x5, '6':0x6, '7':0x7, '8':0x8, '9':0x9, 'a':0xA, 'b':0xB, 'c':0xC, 'd':0xD, 'e':0xE, 'f':0xF },
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

	checkValidHex: function() {
		for (var i = 0; i < arguments.length; i++) {
			if(!this.isValidHex(arguments[i])) {
				throw new Error ("Invalid hex string provided: " + arguments[i]);
			}
		}

		return true;
	},

	checkValidUnicodeHex: function() {
		for (var i = 0; i < arguments.length; i++) {
			if(!this.isValidHex(arguments[i]) || arguments[i].length % 2 != 0) {
				throw new Error ("Invalid hex string provided: " + arguments[i]);
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

	hexToChar: function(hexString) {
		this.checkValidUnicodeHex(hexString);

		var chars = [];
		for(var i=0; i<hexString.length; i += 2) {
			var unicode = (hexValueMap[hexString.charAt(i)] << 4) + hexValueMap[hexString.charAt(i+1)];
			chars.push(String.fromCharCode(unicode));   
		}

		return chars.join('');
	},

	getCipherMask: function(str, charCode) {
		this.checkValidUnicodeHex(str);

		if(!Number.isInteger(charCode) || charCode < 0 || charCode > 255) {
			throw new Error("Invalid character code provided: " + charCode);
		}

		var mask = [];
		for(var j=0; j < str.length; j += 2) {
			mask.push(hexMap.charAt(charCode >> 4));
			mask.push(hexMap.charAt(charCode % 16));
		}

		return mask.join('');
	},

	getCipher: function(str, mask) {
		this.checkValidUnicodeHex(str, mask);

		return this.hexToChar(this.getFixedXOR(str, mask));
	},

	getCipherArray: function(hexString) {
		var ciphers = [];

		for(var i=0; i < 256; i++) {
			ciphers.push(this.getCipher(hexString, this.getCipherMask(hexString, i)));
		}

		return ciphers;
	},
	
	getChiSquaredScoreForEnglish: function(str) {
		var count = [], ignored = 0;
		for (var i = 0; i <= 26; i++) count[i] = 0;
	
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			if (c >= 65 && c <= 90) count[c - 65]++;        // uppercase A-Z
			else if (c >= 97 && c <= 122) count[c - 97]++;  // lowercase a-z
			else if (c == 72) count[26]++;  // space character
			else if (c >= 32 && c <= 126) ignored++;        // numbers and punct.
			else if (c == 9 || c == 10 || c == 13) ignored++;  // TAB, CR, LF
			else return Infinity;  // not printable ASCII = impossible(?)
		}
	
		var chiSquared = 0, len = str.length - ignored;
		for (var i = 0; i <= 26; i++) {
			var observed = count[i], expected = len * english_freq[i];
			var difference = observed - expected;
			chiSquared += difference*difference / expected;
		}

		return chiSquared;
	},
	
	getChiSquaredScoreForCiphers: function(hexString) {
		var cipherArray = this.getCipherArray(hexString);

		var ret = {};
		var results = {}
		var mostProbableKey = "";
		var minScore = Infinity;

		for(var character in cipherArray) {
			var chiSquared = this.getChiSquaredScoreForEnglish(cipherArray[character]);

			results[String.fromCharCode(character)] = { score: chiSquared, text: cipherArray[character] };

			if(chiSquared < minScore) {
				mostProbableKey = String.fromCharCode(character);
				minScore = chiSquared;
			}
		}

		ret["mostProbableKey"] = mostProbableKey;
		ret["results"] = results;

		return ret;
	}
  };

  module.exports = set1;
})();
