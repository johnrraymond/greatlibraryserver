var tools = require('./tools');
const myArgs = process.argv.slice(2);
const _NBT = myArgs[0];
const _rightTokenId = myArgs[1];
const _leftTokenId = myArgs[2];
const _closeTime = myArgs[3];

async function doit() {
	try {
		//function newContest(address _NBT, uint256 _rightTokenId, uint256 _leftTokenId, uint256 _closeTime) public returns(uint256) {
		await tools.newContest(_NBT, _rightTokenId, _leftTokenId, _closeTime);
	} catch (e) {
		console.log("failed to make new contest: ", e);
	}

}

doit();
