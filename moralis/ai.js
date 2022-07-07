const tools = require('./tools.js');
const myEnv = require('dotenv');
console.log(myEnv);
require('dotenv').config({ path: '/home/john/bakerydemo/.env',  override: true, debug: true });

const myArgs = process.argv.slice(2);
const myPromptFile = myArgs[0];
const myPrompt = tools.readFile(myPromptFile);

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getRewritePhase1(myPrompt) {
	console.log("getRewritePhase1: ", myPrompt);

	try {
		const response = await openai.createCompletion("text-davinci-001", {
			prompt: myPrompt,
  			max_tokens: 657,
			temperature: 0.0
		});

		//console.log(response.data);
		return response.data.choices[0].text;
	} catch (err) {
		console.log("Error: ", err);
	}

}


async function doit() {
	const output = await getRewritePhase1(myPrompt);
	console.log(output);

	//save output to file
	tools.writeFile(myPromptFile + ".response", output);
}

doit();

module.exports = {
	getRewritePhase1: getRewritePhase1
};
