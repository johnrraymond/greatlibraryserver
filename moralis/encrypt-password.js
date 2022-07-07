const tools = require('./tools');
const fs = require('fs');
const https = require('https');

const readline = require('readline');

const myArgs = process.argv.slice(2);
const text = myArgs[0];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
	rl.output.write("\x1B[2K\x1B[200D"+"["+((rl.line.length%2==1)?"=-":"-=")+"]");
};

rl.question('pass: ', (passPhrase) => {
	runServer(passPhrase);
});

// vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3  <-- example passPhrase. All passPhrases must be this long.

function runServer(passPhrase) {

	const hash = tools.encrypt(passPhrase, text);

	console.log(hash);

	process.exit(0);
}

