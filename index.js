(function() {
  var base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  hexMap = '0123456789abcdef',
  hexValueMap = { '0':0x0, '1':0x1, '2':0x2, '3':0x3, '4':0x4, '5':0x5, '6':0x6, '7':0x7, '8':0x8, '9':0x9, 'a':0xA, 'b':0xB, 'c':0xC, 'd':0xD, 'e':0xE, 'f':0xF },
  
  cryptopals = {
	// Checks if a string conforms to a valid hex format (lower cas 
	isValidHex: function(hexString) {
		var hexRegex = new RegExp('^[a-f0-9]+$');
		return hexRegex.test(hexString);
	},
	
	// Converts a hex string to an array of hex values
	toHexValueArray: function(hexString) {
		
		var hexValueArray = [];
	
		if(this.isValidHex(hexString)) {
			for(var i=0; i<hexString.length; i++) {
				hexValueArray.push(hexValueMap[hexString.charAt(i)]);
			}
		}
		else {
			throw new Error ("Invalid hex string provided");
		}
		
		return hexValueArray;
	},
	
	// Converts a hex string to a base64 string
	hexToBase64: function(hexString) {
		if(this.isValidHex(hexString)) {
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
		}
		else {
			throw new Error("Invalid hex string provided");
		}
	},
	
	getFixedXOR: function(aStr, bStr) {
		if(aStr.length == bStr.length) {
			if(this.isValidHex(aStr) && this.isValidHex(bStr)) {
				var ret = [];
				var aHexValues = this.toHexValueArray(aStr);
				var bHexValues = this.toHexValueArray(bStr);
				
				for(var i=0; i<aHexValues.length; i++) {
					ret.push(hexMap.charAt(aHexValues[i] ^ bHexValues[i]));
				}
				
				return ret.join('');
			}
			else{
				throw new Error("Invalid hex string provided");
			}
		}
		else {
			throw new Error("Input strings are not the same length: " + aStr.length + " <> " + bStr.length);
		}
	}
  };

  module.exports = cryptopals;
})();
