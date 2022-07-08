const tools = require('./tools');
const ethers = require('ethers');
const myArgs = process.argv.slice(2);
const mn = myArgs[0];
const passPhrase = myArgs[1];

const  mnemonicWallet = ethers.Wallet.fromMnemonic(mn);
console.log("Save this in the vault:", mnemonicWallet.privateKey);

const hash = tools.encrypt(passPhrase, mnemonicWallet.privateKey);
console.log("cCAPrivateKeyEncrypted=\"" + hash.iv +":"+ hash.content + "\"");

process.exit(0)
