var tools = require('./tools');

const myArgs = process.argv.slice(2);

async function doit() {
	libraryNonce = await tools.cloudRun("getLibraryNonce", {});
	console.log("libraryNonce: ", libraryNonce);

}

doit();
