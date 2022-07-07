const ethers = require('ethers');
const myArgs = process.argv.slice(2);
const mn = myArgs[0];
const  mnemonicWallet = ethers.Wallet.fromMnemonic(mn);
console.log(mnemonicWallet.privateKey);
