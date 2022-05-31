const chainID = "0xa869";
//Only edit this file if you see this commment at the top....
Moralis.settings.setAPIRateLimit({
  anonymous:100, authenticated:200, windowMs:60000
});

const web3 = Moralis.web3ByChain(chainID); 

//const chainID = "0xa869";// avalanche fuji testnet
//const web3 = Moralis.web3ByChain("0x13881"); // polygon mumbai testnet
//const web3 = Moralis.web3ByChain("0x89"); // polygon mainnet
//const web3 = Moralis.web3ByChain("0x61"); // bsc testnet
//const web3 = Moralis.web3ByChain("0x38"); //bsc mainnet

//bookRegistryAccount = "0x213e6e4167c0262d8115a8af2716c6c88a6905fd";
const ccTotalSupply = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

//const cultureCoinAddress = "0xc90cEB986d80060F88A1be988681AAe9Eb238A39"; polygon mainnet
//const cultureCoinAddress = "0xc3bF7d5949C9Bfe74D0222f9C47d2443F181D50B"; // polygon testnet
//const cultureCoinAddress = "0xCC38BD1C38Bb22d4871d43C7AE1D82512c182842"; // CultureCoin on ava fuji testnet

//const nft_market_place_address = "0x8e1760f041Bc828E310069E8E160148B43740E17"; //mumbia test net
//const nft_market_place_address = "0x648b54B7f459fEADA0DdF5f7B94676F5d4Bc27CA"; // ava fuji testnet


Moralis.Cloud.beforeSaveFile((request) => {
  throw "Not Allowed";
 });

// Assuming 6 dollar books and 100million dollars worth oftotal CultureCoin. For those buying bookmarks and books, they will get 6usd of rewards. 3usd of CC each.
function getDefaultGasRewards() {
	//Assume 6USD and total supply is worth 100M USD.
	//const rewardAmount = BigInt(ccTotalSupply) * BigInt("6") / BigInt("80000000");
	//logger.info("rewardAmount:" + rewardAmount);
	//return [rewardAmount+"", (rewardAmount/BigInt("2"))+""];	// The total. Half of it is a reward to the buyer
	return [web3.utils.toWei("6","ether"), web3.utils.toWei("3","ether")];
}

//const marketPlace = new web3.eth.Contract(nft_market_place_abi,nft_market_place_address);
//const cultureCoin = new web3.eth.Contract(CC_abi, cultureCoinAddress);


async function placeOfferingOperator(hostContract, offerer, tokenId, price) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("placeOfferingOperator");

	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	
	logger.info("hostContract: " + hostContract);
	logger.info("offerer: " + offerer);
	logger.info("tokenId: " + tokenId);
	logger.info("price: " + price);

	const functionCall = marketPlace.methods.placeOfferingOperator(offerer,hostContract,tokenId,web3.utils.toWei(price,"ether")).encodeABI();

    	transactionBody = {
    		to: nft_market_place_address,
      		nonce:nonceOperator,
      		data:functionCall,
      		gas:8000000,
      		gasPrice:web3.utils.toWei("100", "gwei")
    	}
  	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
  	const offeringid = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

	logger.info("offeringid: " + JSON.stringify(offeringid));

	return offeringid;
}

async function getTokenPrice(contractid, tokenid){
	const logger = Moralis.Cloud.getLogger();
        const queryAll = new Moralis.Query(placedOfferingsTable);

        queryAll.equalTo("hostContract", contractid);
        queryAll.equalTo("tokenId", String(tokenid));

        const data = await queryAll.find()

        logger.info("queryAll: " + JSON.stringify(queryAll));
        logger.info("data: " + JSON.stringify(data));
	logger.info("data.length: " + data.length);
	if (data.length == 0) {
		("data.length is zero 0 returning unknown price.");
		return "unknown";
	}

        price = "unknown";
        offeringId = "unknown";
        for (i=0;i<data.length;i++){
                //logger.info(data[i].attributes);

                logger.info(data[i].get("hostContract"));
                //logger.info("data[i].get(hostContract)" + data[i].get("hostContract"));

                price = data[i].get("price");
                logger.info("price" + price);

                price = web3.utils.fromWei(price);
		logger.info("price from wei" + price);

                offeringId = data[i].get("offeringId");

		logger.info("offeringId" + offeringId);

        }

	return price;
}

async function fillGasTank(hostContract, tokenId, gasTotal, gasReward) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("fillGasTank");
	logger.info("hostContract: " + hostContract);
	logger.info("tokenId: " + tokenId);
	logger.info("gasTotal: " + gasTotal);
	logger.info("gasReward: " + gasReward);

	const contract = new web3.eth.Contract(NBT_abi, hostContract);
	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const functionCall = contract.methods.fillGasTank(tokenId, gasTotal, gasReward).encodeABI();
	transactionBody = {
		to: hostContract,
		nonce:nonceOperator,
		data:functionCall,
		gas:8000000,
		gasPrice:web3.utils.toWei("100", "gwei")
	}
	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
	const tx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	logger.info("tx: " + JSON.stringify(tx));
}

async function getGasRewards(hostContract, tokenId) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("getGasRewards");
	const contract = new web3.eth.Contract(NBT_abi, hostContract);
	const gasAmounts = await contract.methods.getGasRewards(tokenId).call();
	logger.info("frm getGasRewards::: gasAmounts:" + JSON.stringify(gasAmounts));
	return gasAmounts;
}

async function getRewards(hostContract, tokenId) {
	const logger = Moralis.Cloud.getLogger();
	const contract = new web3.eth.Contract(NBT_abi, hostContract);
	const rewards = await contract.methods.getRewards(tokenId).call();
	logger.info("rewards: " + JSON.stringify(rewards));
	return rewards;
}


async function getGasToken(hostContract) {
	const logger = Moralis.Cloud.getLogger();
	const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
	const gasToken = await NBTcontract.methods.getGasToken().call();
	logger.info("gasToken: " + gasToken);
	return gasToken;
}

async function getCultureCoinBalance() {
	const logger = Moralis.Cloud.getLogger();
	const balance = await cultureCoin.methods.balanceOf(bookRegistryAccount).call();
	logger.info("balance: " + balance);
	return balance;
}

async function approveCultureCoinToContract(hostContract, amount) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("approveCultureCoinToContract");
	logger.info("hostContract: " + hostContract);
	logger.info("amount: " + amount);

	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const functionCall = cultureCoin.methods.approve(hostContract, amount).encodeABI();
	transactionBody = {
		to: cultureCoinAddress,
		nonce:nonceOperator,
		data:functionCall,
		gas:8000000,
		gasPrice:web3.utils.toWei("100", "gwei")
	}
	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
	const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	logger.info("result:" + JSON.stringify(result));
	return result;
}

async function setGasToken(hostContract) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("setGasToken");
	logger.info("hostContract: " + hostContract);

	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const contract = new web3.eth.Contract(NBT_abi,hostContract);
	const functionCall = contract.methods.setGasToken(cultureCoinAddress).encodeABI();
	transactionBody = {
		to: hostContract,
		nonce:nonceOperator,
		data:functionCall,
		gas:8000000,
		gasPrice:web3.utils.toWei("100", "gwei")
	}
	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
	const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	logger.info("result:" + JSON.stringify(result));
}

/*
async function setRewardContract(hostContract, rewardContract) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("setRewardContract");
	logger.info("hostContract: " + hostContract);
	logger.info("rewardContract: " + rewardContract);

	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const contract = new web3.eth.Contract(NBT_abi,hostContract);
	const functionCall = contract.methods.setRewardContract(rewardContract).encodeABI();
	transactionBody = {
		to: hostContract,
		nonce:nonceOperator,
		data:functionCall,
		gas:8000000,
		gasPrice:web3.utils.toWei("100", "gwei")
	}
	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
}
*/

async function setRewardToken(hostContract, tokenId, rewardTokenId) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("setRewardToken");
	logger.info("hostContract: " + hostContract);
	logger.info("tokenId: " + tokenId);
	logger.info("rewardTokenId: " + rewardTokenId);

	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const contract = new web3.eth.Contract(NBT_abi,hostContract);
	const functionCall = contract.methods.setRewardToken(tokenId, rewardTokenId).encodeABI();
	transactionBody = {
		to: hostContract,
		nonce:nonceOperator,
		data:functionCall,
		gas:8000000,
		gasPrice:web3.utils.toWei("100", "gwei")
	}
	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
	const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	logger.info("result:" + JSON.stringify(result));
}

// Call into the reward contract and tell it that the host contract is cool to use the reward token.
async function approveRewardForHostContract(rewardContract, hostContract, rewardTokenId) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("approveHostContract, rewardContract: " + rewardContract + " hostContract: " + hostContract + " rewardTokenId: " + rewardTokenId);

	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const contract = new web3.eth.Contract(NBT_abi,rewardContract);
	const functionCall = contract.methods.approve(hostContract, rewardTokenId).encodeABI();
	transactionBody = {
		to: rewardContract,
		nonce:nonceOperator,
		data:functionCall,
		gas:8000000,
		gasPrice:web3.utils.toWei("100", "gwei")
	}
	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
	const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	logger.info("result:" + JSON.stringify(result));
	return result;
}

async function setTokenPrice(hostContract, contractOwner, tokenId, price) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("in setTokenPrice");
	logger.info("hostContract: " + hostContract);
	logger.info("contractOwner: " + contractOwner);
	logger.info("tokenId: " + tokenId);

	const gasAmounts = await getGasRewards(hostContract, tokenId);
	logger.info("gasAmounts: " + gasAmounts[0]);

	if(false && gasAmounts[0] == 0) {
		logger.info("gasAmounts[0] is zero 0 ");
		const defaultRewards = getDefaultGasRewards();
		logger.info("defaultRewards: " + JSON.stringify(defaultRewards));
		logger.info("defaultRewards[0]: " + defaultRewards[0]);
		logger.info("defaultRewards[1]: " + defaultRewards[1]);

		gasTokenAddress = await getGasToken(hostContract);
		logger.info("gasTokenAddress: " + gasTokenAddress);
		logger.info("cultureCoinAddress: " + cultureCoinAddress);
		if(gasTokenAddress != cultureCoinAddress) {
			logger.info("gasTokenAddress is not cultureCoinAddress");
			await setGasToken(hostContract);
		}

		const allowance = await approveCultureCoinToContract(hostContract, defaultRewards[0]);

		const balance = await getCultureCoinBalance();
		logger.info("balance: " + balance);

		await fillGasTank(hostContract, tokenId, defaultRewards[0], defaultRewards[1]);
	}

	const rewards = await getRewards(hostContract, tokenId);
	logger.info("rewards: " + JSON.stringify(rewards));
	const rewardContract = rewards[0];
	const rewardToken = rewards[1];
	logger.info("rewardContract: " + rewardContract);
	logger.info("rewardToken: " + rewardToken);
	logger.info("rewardContract != 0: " + (rewardContract != 0));
	logger.info("rewardContract != 0 && rewardToken != 0: " + (rewardContract != 0 && rewardToken == 0));


	// If the token is set and the contract isn't things are rally bad and we have no solution from here but to
	// Ignore the problem and hope its ok the token will be in limbo until the contract is set again.
	if(false && rewardContract != 0) {

		logger.info("setting safe sender for rewardContract: " + rewardContract);
		await verifySafeSender(rewardContract, hostContract);	// The hostContact AKA the bookmark contrat itself is the safe sender for the reward contract.

		logger.info("Setting a new reward up for this token: " + tokenId);
		const contractOwner = await getContractOwner(rewardContract);
		const currentTokenId = await getCurrentToken(rewardContract);
		var currentTokenOwner;
		if(currentTokenId != 0) {
			currentTokenOwner = await getTokenOwner(rewardContract, currentTokenId);
		} else {
			currentTokenOwner = contractOwner; // If token is 0 then there is no token so the current owner is the contract owner
		}

		logger.info("rewardContract: " + rewardContract);
		logger.info("currentTokenOwner: " + currentTokenOwner);

		if(contractOwner.toLowerCase() == currentTokenOwner.toLowerCase()) {
			logger.info("contractOwner is the same as currentTokenOwner");
			var rewardTokenId;
			if(currentTokenId != 0) {
				logger.info("and currentTokenId is not 0 so use it and dont mint a new one.");
				rewardTokenId = currentTokenId;
				_doMint = false;
			} else {
				logger.info("and currentTokenId is 0 so mint a new one.");
				_doMint = true;
			}
                } else { // The current token owner isn't the contact owner so we need to mint a new one.
			logger.info("contractOwner is not the same as currentTokenOwner and current reward tokenid is " + currentTokenId);
			_doMint = true;
		}

		if(_doMint) {
			const mintTx = await doMintTo(rewardContract, contractOwner);
			logger.info("mintTx: " + JSON.stringify(mintTx));

			rewardTokenId = await getCurrentToken(rewardContract);
			logger.info("rewardTokenId: " + rewardTokenId);
		} 


		const getCurrentTokenReward = await getRewards(hostContract, tokenId);

		if(getCurrentTokenReward[1] != rewardTokenId) {
			// Remember tokenId is the bookmark tokenId and rewardTokenID is the book's.
			await setRewardToken(hostContract, tokenId, rewardTokenId);
		}

		logger.info("gassing up the reward token");
		const defaultRewards = getDefaultGasRewards();

		const gasAmounts = await getGasRewards(rewardContract, tokenId);
        	logger.info("reward gasAmounts 0: " + gasAmounts[0]);
        	logger.info("reward gasAmounts 1: " + gasAmounts[1]);


                if(gasAmounts[1] < defaultRewards[1]) {
			const allowance = await approveCultureCoinToContract(rewardContract, defaultRewards[0]);
			await fillGasTank(rewardContract, rewardTokenId, defaultRewards[0], defaultRewards[1]);
		}

	}

	const contract = new web3.eth.Contract(NBT_abi, hostContract);
	const approved = await contract.methods.getApproved(tokenId).call();
	logger.info("approved for token if is: " + approved);
	if (approved != bookRegistryAccount) {
		logger.info("this is not the book registry account: " + approved);
		logger.info("attempting to approve the book registry account:" + bookRegistryAccount);
		const tx = await approveRegistry(hostContract, tokenId);
		logger.info("tried to set approved..." + JSON.stringify(tx));
		const newapproved = await contract.methods.getApproved(tokenId).call();
		logger.info("is new approved same as registry? ::: " + newapproved);
	}
	const contractChild = new web3.eth.Contract(NBT_abi, rewardContract);
	const approvedChild = await contractChild.methods.getApproved(tokenId).call();
	if(approvedChild != bookRegistryAccount) {
		await approveRewardForHostContract(rewardContract, hostContract, rewardTokenId);
	}

	const currentPrice = await getTokenPrice(hostContract, tokenId);
	if (currentPrice != "unknown"){
		logger.info("currentPrice: " + currentPrice);
		return tokenId;
	}

	await placeOfferingOperator(hostContract, contractOwner, tokenId, price);
	return tokenId;
}

Moralis.Cloud.define("getBalance", async(request) => {
	const logger = Moralis.Cloud.getLogger();
	logger.info("getBalance");
	logger.info(request);

	const balance = await marketPlace.methods.viewBalances(request.params.address).call();
	return balance;
});


async function getCurrentToken(hostContract) {
	const contract = new web3.eth.Contract(NBT_abi, hostContract);
        const currentToken = await contract.methods.getCurrentToken().call();
        logger.info("current token:" + currentToken);
	return currentToken;
}

async function getTokenOwner(hostContract, tokenId) {
	const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
	const tokenOwner = await NBTcontract.methods.ownerOf(tokenId).call();
	logger.info("tokenOwner: " + tokenOwner);
	return tokenOwner;
}

async function getContractOwner(hostContract) {
	const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
	const contractOwner = await NBTcontract.methods.owner().call();
	logger.info("contractOwner: " + contractOwner);
	return contractOwner;
}

async function getDefaultFrom(hostContract) {
	const contract = new web3.eth.Contract(NBT_abi, hostContract);
	const defaultFrom = await contract.methods.getDefaultFrom().call();
	logger.info("defaultFrom:" + defaultFrom);
	return defaultFrom;
}

//function delegateMinter (address _DCBT, uint _tokenMax, uint _amount, uint _gasRewards) public {
async function doMintTo2(_hostContract, _address) {
        const logger = Moralis.Cloud.getLogger();

	const contract = new web3.eth.Contract(press_abi, printingPressAddress);
        const tx = await contract.methods.delegateMinter(_address, _hostContract, "1", "0", "0").call();
        logger.info("tx: " + tx);
}

async function doMintTo(_hostContract, _address) {
	const logger = Moralis.Cloud.getLogger();

	const contract = new web3.eth.Contract(NBT_abi, _hostContract);
        const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const functionCall = contract.methods.mintTo(_address).encodeABI();
        transactionBody = {
                to: _hostContract,
                nonce:nonceOperator,
                data:functionCall,
                gas:8000000,
                gasPrice:web3.utils.toWei("100", "gwei")
        }
        signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
        tokenId = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	logger.info("tokenId:"+ tokenId);

	return tokenId;
}

async function getDefaultPrice(hostContract) {
	const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
	const defaultPrice = await NBTcontract.methods.getDefaultPrice().call();
	logger.info("defaultPrice:" + defaultPrice);
	return defaultPrice;
}

async function approveRegistry(_hostContract, _tokenId) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("approveRegistry");
	logger.info("_hostContract: " + _hostContract);
	logger.info("_tokenId: " +_tokenId);

	const contract = new web3.eth.Contract(NBT_abi, _hostContract);
	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
	const functionCall = contract.methods.approve(bookRegistryAccount, _tokenId).encodeABI();
	transactionBody = {
		to: _hostContract,
		nonce:nonceOperator,
		data:functionCall,
		gas:8000000,
		gasPrice:web3.utils.toWei("100", "gwei")
	}
	signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
	fulfillTx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        return fulfillTx;
}


async function setDefaultFrom(request) {
	const logger = Moralis.Cloud.getLogger();
        logger.info(request);

        const hostContract = request.params.hostContract;
	const contract = new web3.eth.Contract(NBT_abi, setDefaultFrom);

        const offerer = request.params.offerer;
        const tokenId = request.params.tokenId;
        const price = request.params.price;
        const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
        const functionCall = contract.methods.setDefaultFrom(String("1000")).encodeABI();
    	transactionBody = {
        	to: hostContract,
        	nonce:nonceOperator,
        	data:functionCall,
        	gas:8000000,
        	gasPrice:web3.utils.toWei("100", "gwei")
        }
        signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
        return signedTransaction;
}

// This is a hack to make it so the markplace contract can call a function the NBT contracts.
// This hack also lets the bookmark contract call into the reward book contract.
async function verifySafeSender(hostContract, safeSenderAddress) {
	const logger = Moralis.Cloud.getLogger();
	logger.info("verifySafeSender");
	logger.info("trying to set " + hostContract + "'s safeSenderAddress to: " + safeSenderAddress);

	const contract = new web3.eth.Contract(NBT_abi, hostContract);
	const safeSender = await contract.methods.getSafeSender().call();
	logger.info("safeSender will have been: " + safeSender);

	if (safeSender == safeSenderAddress) {
		return;
	}

       	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
       	const functionCall = contract.methods.setSafeSender(safeSenderAddress).encodeABI();
       	transactionBody = {
               	to: hostContract,
               	nonce:nonceOperator,
               	data:functionCall,
               	gas:8000000,
               	gasPrice:web3.utils.toWei("100", "gwei")
        }
        signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
        return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
}

Moralis.Cloud.define("prepNextDefaultToken", async(request) => {
	const logger = Moralis.Cloud.getLogger();
	logger.info("ENTERING prepNextDefaultToken");

	const hostContract = request.params.hostContract;
	logger.info("hostContract:" + hostContract);

	const currentTokenId = parseInt(await getCurrentToken(hostContract));
	logger.info("currentTokenId:" + currentTokenId);

	const currentTokenOwner = await getTokenOwner(hostContract, currentTokenId);
	logger.info("currentTokenOwner:" + currentTokenOwner);

	const contractOwner = await getContractOwner(hostContract);
	logger.info("contractOwner:" + contractOwner);

	const defaultFrom = parseInt(await getDefaultFrom(hostContract));
	logger.info("defaultFrom: " + defaultFrom);

	await verifySafeSender(hostContract, nft_market_place_address);

	logger.info("currentTokenId >= defaultFrom: " + (currentTokenId >= defaultFrom));

	if (currentTokenId >= defaultFrom) {
		logger.info("currentTokenId >= defaultFrom: preparing to mint if needed");
		defaultPrice = await getDefaultPrice(hostContract);
		logger.info("defaultPrice: " + defaultPrice);

		if (currentTokenOwner == contractOwner) {
			logger.info("currentTokenOwner == contractOwner: need to set the price");

			const retval = await setTokenPrice(hostContract, contractOwner, currentTokenId, defaultPrice); // this returns the transaction hash
			logger.info("setTokenPrice returned: " + JSON.stringify(retval));

			return retval; //This should be the tokenid of the old bookmark that someone else didn't buy,

		} else if (currentTokenOwner != contractOwner) {

			logger.info("currentTokenOwner != contractOwner && currentTokenId >= defaultFrom: must mint now");

			const mintTx = await doMintTo2(hostContract, contractOwner)
			logger.info("mintTx: " + JSON.stringify(mintTx));

			const newTokenId = await getCurrentToken(hostContract);
			logger.info("newTokenId: " + newTokenId);

			const retval = await setTokenPrice(hostContract, contractOwner, newTokenId, defaultPrice); // this returns the transaction hash
			logger.info("setTokenPrice returned: " + JSON.stringify(retval));

			return retval; //This should be the tokenid of the new minted bookmark.
		}
	}

	logger.info("EXITING prepNextDefaultToken at bottom");
	return "0";
});

Moralis.Cloud.define("getBookRegisteryContractAddress", async(request) => {
	return nft_market_place_address;
});

Moralis.Cloud.define("getMasterKey", async(request) => {
	const logger = Moralis.Cloud.getLogger();
	logger.info("ENTERING getMasterKey");

	const msg = request.params.msg;
	logger.info("msg: " + msg);
	const signature = request.params.signature;
	logger.info("signature: " + signature);
	msgSender = web3.eth.accounts.recover(msg, signature);
	logger.info("msgSender: " + msgSender);

	if(msgSender.toLowerCase() == bookRegistryAccount.toLowerCase()) {
               let options = {
                        "chainId": chainID,
                        "address": cultureCoinAddress,
                        "topic": "MCMM(string, uint256)",
                        "abi":   {
                                "anonymous": false,                                                                                                                                                                                           "inputs": [
                                        { "indexed": true, "internalType": "string", "name": "_meme", "type": "string" },
                                        { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }                                                                                                                   ],
                                "name": "MCMM",
                                "type": "event"
                        },
                        "tableName": "MCMM",
                        "sync_historical": true
                }
                Moralis.Cloud.run("watchContractEvent", options, {useMasterKey:true});
		return "1";
	} else {
		return "0";
	}

	logger.info("EXITING getMasterKey at bottom");
});

Moralis.Cloud.define("getLibraryNonce", async(request) => {
	return await web3.eth.getTransactionCount(bookRegistryAccount);
});

const NBT_abi =
[{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"address","name":"_bookRegistryAddress","type":"address"},{"internalType":"string","name":"_baseuri","type":"string"},{"internalType":"bool","name":"_burnable","type":"bool"},{"internalType":"uint256","name":"_maxmint","type":"uint256"},{"internalType":"uint256","name":"_defaultprice","type":"uint256"},{"internalType":"uint256","name":"_defaultfrom","type":"uint256"},{"internalType":"address","name":"_gasToken","type":"address"},{"internalType":"address","name":"_cCA","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"GasTokenSpent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"address payable","name":"relayerAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"functionSignature","type":"bytes"}],"name":"MetaTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"ERC712_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_getNextTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_incrementTokenId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"addonBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"addonMintTo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseTokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_reason","type":"string"}],"name":"burnGas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cCA","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"bytes","name":"functionSignature","type":"bytes"},{"internalType":"bytes32","name":"sigR","type":"bytes32"},{"internalType":"bytes32","name":"sigS","type":"bytes32"},{"internalType":"uint8","name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_gasRewards","type":"uint256"}],"name":"fillGasTank","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addon","type":"address"}],"name":"getAddon","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDefaultFrom","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDefaultPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDomainSeperator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getGasRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGasToken","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProxyRegistryAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getRewards","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isAddon","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxmint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"mintTo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFromRegistry","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addon","type":"address"},{"internalType":"bool","name":"_isAddon","type":"bool"}],"name":"setAddon","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_baseuri","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_burnable","type":"bool"}],"name":"setBurnable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_defaultfrom","type":"uint256"}],"name":"setDefaultFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_defaultprice","type":"uint256"}],"name":"setDefaultPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_gasToken","type":"address"}],"name":"setGasToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxmint","type":"uint256"}],"name":"setMaxMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_bookRegistryAddress","type":"address"}],"name":"setProxyRegistryAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_rewardContract","type":"address"}],"name":"setRewardContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_rewardTokenId","type":"uint256"}],"name":"setRewardToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_royalty","type":"uint256"}],"name":"setRoyalty","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const CC_abi =
[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_meme","type":"string"}],"name":"Debug","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_address","type":"address"}],"name":"DebugAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"defaultValue","type":"uint256"}],"name":"DebugUINT","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"level","type":"string"},{"indexed":false,"internalType":"string","name":"goof","type":"string"}],"name":"HWarn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"meme","type":"string"},{"indexed":false,"internalType":"address","name":"newCoin","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalSupply","type":"uint256"},{"indexed":false,"internalType":"bool","name":"registered","type":"bool"}],"name":"IRegister","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_meme","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"MCMM","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"crypt","type":"string"}],"name":"Meme","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"}],"name":"Seed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_meme","type":"string"}],"name":"WelcomeMC","type":"event"},{"inputs":[],"name":"B","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"P","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"addonPay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"brick","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bulkCCOut","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bulkXOut","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cCA","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ccXChildRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clone","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cloneAccount","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"cloneMoney","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_clone","type":"address"}],"name":"clonesearch","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"close","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"closeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"closed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"a","type":"string"},{"internalType":"string","name":"b","type":"string"}],"name":"compareStrings","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"a","type":"string"},{"internalType":"string","name":"b","type":"string"}],"name":"concatenate","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"debug","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"dexCCIn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"dexCCInFrom","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dexCCRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"dexXMTSPIn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"dexXMTSPRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"youBUBUY","type":"uint256"},{"internalType":"string","name":"andTheUBREKUBYE","type":"string"}],"name":"disclaimer","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_meme","type":"string"}],"name":"flagMemeCoin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addon","type":"address"}],"name":"getAddon","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_meme","type":"string"}],"name":"getCoin","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDexCCRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDexXMTSPRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRewardPerHour","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getXAllowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_staker","type":"address"}],"name":"hasStake","outputs":[{"components":[{"internalType":"uint256","name":"total_amount","type":"uint256"},{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"since","type":"uint256"},{"internalType":"uint256","name":"claimable","type":"uint256"}],"internalType":"struct Stakeable.Stake[]","name":"stakes","type":"tuple[]"}],"internalType":"struct Stakeable.StakingSummary","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"},{"internalType":"address","name":"_cCA","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"maxCCOut","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxXOut","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"recover","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_meme","type":"string"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_hodler","type":"address"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"rewardPerHour","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sane","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"sane2","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"_meme","type":"string"},{"internalType":"uint256","name":"_totalSupply","type":"uint256"},{"internalType":"address","name":"_MotherAddress","type":"address"},{"internalType":"bool","name":"_register","type":"bool"}],"name":"seed","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addon","type":"address"},{"internalType":"bool","name":"onOff","type":"bool"}],"name":"setAddon","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_dexCCRate","type":"uint256"}],"name":"setDexCCRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_dexXMTSPRate","type":"uint256"},{"internalType":"uint256","name":"_dexCCRate","type":"uint256"}],"name":"setDexRates","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_dexXMTSPRate","type":"uint256"}],"name":"setDexXMTSPRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxXOut","type":"uint256"}],"name":"setMaxXOut","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rewardPerHour","type":"uint256"}],"name":"setRewardPerHour","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unbrick","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wellnessCheckPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"stake_index","type":"uint256"}],"name":"withdrawStake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}];
const nft_market_place_abi =
[{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"address","name":"_cCA","type":"address"},{"internalType":"address","name":"_gasToken","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BalanceWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"offeringId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"}],"name":"OfferingClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"offeringId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"hostContract","type":"address"},{"indexed":true,"internalType":"address","name":"offerer","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"OfferingPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousOperator","type":"address"},{"indexed":false,"internalType":"address","name":"newOperator","type":"address"}],"name":"OperatorChanged","type":"event"},{"inputs":[],"name":"addonPay","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOperator","type":"address"}],"name":"changeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_offeringId","type":"bytes32"}],"name":"closeOfferingRoyalty","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_offeringId","type":"bytes32"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"closeOfferingRoyaltyCC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_hostContract","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"placeOffering","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_offerer","type":"address"},{"internalType":"address","name":"_hostContract","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"placeOfferingOperator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_gasToken","type":"address"}],"name":"setGasToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"viewBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_offeringId","type":"bytes32"}],"name":"viewOfferingNFT","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawBalance","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const TGK_abi =
[{"inputs":[{"internalType":"address","name":"_cultureCoin","type":"address"},{"internalType":"address","name":"_DCBT","type":"address"},{"internalType":"address","name":"_cCA","type":"address"},{"internalType":"uint256","name":"_tokenMax","type":"uint256"},{"internalType":"uint256","name":"_plurality","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"theContract","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"passKey","type":"string"}],"name":"KeyUsed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"Nonce","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"theContract","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Proof","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"vote","type":"bool"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"YesNo","type":"event"},{"inputs":[],"name":"DCBT","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"b","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cCA","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"counted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cultureCoin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"getBlacklist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLog","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_meme","type":"string"}],"name":"getMemeBlacklist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"}],"name":"getTimeLock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getTokenOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getTokenOwnerWithContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getYesNo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"incrementNonce","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_key","type":"string"},{"internalType":"uint256","name":"_pass","type":"uint256"}],"name":"isKeyPass","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"noncePayment","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"plurality","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"proveOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"recover","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amountCC","type":"uint256"}],"name":"recoverCC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"remitAllPay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"remitPay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"bool","name":"_utility","type":"bool"}],"name":"setBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_key","type":"string"},{"internalType":"uint256","name":"_pass","type":"uint256"}],"name":"setKeyPass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_log","type":"address"}],"name":"setLog","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_meme","type":"string"},{"internalType":"bool","name":"_utility","type":"bool"}],"name":"setMemeBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setNoncePayment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"uint256","name":"_timeLock","type":"uint256"}],"name":"setTimeLock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"timeLock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"upDownVote","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bool","name":"_upDownVote","type":"bool"}],"name":"yesNo","outputs":[],"stateMutability":"payable","type":"function"}];
const marketPlaceAddress = "0x17a3D635284c100ea39f2Eb294AeB40CC87f3c23";
const cultureCoinAddress = "0x59932D1B061b3CFFF3591d0571841CAB4393b0Ff";
const printingPressAddress = "0xf2dF33307A3f8207C7471f5E394a868a544ff849";
const daedalusClassBoosterAddress = "0x47332328173546c25dfe30f1f4f50d49cc5c369a";
const theGoldenKeysAddress = "0x03CCdAA389e6B0673C0f5A8498412dcC925c2870";
const bookRegistryAccount = "0x213E6E4167C0262d8115A8AF2716C6C88a6905FD";
const placedOfferingsTable = "PlacedOfferingsTen";
const marketPlace = new web3.eth.Contract(nft_market_place_abi,marketPlaceAddress);
const cultureCoin = new web3.eth.Contract(CC_abi, cultureCoinAddress);
const theGoldenKey = new web3.eth.Contract(TGK_abi, theGoldenKeysAddress);
const nonceWindow = "10";
