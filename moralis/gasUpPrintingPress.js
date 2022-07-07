var tools = require('./tools');
const myArgs = process.argv.slice(2);
const _to = myArgs[0];
const _amount = myArgs[1];


async function doit() {

        try {
                // Read the file's string contents directly into the contractid
                const ret = await tools.gasUpPrintingPress(_to, tools.web3.utils.toWei(_amount,"ether"));
		console.log("new balance: ", ret);

        } catch (e) {
                console.log('error calling gasUpPrintingPress: ',  e);
                return;
        }
}

doit();

