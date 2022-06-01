var tools = require('./tools');
const myArgs = process.argv.slice(2);
//const contractfile = myArgs[0];
//const newOwner = myArgs[1];

async function doit() {


	offeringid = "0x273c5f6f2482ebf7055a08a5ac83074be744ca1ff9867b8acefa0e555f9e4f9d";
	marketplace = "0xCefF5328e3901469A5037d9c6be4313d11Ab6d33";

	await tools.viewOfferingNFT(marketplace, offeringid);
	//await tools.closeOffering(marketplace, offeringid);
}

doit();
