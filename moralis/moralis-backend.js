const tools = require('./tools');
const net = require('net');
const fs = require('fs');
const express = require('express');
const app = express();


const myArgs = process.argv.slice(2);
const parentPid = myArgs[0];
const portTmpFile = myArgs[1];

app.get(/.*/, async (req, res) => {
	//console.log('Req received', req);
	//console.log('Res received', res);

	console.log('Req received', req.url);

	const restfulCmd = req.url.split('/');

	const address = restfulCmd[1]; // The contract address of interest
	console.log('address', address);
	const cmd = restfulCmd[2];
	console.log('cmd', cmd); 	// The command to run on it...

	if(cmd === 'totalsupply') {
		try {
			ts = await tools.getTotalSupply(address);
			res.send(ts);
		} catch(e) {
			console.log('Error', e);
			res.send(e);
		}
	} else if(cmd === 'verifyrewards') {
		try {
			const child = restfulCmd[3];
			console.log('child', child);

			const verified = await tools.verifyRewardContract(address, child);
                        let addonRet = await tools.setupAddonPrintingPress(address);

                        console.log("addonRet: ", addonRet);
                        addonRet = await tools.setupAddonPrintingPress(child);
                        console.log("addonRet: ", addonRet);
			res.send("verified");

		} catch(e) {
			console.log('Error', e);
			res.send(e);
		}
	}
	
	res.send();
});

// Listen to the App Engine-specified port, or 8080 otherwise
const server = app.listen(8089, () => {
	const PORT = server.address().port;
	console.log(`Server listening on port ${PORT}...`);

	console.log('portTmpFile', portTmpFile);
	tools.writeFile(portTmpFile, PORT);
});


//const fifo = require('fifo-read');

// Open the fifo for reading and writing
// The fifo is created by the server
// then we delete it after we are done
// as well as the tmp file.


function pidIsRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch(e) {
    return false;
  }
}

function doExit() {
	console.log('Exiting...');

	// Remove the tmp file
	fs.unlinkSync(portTmpFile);

	// Kill the curren process, parent is dead
	process.exit(0);
}

setInterval(() => {
        //console.log('-----   Send packet   -----');
        //fifoWs.write(`${new Date().toISOString()}`);
	if (!pidIsRunning(parentPid)) {
		console.log('Parent process is dead, exiting...');
		doExit();
	}

	//console.log('Parent process is alive, continuing...');
}, 10000);   // Exit oafter 10sec.
