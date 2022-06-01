const tools = require('./tools.js');
const myEnv = require('dotenv');
console.log(myEnv);
require('dotenv').config({ path: '/home/john/bakerydemo/.env',  override: true, debug: true });

const myArgs = process.argv.slice(2);
const myPrompt = myArgs[0];


const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getBENResponse(myPrompt) {
	console.log("getBENResponse");
	const response = await openai.createCompletion("text-davinci-001", {
                //prompt: "You are an cat named BEN stuck in a fantasy story who always stays in character. What do you say why someone says: " + myPrompt "(Remember you are BEN the cat.)",
		prompt: "You are an cat named BEN stuck in a fantasy story. What do you say why someone says: '" + myPrompt + "' Now stay in character and in active voice:",
  		max_tokens: 20,
	});

	//console.log(response.data);
	return response.data.choices[0].text;
}

async function getContentFilterResponse(fromBEN) {
	console.log("getContentFilterResponse");
	console.log(fromBEN);
	const resp = await openai.createCompletion("content-filter-alpha", 
		{
			prompt: "<|endoftext|>" + fromBEN + "\n--\nLabel:", 
			temperature: 0, max_tokens: 1, top_p: 0, logprobs: 10
		}
	);
	//console.log(resp);
	//console.log(resp.data);
	//console.log(resp.data.choices);
	//console.log(resp.data.choices[0].logprobs);
	console.log("logprobs:", resp.data.choices[0].logprobs);

	console.log("label:", resp.data.choices[0].text);

	const label = resp.data.choices[0].text;
	if (label == "2") {
		// Toxic: That's a bad kitty
		return false;
	} else { // Else not toxic
		return true;
	}

}

const benCurLocationFile = "/tmp/benCurLocation.txt";

async function getWork(curLoc) {
	console.log("getWork");

	const work = tools.getBENWork(curLoc);
	//console.log(work);

	return work;
}

async function getCurrentLocation() {

	try {
		return await tools.readFile(benCurLocationFile);
	} catch (err) {
		console.log("Error reading current location file: " + err);
		return 0;
	}
}


async function addResponse(NBT, tokenId, text, response) {
	// . Pack the data into the 256 byte buffer
	// . Append the buffer to the file
	// . Close the file
	
	
	// Pack the data into the 256 byte buffer
	const buffer = Buffer.from(" ".repeat(256));
	const data = NBT + ":" + tokenId + ":" + text + ":" + response;
	buffer.write(data, 0, data.length, 'utf8');

	// Append the buffer to the file
	await tools.appendFile("/mnt/media_dir/GBOS/jrre-index.html", buffer);
}

async function getSafeResponse(myPrompt) {
	console.log("getSafeResponse");
        for(i=0; i<3; i++) {
                let benResp = await getBENResponse(myPrompt);
                console.log(benResp);

                const benFilterResp = await getContentFilterResponse(benResp);
                console.log(benFilterResp);
                if (benFilterResp == false) {
                        console.log("Toxic response");
                } else {
                        console.log("Not toxic response");
			return benResp;
                }
        }
	return "MEOW!";
}



async function doit() {

	const benResp = await getSafeResponse(myPrompt);


	while(true) {
		let curLoc = await getCurrentLocation();
		console.log(curLoc);
		
		const work = await getWork(curLoc);
		//console.log(work);
		

		for(i=0; i<work.length; i++) {

			tokenId = work[i].get("tokenId");
			console.log(tokenId);

			text = work[i].get("prompt");
			console.log(text);

			NBT = work[i].get("NBT");
			console.log(NBT);

			value = work[i].get("value");
			console.log(value);

			let response = await getSafeResponse(text);
			console.log(response);


			await addResponse(NBT, tokenId, text, response);
		}

		await tools.writeFile(benCurLocationFile, (Number(curLoc) + Number(work.length)));
		await tools.sleep(4000);
	}
}

doit();
