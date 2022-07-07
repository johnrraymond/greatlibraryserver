console.log("here");
var tools = require('./tools');
console.log("here");
const myArgs = process.argv.slice(2);
const datamine = myArgs[0];
const dataminedir = myArgs[1];

const contractfile = dataminedir + '/contractBM' + datamine + '.txt';
console.log("contractfile: " + contractfile);

async function doit() {
	var contractid;
	try {
		// Read the file's string contents directly into the contractid
		contractid = await tools.readFile(contractfile);
		console.log('contractid: ' + contractid);
	} catch (e) {
		console.log('Error reading contractid file: ' + e);
		return;
	}

	try {
		const totalSupply = await tools.getTotalSupply(contractid);
		console.log('totalSupply: ' + totalSupply);
		await tools.writeFile(contractfile + '.totalsupply', totalSupply);
	} catch (e) {
		console.log('Error getting totalSupply: ', e);
		// now write out the totalSupply file to the dataminedir/contractBM....txt.totalsupply
	}

}

doit();
