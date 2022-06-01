var tools = require('./tools');
const myArgs = process.argv.slice(2);
const hostContact = myArgs[0];
const rewardContract = myArgs[1];

async function doit() {
	try {
		await tools.verifyRewardContract(hostContact, rewardContract);
	} catch (e) {
		console.log("verifications failed: ", e);
	}
if(true){
	try {	// FIXME:: This whole process is a waste of money right now... Should only do once...
        	let addonRet = await tools.setupAddonPrintingPress(hostContact);
               	console.log("addonRet: ", addonRet);
        	addonRet = await tools.setupAddonPrintingPress(rewardContract);
               	console.log("addonRet: ", addonRet);
       	} catch(e) {
        	console.log("Error adding on addon: ", e);
        }
} //FALSE

}

doit();
