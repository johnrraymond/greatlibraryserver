const tools = require('./tools.js');
const myEnv = require('dotenv');
console.log(myEnv);
require('dotenv').config({ path: '/home/john/bakerydemo/.env',  override: true, debug: true });

const myArgs = process.argv.slice(2);
const txtFile = myArgs[0];
const fullTxt = tools.readFile(txtFile);
const datamine = myArgs[1];

// Split the text into an array of lines
const sections = fullTxt.split('[?]');

// For each section of text in the array
// We want to 1) Run the text through the johndown parser
// 2) save the result to a file per section

// johndown is a type of markdown
// For each section of text in the array
for (let i = 1; i < 3; i++){ // sections.length; i++) {

	const lines = sections[i].split('\n');
	const title = lines[0];

	let text = '<h3>title</h3>';
	for (let j = 1; j < lines.length; j++) {
		text += lines[j] + '<p>\n';
	}

	const div = "<div class='johndown-section'>" + text + "</div>";

  	//tools.writeFile(`/mnt/media_dir/${datamine}$/jrre-index.html.nft/section.${i}`, div);
	console.log(div);
}
