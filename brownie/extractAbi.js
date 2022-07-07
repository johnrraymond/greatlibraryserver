'use strict';

const fs = require('fs');

function extractABI(filePath) {
	console.log('Extracting ABI from ' + filePath);
	const file = fs.readFileSync(filePath);
	const contract = JSON.parse(file);
	const abi = contract.abi;
	return abi;
}

const contracts = ["CultureCoin", "BookTradable", "MarketPlace", "PrintingPress",  "TheGoldenKeys", "BEN", "GamblersUnionBEN", "BaseSpells", "BaseLoot", 
     "MyItems", "Hero", "TimeCube"];

for(let i = 0; i < contracts.length; i++) {
	const contract = contracts[i];
	const abi = extractABI(`./build/contracts/${contract}.json`);
	fs.writeFileSync(`./${contract}.json`, JSON.stringify(abi));
	fs.writeFileSync(`./${contract}ABI.cs`, `namespace MoralisWeb3ApiSdk { public class ${contract}ABI { public static string ABI = "`
					+ JSON.stringify(abi).replace(/"/g, '\\"') +
					`"; } }`);

	if(true) {
		for(let j = 0; j < abi.length; j++) {
			// This means there could be collisions so be careful.
			if(abi[j].name == "OfferingPlaced") {
    				fs.writeFileSync(`./MarketPlace-OfferingPlaced.json`, JSON.stringify(abi[j]));
			}
			if(abi[j].name == "OfferingClosed") {
    				fs.writeFileSync(`./MarketPlace-OfferingClosed.json`, JSON.stringify(abi[j]));
			}

			if(abi[j].name == "BookContract") {
    				fs.writeFileSync(`./PrintingPress-BookContract.json`, JSON.stringify(abi[j]));
			}

			if(abi[j].name == "Pay") {
    				fs.writeFileSync(`./CultureCoin-Pay.json`, JSON.stringify(abi[j]));
			}

			if(abi[j].name == "Pet") {
    				fs.writeFileSync(`./BEN-Pet.json`, JSON.stringify(abi[j]));
			}

			if(abi[j].name == "ContestStarted") {
    				fs.writeFileSync(`./GamblersUnionBEN-ContestStarted.json`, JSON.stringify(abi[j]));
			}
		}
  	}
}

console.log("Done..\nBe sure to run: cd ..; bash deployCloud.sh");
