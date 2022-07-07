var tools = require('./tools');
const myArgs = process.argv.slice(2);
//const hostContact = myArgs[0];
//const rewardContract = myArgs[1];

async function doit() {
	try {
		await tools.verifyGameAddons();
	} catch (e) {
		console.log("verifications failed: ", e);
	}

}

doit();
