var tools = require('./tools');
const myArgs = process.argv.slice(2);
//const contractfile = myArgs[0];
//const newOwner = myArgs[1];

async function doit() {

	contractid = "0x9171F75269333C3a4E17e402f30705c6414eEe3D";
	tokenId = "11";
	newOwner = "0x213e6e4167c0262d8115a8af2716c6c88a6905fd";
	oldOwner = "0x12b799fA575d68C9e3628Cdc52C89226B988Ea66";

	await tools.safeTransferToken(contractid, oldOwner, newOwner, tokenId);
}

doit();
