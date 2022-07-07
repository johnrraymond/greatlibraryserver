const tools = require('./tools');
const myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);


try {
    	// Read in argument one as json if possible
	filename = myArgs[0];
    	moralisEth = require(filename);
	getSigner(moralisEth.msg, moralsEth.signature);
} catch (e) {
    	console.log('Error: ', e);
}
const msg = myArgs[0];
const signature = myArgs[1];

async function getSigner(msg) {
    	sender = tools.web3.eth.accounts.recover(msg, signature);
    	console.log('sender: ', sender);
}

getSigner(msg, signature);
