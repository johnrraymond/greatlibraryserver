var tools = require('./tools');
const myArgs = process.argv.slice(2);
const contractid = myArgs[0];
const meme = myArgs[1];


async function doit() {

	try {
		await tools.registerMemeWithTx(contractid, meme);
	} catch (e) {
		console.log(JSON.stringify(e));
	}

}

doit();
