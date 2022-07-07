var tools = require('./tools');
const myArgs = process.argv.slice(2);
const marketContract = myArgs[0];
const offeringid = myArgs[1];

async function doit() {
	const result = await tools.viewOfferingNFT(marketContract, offeringid);
	console.log(result);
}

doit();
