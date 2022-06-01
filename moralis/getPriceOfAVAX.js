const tools = require('./tools');
const myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);


async function doit() {
	try {
		const price = await tools.priceOfAVAX();
		console.log('price: ', price);
	} catch (e) {
		console.log('Error: ', e);
	}
			
}
doit();
