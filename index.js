#!/usr/bin/env node

var program = require('commander');
var set1 = require('./build/set1');

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
  .description('convert a hex string to base64')
  .action(function(firstString, secondString, options){
	  console.log(set1.getFixedXOR(firstString, secondString));
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cryptopals getfixedxor a1234f 6435bc');
    console.log('    $ cryptopals gfxor a1234f 6435bc');
    console.log();
  }); 
 
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}