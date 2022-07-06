var tools = require('./tools');

const myArgs = process.argv.slice(2);

async function doit() {
	const res = await tools.testRecoverXMTSPFromCC(0);
	console.log("res: ", res);
}

doit();
