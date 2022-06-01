var tools = require('./tools');
const myArgs = process.argv.slice(2);
const contractid = myArgs[0];
const tokenid = myArgs[1];
const tmpfile = myArgs[2];

async function doit() {
	console.log('Contractid: ' + contractid);

	try {
		const tokenOwner = await tools.getTokenOwner(contractid, tokenid);
		console.log('TokenOwner: ' + tokenOwner);
		tools.writeFile(tmpfile, tokenOwner);
	} catch (e) {
		console.log("Error getting token owner: ", e);
	}

}

doit();
