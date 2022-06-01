//newBookContract.js " + _name + " " + _symbol + " " + _bookRegistryAddress + " " + _baseuri + " " + _burnable + " " + _maxmint + " " + _defaultprice + " " + _defaultfrom + " " + _mintTo + " " + _mintTo
// + the file name of where the contractid will be written
var tools = require('./tools');
var lockFile = require('lockfile')

const myArgs = process.argv.slice(2);
const _name = myArgs[0];
const _symbol = myArgs[1];
const _bookRegistryAddress = myArgs[2];
const _baseuri = myArgs[3];
const _burnable = myArgs[4];
const _maxmint = myArgs[5];
const _defaultprice = myArgs[6];
const _defaultfrom = myArgs[7];
const _mintTo = myArgs[8];
const who = myArgs[9];
const whoFile = myArgs[10];


async function doit() {
        var contractid;


	const lockfile = whoFile + ".lock";
	let haveLock = false;
	await lockFile.lock(lockfile, { wait: 1, stale: 10000 }, async function (err) {
		if (err) {
			console.log("Locking error: " + err);
			return;
		} 
		haveLock = true;

		await doitWithLockfile(lockfile);
	});
}

async function doitWithLockfile(lockfile) {

	const defaultPrice = tools.web3.utils.toWei(_defaultprice,"ether");

	const txsFile = whoFile + ".txs";

        try {
                // Read the file's string contents directly into the contractid
                const ret = await tools.newBookContract(_name, _symbol, _bookRegistryAddress, _baseuri, _burnable, _maxmint, defaultPrice, _defaultfrom, _mintTo);
		console.log("ret: ", ret);
		console.log("who: ", who);
		console.log("whoFile: ", whoFile);


		const typesArray = [
                                {type: 'string', name: '_meme'},
                                {type: 'uint256', name: 'amount'},
                                {type: 'address', name: 'what', indexed: true},
                                //{type: 'string', name: 'crypt'},
                        ];

		const result = ret;
		//console.log("result: ", result);
		//console.log("result.logs: ", result.logs);

		const txs = result.logs[2].transactionHash;
		console.log("txs: ", txs);

		const contractid = await tools.getContractId(txs);
		console.log("contractid: ", contractid);
		if(contractid != "check moralis query string above and the id of the registry in your moralis server.") {
			console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
			console.log(contractid, contractid, contractid, contractid, contractid);
			console.log(whoFile)
			tools.writeFile(whoFile, contractid);
			tools.writeFile(whoFile + ".totalsupply", "0");

			for(i=0; i<10; i++) {
				try {
					const addonRet = await tools.setupAddonPrintingPress(contractid);
					console.log("addonRet: ", addonRet);
					break;

				} catch(e) {
					console.log("Error adding on addon: ", e);
					tools.sleep(1000);
				}
			}
		}

		// remove lock file
		lockFile.unlock(lockfile, function(err) {
			//console.error("unlocked failed", err);
			if (err) {
				console.error("unlock failed: ", err);
			}
		});

        } catch (e) {
                console.log('error calling newBookContract: ',  e);
		//tools.writeFile(retTxt, e);
                return;
        }
}

doit();

