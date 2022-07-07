var tools = require('./tools');

const myArgs = process.argv.slice(2);

async function doit() {
	const res = await tools.recoverXMTSPFromCC(0);
	console.log("res: ", res);
}

doit();
