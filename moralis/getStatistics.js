var tools = require('./tools');
const myArgs = process.argv.slice(2);
const contractfile = myArgs[0];

async function doit() {
	var contractid;

	try {
		// Read the file's string contents directly into the contractid
		contractid = await tools.readFile(contractfile);
	} catch (e) {
		console.log('Error reading contractid file: ' + e);
		return;
	}
	console.log('Contractid: ' + contractid);

	const royalty = await tools.getRoyalty(contractid);
	console.log('Royalty: ' + royalty);

	const defaultFrom = await tools.getDefaultFrom(contractid);
	console.log('Default Mints From: ' + defaultFrom);

	const defaultPrice = await tools.getDefaultPrice(contractid);
	console.log('Default Price: ' + defaultPrice);

	const token = await tools.getGasToken(contractid);
	console.log("Gas Token: " + token);

	const totalSupply = await tools.getTotalSupply(contractid);
	console.log("Total Supply: " + totalSupply);

	try {
		const rewards = await tools.getContractRewards(contractid);
		console.log("Reward Contract: " + rewards[0]);
	} catch (e) {
		console.log("Cant get rewards: " + JSON.stringify(e));
	}

}

doit();
