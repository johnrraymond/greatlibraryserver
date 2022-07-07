var tools = require('./tools');
const myArgs = process.argv.slice(2);
const msg = myArgs[0];
const sig = myArgs[1];
const tmpfile = myArgs[2];


async function doit() {

        try {
                // Read the file's string contents directly into the contractid
                const ret = await tools.recover(msg, sig);
		console.log("ret: ", ret);
		console.log("tmpfile: ", tmpfile);
		tools.writeFile(tmpfile, ret);

        } catch (e) {
                console.log('error calling recover: ',  e);
                return;
        }
}

doit();

