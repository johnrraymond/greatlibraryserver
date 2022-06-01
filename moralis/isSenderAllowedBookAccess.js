// contractid, msg, signature, tokenid, daedalusToken
var tools = require('./tools');
const myArgs = process.argv.slice(2);
const contractid = myArgs[0];
const msg = myArgs[1];
const sig = myArgs[2];
const tokenid = myArgs[3];
const daedalusToken = myArgs[4];
const tmpfile = myArgs[5];


async function doit() {

	console.log("contractid: " + contractid);
	console.log("msg: " + msg);
	console.log("sig: " + sig);
	console.log("tokenid: " + tokenid);
	console.log("daedalusToken: " + daedalusToken);


        try {
                // Read the file's string contents directly into the contractid
                const ret = await tools.isSenderAllowedBookAccess(contractid, msg, sig, tokenid, daedalusToken);
		console.log("ret: ", ret);
		console.log("tmpfile: ", tmpfile);
		tools.writeFile(tmpfile, ret);
        } catch (e) {
                console.log('error calling tools.isSenderAllowedBookAccess: ',  e);
		tools.writeFile(tmpfile, "Unknown error");
                return;
        }
}

doit();

