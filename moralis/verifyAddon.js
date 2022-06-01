var tools = require('./tools');
const myArgs = process.argv.slice(2);
const _contract = myArgs[0];
const _addon = myArgs[1];
const _onOff = myArgs[2];

const onOff = _onOff == "true" ? true : false;

async function doit() {

        try {
                // Read the file's string contents directly into the contractid
                const ret = await tools.verifyAddon(_contract, _addon, onOff)
        } catch (e) {
                console.log('error calling verifyAddon: ',  e);
                return;
        }
}

doit();

