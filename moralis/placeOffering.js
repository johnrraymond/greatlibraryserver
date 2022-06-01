var tools = require('./tools');
const myArgs = process.argv.slice(2);
//const contractfile = myArgs[0];
//const newOwner = myArgs[1];

async function doit() {


	marketplace = "0xC0c29D1B5da9454D850E469964EF04576bE44804";
	offerer = "0x12b799fA575d68C9e3628Cdc52C89226B988Ea66";
	hostContract = "0xb13f807761e80c218738dc069bd8bb822564b579";
	tokenId = "6";
	price = "10000000000";


	await tools.placeOffering(marketplace, offerer, hostContract, tokenId, price);
}

doit();
