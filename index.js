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
    var report = set1.getChiSquaredScoreForCiphers(hexString);
    var mostProbableKey = report['mostProbableKey'];

    console.log(mostProbableKey);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals mostprobablekey 6435bc');
    console.log('    $ cryptopals mpk 6435bc');
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
  .command('decipher <cipherCharacter> <hexString>')
  .description('convert a hex string to unicode characters')
  .action(function(cipherCharacter, hexString, options){
    if(!cipherCharacter.match("/^[A-Za-z0-9]+$/i")) {
      console.log(set1.getCipher(hexString, set1.getCipherMask(hexString, cipherCharacter.charCodeAt(0))));
    }
    else {
      console.log("Error: The cipherCharacter provided is not alphanumeric");
    }
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