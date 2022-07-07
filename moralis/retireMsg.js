// contractid, msg, signature, tokenid, daedalusToken
var tools = require('./tools');
const myArgs = process.argv.slice(2);
const msg = myArgs[0];
const yesNo = myArgs[1];

async function doit() {

	console.log("msg: " + msg);

        try {
                // Read the file's string contents directly into the contractid
                const ret = await tools.retireMsg(msg, yesNo=="true");
		console.log("ret: ", ret);
        } catch (e) {
                console.log('error calling tools.retireMsg: ',  e);
        }
}

doit();

