var tools = require('./tools');
const myArgs = process.argv.slice(2);
const contractfile = myArgs[0];
const newOwner = myArgs[1];

async function doit() {
	var contractid;

	try {
		// Read the file's string contents directly into the contractid
		contractid = await tools.readFile(contractfile);
	} catch (e) {
		console.log('Error reading contractid file: ' + e);
		return;
	}

	//await tools.setGasToken(contractid); // This happens in contract creation now.

	try {
		await tools.transferOwner(contractid, newOwner);
	} catch (e) {
		console.log('Error transferring contract owner: ' + e);
	}

}

doit();
