const bookRegistryAccount = "0x213e6e4167c0262d8115a8af2716c6c88a6905fd";
const coordinatorKey = "c8dadc405f7c934c96cac7e6c334203c61924d3ef0602de8b8d45ae79de8771c";
const privateKey = Buffer.from(coordinatorKey, 'hex');

const serverUrl = "https://vclchdyzphmx.usemoralis.com:2053/server"; //Server url from moralis.io
const appId = "L6pdnKFdbuABqMvNxA2ZDvWaQjarg5qEQ6LwnKaO"; // Application id from moralis.io

const Moralis = require('moralis/node');
const Web3 = require('web3');
const fs = require('fs')
const Contract = require('web3-eth-contract');
//const Tx = require('ethereumjs-tx').Transaction;

Moralis.start({ serverUrl, appId });

//const provider = new Web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/6ab74770f55b01ab64e8bb9e/polygon/mainnet");
//const web3 = new Web3(provider);
const web3 = new Web3(new Web3.providers.HttpProvider("https://speedy-nodes-nyc.moralis.io/6ab74770f55b01ab64e8bb9e/polygon/mainnet"));
//console.log(web3);
//web3.eth.getTransactionCount(bookRegistryAccount);
const NBT_abi = JSON.parse(fs.readFileSync('BookTradable.json', 'utf8'));

const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

const contractid = myArgs[0];
const to = myArgs[1];

//console.log(contract);
//console.log(to);



async function getTotalSupply(_contractid) {
        const options = {
                chain: "polygon",
                address: _contractid,
                function_name: "totalSupply",
                abi: NBT_abi,
                params: {}
        };
        const totalsupply = await Moralis.Web3API.native.runContractFunction(options);
	console.log(totalsupply);
}

async function getContractOwner(_contractid) {
	const options = {
		chain: "polygon",
		address: _contractid,
		function_name: "owner",
		abi: NBT_abi,
		params: {}
	};
	const owner = await Moralis.Web3API.native.runContractFunction(options);
	console.log(owner);

	return owner;
}

async function transferOwner(_contractid, _to) {
	const owner = await getContractOwner(_contractid);
	console.log("owner: " + owner);
	console.log("bookRA: " + bookRegistryAccount);

	const contract = new Contract(NBT_abi, _contractid);
	const nonceOperator = web3.eth.getTransactionCount(bookRegistryAccount);
        const functionCall = contract.methods.transferOwnership(_to).encodeABI();
        transactionBody = {
		to: _contractid,
                newOwner: _to,
                nonce:nonceOperator,
                data:functionCall,
                gas:10000000,
                gasPrice:web3.utils.toWei("100", "gwei")
        }


        signedTransaction = await web3.eth.accounts.signTransaction(transactionBody,coordinatorKey);
        const retval = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	console.log(retval);


	const newOwner = await getContractOwner(_contractid);
	console.log("newOwner: " + newOwner);
}


transferOwner(contractid, to);
