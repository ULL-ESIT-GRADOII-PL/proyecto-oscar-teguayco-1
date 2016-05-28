#!/home/ubuntu/.nvm/versions/node/v4.4.3/bin/node --harmony_destructuring
var util = require('util');
var fs = require('fs');
var PEG = require("./pl0.js");
var semantic = require("./semantic.js");
var fileName = process.argv[2] || 'input1.pl0';
fs.readFile(fileName, 'utf8', function (err,input) {
  if (err) {
    return console.log(err);
  }
  console.log(`Processing <***\n${input}\n***>`);
  try {
    //var parser = peg.generate("./pl0.pegjs");
    var r = PEG.parse(input);
    console.log(util.inspect(r, {depth: null}));
    semantic(r);
  } catch (e) {
    //console.log(`Error en línea ${e.location.start.line} columna ${e.location.start.column}`);
    console.log(e);
  }
});