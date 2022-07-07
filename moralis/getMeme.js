var tools = require('./tools');
const myArgs = process.argv.slice(2);
const contractid = myArgs[0];
const meme = myArgs[1];


async function doit() {

	const coin = await tools.getMeme(meme);

}

doit();
