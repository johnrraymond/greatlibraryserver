var tools = require('./tools');
const myArgs = process.argv.slice(2);
const _meme = myArgs[0];


async function doit() {

        try {
                const ret = await tools.newCultureCoinSeed(_meme);
		console.log("ret: ", ret);

        } catch (e) {
                console.log('error calling tools.newCultureCoinSeed: ',  e);
                return;
        }
}

doit();

