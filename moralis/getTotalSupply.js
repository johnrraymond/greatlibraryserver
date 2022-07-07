const Moralis = require('moralis/node');
const Web3 = require('web3');
const fs = require('fs')

const serverUrl = "https://vclchdyzphmx.usemoralis.com:2053/server"; //Server url from moralis.io
const appId = "L6pdnKFdbuABqMvNxA2ZDvWaQjarg5qEQ6LwnKaO"; // Application id from moralis.io
Moralis.start({ serverUrl, appId });

const provider = new Web3.providers.HttpProvider(serverUrl);
const web3 = new Web3(provider);

const NBT_abi = JSON.parse(fs.readFileSync('BookTradable.json', 'utf8'));

const myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);


const contractid = myArgs[0];
//const contract = new web3.eth.Contract(NBT_abi, contractid);

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

getTotalSupply(contractid);
