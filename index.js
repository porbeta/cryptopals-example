#!/usr/bin/env node

var program = require('commander');
var set1 = require('./lib/set1');

program
  .version('1.1.0');

program
  .command('hextobase64 <hexString>')
  .alias('htb64')
  .description('convert a hex string to base64')
  .action(function(hexString, options){
	  console.log(set1.hexToBase64(hexString));
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals hextobase64 a1234f');
    console.log('    $ cryptopals htb64 6435bc');
    console.log();
  });  

program
  .command('getfixedxor <firstString> <secondString>')
  .alias('gfxor')
  .description('get the fixed XOR hex string between two hex strings')
  .action(function(firstString, secondString, options){
	  console.log(set1.getFixedXOR(firstString, secondString));
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals getfixedxor a1234f 6435bc');
    console.log('    $ cryptopals gfxor a1234f 6435bc');
    console.log();
  }); 

program
  .command('mostprobablekey <hexString>')
  .alias('mpk')
  .description('finds the most probable key for deciphering a hex string')
  .action(function(hexString, options){
    var result = set1.getSuggestedKeyForCipheredBlock(hexString);
    var mostProbableKey = String.fromCharCode(result);

    console.log(mostProbableKey);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals mostprobablekey 6435bc');
    console.log('    $ cryptopals mpk 6435bc');
    console.log();
  }); 

program
  .command('detectencrypted <fileName>')
  .alias('detenc')
  .description('detect the encrypted hex string in a file of hex strings')
  .action(function(hexString, options){
    var report = set1.detectEncryptedString(hexString);
    var index = report['mostProbableLine'];
    
    console.log(report["results"][index]["lineText"] + " (key:" + report["results"][index]["mostProbableKey"] + ")");
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals detectencrypted file.txt');
    console.log('    $ cryptopals de file.txt');
    console.log();
  });

program
  .command('applyrepeatxor <repeatingKey> <text>')
  .alias('arx')
  .description('apply a repeating key XOR to a plaintext message')
  .action(function(repeatingKey, text, options){
    console.log(set1.applyRepeatingKeyXOR(text, repeatingKey));
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals applyrepeatxor xyz 6435bc');
    console.log('    $ cryptopals arx xyz 6435bc');
    console.log();
  });

program
  .command('breakrepeatxor <fileName>')
  .alias('brx')
  .description('break the repeating key XOR for a given encrypted file')
  .action(function(fileName, options){
    var report = set1.breakRepeatingKeyXOR(fileName);

    console.log("most likely key size:");
    console.log("-------------------------");
    console.log(report[0]["keysize"]);
    console.log();
    console.log("suggested key:");
    console.log("-------------------------");
    console.log(report[0]["suggestedKey"]);
    console.log();
    console.log("decrypted message:");
    console.log("-------------------------");
    console.log(report[0]["decryptedMessage"]);
    console.log();
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals detectencrypted file.txt');
    console.log('    $ cryptopals de file.txt');
    console.log();
  });

program
  .command('aesecbdecrypt <fileName> <key>')
  .alias('aed')
  .description('decrypts a file using ')
  .action(function(fileName, key, options){
	  console.log(set1.decryptAES128EBC(fileName, key));
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals aesecbdecrypt file.txt "SAMPLE_KEY"');
    console.log('    $ cryptopals aed file.txt "SAMPLE_KEY"');
    console.log();
  });

program
  .command('hextochar <hexString>')
  .alias('htc')
  .description('convert a hex string to unicode characters')
  .action(function(hexString, options){
	  console.log(set1.hexToChar(hexString));
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals hextochar 6435bc');
    console.log('    $ cryptopals htc 6435bc');
    console.log();
  });

program
  .command('decipher <hexString> <cipherCharacter>')
  .description('convert a hex string to unicode characters')
  .action(function(hexString, cipherCharacter, options){
    var cipherArray = [];
    for(var i = 0; i < cipherCharacter.length; i++) {
      cipherArray.push(cipherCharacter.charCodeAt(i));
    }
    
    console.log(set1.getCipher(hexString, set1.getCipherMask(hexString, cipherArray)));
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals cipher x 6435bc');
    console.log();
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}