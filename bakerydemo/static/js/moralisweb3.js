const myKey = 0;
Moralis.start({ serverUrl, appId, myKey });

//const baseNetwork = "avalanche testnet";
//const baseNetwork = "mumbai";
//const baseNetwork = "polygon";
//const baseNetwork = "bsc";
//const baseNetwork = "bsc testnet";

const appHeaderContainer = document.getElementById("app-header-btns");
const contentContainer = document.getElementById("content");

async function logOut() {
	await Moralis.User.logOut();
	render();
	console.log("logged out. User:", Moralis.User.current());
}

async function doBookTradableAuthenticate(withnonce) {
	// Preping nonce.

	let libraryNonce = 0;
	try {
                libraryNonce = await Moralis.Cloud.run("getLibraryNonce", {});
		console.log("libraryNonce:", libraryNonce);
	} catch (error) {
		console.log("using default nonce of 0 because of error:", error);
		
	}

	// Asking for signature...
	console.log("Asking for signature...");
	return Moralis.authenticate({signingMessage: "" + libraryNonce + " Great Library \n" + datamine + ": Connect to begin your journey"}); // 
}

async function signBookForFans() {
	var markup = document.documentElement.innerHTML;
	//console.log("markup:", markup);
	return Moralis.authenticate({signingMessage: markup});
}

async function loginWithMetaMask() {
	//document.body.style.backgroundImage = "url('/art/paper.jpg)";

	console.log("loginWithMetaMask");

	try {
		const user = await doBookTradableAuthenticate();
		console.log(user);
	} catch (error) {
		console.log(error);
		alert("Error while authenticating. Please see your wallet. Console says:" + JSON.stringify(error));
	}

	//const balances = await Moralis.Web3API.account.getTokenBalances();
	//console.log("balances:", balances);
	
	render();
}

async function loginWithEmail(isSignUp) {
	const email = document.getElementById("email").value;
	const pass = document.getElementById("pass").value;

	if (!email || !pass) {
		alert("please provide both email and password");
		return;
	}

	try {
		if (isSignUp) {
			// when using email for username
			// assign it to the username property
			const user = new Moralis.User();
			user.set("username", email);
			user.set("password", pass);

			await user.signUp();
		} else {
			await Moralis.User.logIn(email, pass);
		}

		render();
	} catch (error) {
		console.log(error);
		alert("invalid username or password");
	}
}

function listenForAccountChange() {
	/*
	Moralis.onAccountsChanged(async function (accounts) {
	console.log("account changed:", accounts);
	const user = Moralis.User.current();
	if (!user || !accounts.length) {
		// not logged in
		return;
	}

	try {
		const address = accounts[0];
		if (addressAlreadyLinked(user, address)) {
		console.log(`address ${getAddressTxt(address)} already linked`);
		return;
		}

		const confirmed = confirm("Link this address to your account?");
		if (confirmed) {
		await Moralis.link(address);
		alert("Address added!");
		render();
		}
	} catch (error) {
		if (error.message.includes("already used")) {
		alert("That address is already linked to another profile!");
		} else {
		console.error(error);
		alert("Error while linking. See the console.");
		}
	}
	});
	*/
}

function addressAlreadyLinked(user, address) {
	return user && address && user.attributes.accounts && user.attributes.accounts.includes(address);
}

async function onUnlinkAddress(event) {
	event.preventDefault();
	try {
	const address = event.target.dataset.addr;
	console.log("onUnlinkAddress:: addr:", address);

	const confirmed = confirm("Are you sure you want to remove this address?");
	if (!confirmed) {
		return;
	}

	await Moralis.unlink(address);
	alert("Address removed from profile!");
	render();
	} catch (error) {
	console.error(error);
	alert("Error unlinking address. See console.");
	}
}


function renderHeader() {
	const user = Moralis.User.current();
	if (!user) {
	return;
	}
	// show the logout, refresh buttons if user logged in
	appHeaderContainer.innerHTML = `<span></span><div><span>&nbsp;</span>
<span style="color:#c73;"> </span>
		<button id="btn-logout"  style="background-image:linear-gradient(to bottom right, #ffd, #ffb);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:gray;
  background: transparent;
  transition:0.1s;"

>Disconnect</button> &nbsp;
	<button type="button" id="btn-buy-cc" onclick=buyculturecoin(event) style="

  background-image:linear-gradient(to bottom right, #fea, #e95);
  border-radius:15px;
  color: blue;
  transition:0.1s;"
>Buy</button>
        <button type="button" id="btn-sell-cc" onclick=sellculturecoin(event) style="
  background-image:linear-gradient(to bottom right, #fea, #e95);
  border-radius:15px;
  color: blue;
  transition:0.1s;"
>Sell</button>
        <button type="button" id="btn-sell-cc" onclick="earnculturecoin(event)" style="
	  background-image:linear-gradient(to bottom right, #fea, #e95);
  border-radius:15px;
  color: blue;
  transition:0.1s;"

>Stake</button>
        <button type="button" id="btn-more-cc" onclick="alert('Use the + below for withdraw and other options.')" style="
          background-image:linear-gradient(to bottom right, #fea, #e95);
  border-radius:15px;
  color: blue;
  transition:0.1s;"
>CC</button>


	<span id="ccbalancespan" onclick="updateccbalance1(event)"> : $CC loading...</span>
<span/>

<!-- button id="btn-savebook"  style="background-image:linear-gradient(to bottom right, #008, #004);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"

>Right Click to Save As for free!</button-->

</div>
	`;
}

async function hasStake(_staker) {
        const provider = await Moralis.enableWeb3();
        const sendOptions = {
                contractAddress: cultureCoinAddress,
                functionName: "hasStake",
                abi: CC_abi,
                params: {
                        _staker: _staker
                }
        };

        const transactionObj = await Moralis.executeFunction(sendOptions);
        console.log(transactionObj);
	return transactionObj;
}

async function getRewardRate() {
	const provider = await Moralis.enableWeb3();
	const sendOptions = {
		contractAddress: cultureCoinAddress,
		functionName: "getRewardPerHour",
		abi: CC_abi,
		params: {
		}
	};

	const transactionObj = await Moralis.executeFunction(sendOptions);
	console.log(transactionObj);
	return transactionObj;
}

async function earnculturecoin(event) {

	const user = Moralis.User.current();

	const curStake = await hasStake(user.attributes.ethAddress);
	console.log("curStake:", curStake);

	const rewardRate = await getRewardRate();
	console.log("Percentage Rate per Hour:", 1.0 / rewardRate * 100);
	const percentRate = 1.0 / rewardRate * 100;

	//alert("You already have " + curStake + " CC staked and\nyou only earn " + percentRate + "% CC per hour.");
	alert("attempting to stake .01 CC");

    	const _amount = Moralis.Units.ETH("0.01");

    	const provider = await Moralis.enableWeb3();
    	const sendOptions = {
        	contractAddress: cultureCoinAddress,
        	functionName: "stake",
        	abi: CC_abi,
        	params: {
                	_amount : _amount
        	}
    	};

    	const transactionObj = await Moralis.executeFunction(sendOptions);
    	console.log(transactionObj);
	return transactionObj;
}


async function DELME() {

	const priceEncoded = Moralis.Units.ETH("0.09");
        //const priceETH = Moralis.Units.ETH(amount);
        const priceHexString = BigInt(priceETH).toString(16);
        priceEncoded = priceHexString;


        const _name = await functionNameFromName(cultureCoinAddress, "stake");
        //const _name = "sane";
        //const _name = "pay";

        const errorMsg = "earnculturecoin";

	//Argument one.
	const _meme = "_amount";
	const _type = "uint256";

        if(true) {
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({ name: _name, type: "function",inputs: [{type: _type, "name" : _meme}] }, []);
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const result = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log("Sanity check passed? for ", _name);
                console.log(result);

                const res2 = await web3.eth.getTransaction(result);
                console.log("sane: ", _name, res2);

                //alert("Do not click this button until the transaction is mined.");

                web3.eth.getTransactionReceipt(result, function(error, result){
                        console.log("Debug Sane: ", result);
                        console.log("Debug Insane (" + errorMsg + "): ", error);

                        if (!result && !errorMsg) {
                                console.log("Mental health check is authorized and a timer should be set to check in a few minutes or seconds as the mining speed goes up or down.");

                        }

                        //debugDecode(result);
                        // emit Your Code Here .... //
                        // :::::::::::::::::::::::: //
                        // .... Your Code Here .... //
                        //if (result.logs.length == 2) { // Sanity check :::: success :: see MUMBAI MEME CODE :::: 2 means all paths were covered. SUCCESSFULLY
                        // fallback // alert("result.logs.length: " + result.logs.length);
                });
        }

}

async function getBENString() {
	const queryAll = new Moralis.Query(benPettingsTable);

        queryAll.equalTo("NBT", bookmarkcontractid);
        const data = await queryAll.find();

        console.log("queryAll" + JSON.stringify(queryAll));
        console.log(data);

	let outstring = '<div id="ben-pettings">';
        for (i=0;i<data.length;i++){
                //console.log(data[i].attributes);

                //console.log(data[i].get("hostContract"));
                //console.log(contractid);

                myprompt = data[i].get("prompt");
		console.log("myprompt: " + myprompt);
		tokenId = data[i].get("tokenId");
		console.log("tokenId: " + tokenId);

                //console.log("raw price: " + price);
                value = web3.utils.fromWei(data[i].get("value"));
        }
	
	try {
		//outstring += data[0].get("prompt") + " " + web3.utils.fromWei(data[0].get("value")) + "  " + data[0].get("tokenId");
		outstring += myprompt + " " + value + "  " + tokenId;
	} catch (e) {
		console.log("Error: " + e);
	}
	outstring += '</div>';
	return outstring;

}

async function updateccbalance1(event) {
	try {
		console.log("updateccbalance1");
		await forceNetwork();

		await updateccbalance(event, true);
	} catch (e) {
		console.log("Error: " + e);
		alert("Error: " + e);
	}
}
async function updateccbalance(event, oneshot) {
	//console.log("updateccbalance");
	try {
		const user = Moralis.User.current();
		_address = user.attributes.ethAddress;

		await Moralis.enableWeb3();

		//console.log("updateccbalance:: user:", user);
		//console.log("updateccbalance:: _address:", _address);
		const options = {
  			chain: baseNetwork,
  			address: cultureCoinAddress,
  			function_name: "balanceOf",
  			abi: CC_abi,
  			params: {account: _address}
		};
		const balanceOf = await Moralis.Web3API.native.runContractFunction(options);
		//console.log("updateccbalance:: balanceOf:", balanceOf);
                const ccBalance = web3.utils.fromWei(balanceOf);

		let benString = "";
		try {
			const benString = await getBENString();
		} catch (e) {
			console.log("Error: " + e);
		}

		document.getElementById("ccbalancespan").innerHTML = ccBalance + `<br><br> <span 

>You are now live with The Great Library. <img src="/static/img/loading.svg"></span> <p>
 <ul id="hexGrid">
      <li class="hex" id="heroMint" onclick="buyculturecoin0(event)">
        <div class="hexIn">
          <a class="hexLink" href="#">
            <img src="https://live.staticflickr.com/3020/2959483716_1f92f554cb_b.jpg" alt="Your have no Culture Coin" />
            <h1>Begin</h1>
            <p>Begin by buying your first Culture Coin...</p>
          </a>
        </div>
      </li>
      <li class="hex">
        <div class="hexIn">
          <a class="hexLink" href="#" onclick="minthero(1, 75, 1000000000000000)">
            <img src="https://live.staticflickr.com/2778/5707532563_ec0f05cd7a_c.jpg" alt="Like a warrior." />
            <h1>Warrior</h1>
            <p>A champion for the cause and when cursed with a deathwish cannot be reasoned with.</p>
          </a>
        </div>
      </li>
      <li class="hex">
        <div class="hexIn">
	<!-- heroMint(uint256 _tokenId, address _to, int _class, uint256 _amount) -->
          <a class="hexLink" href="#" onclick="minthero(1, 15, 1000000000000000)">
            <img src="https://live.staticflickr.com/7827/47160510071_436a58e5cb_b.jpg" alt="Like mage." />
            <h1>Arcanist</h1>
            <p>Creatures of light and magic.</p>
          </a>
        </div>
      </li>
      <li class="hex">
        <div class="hexIn">
          <a class="hexLink" href="#" onclick="minthero(1, 135, 1000000000000000)">
            <img src="https://live.staticflickr.com/4576/38483830811_4b2fc8e2c5_c.jpg" alt="Like shaman." />
            <h1>Shaman</h1>
            <p>These wise women and men channel their knowledge in the world using every tool at their disposal.</p>
          </a>
        </div>
      </li>
      <li class="hex">
        <div class="hexIn">
          <a class="hexLink" href="#" onclick="minthero(1, 45, 1000000000000000)">
            <img src="https://live.staticflickr.com/3646/3330877545_8b291ec6c0_h.jpg" alt="Like driud." />
            <h1>Druid</h1>
            <p>Men-like creatures fueled by primal energy that is yet to be well understood.</p>
          </a>
        </div>
      </li>
      <li class="hex">
        <div class="hexIn">
          <a class="hexLink" href="#" onclick="minthero(1, 105, 1000000000000000)">
            <img src="https://live.staticflickr.com/2183/2195953420_a675698b14_b.jpg" alt="Like warlock." />
            <h1>Warlock</h1>
            <p>The world does not disappear when we close our eyes.</p>
          </a>
        </div>
      </li>

      <li class="hex">
        <div class="hexIn">
          <a class="hexLink" href="#" onclick="minthero(1, 1, 1000000000000000)">
            <img src="https://live.staticflickr.com/4531/38252015082_29122ef6ae_h.jpg" alt="Like priest." />
            <h1>Priest</h1>
            <p>Studying how to save the reckless, when they aren't activly saving them.</p>
          </a>
        </div>
      </li>
      <li class="hex">
        <div class="hexIn">
          <a class="hexLink" href="#" onclick="alert('Coming soon!')">
            <img src="https://farm3.staticflickr.com/2827/10384422264_d9c7299146.jpg" alt="Like priest." />
            <h1>Enter</h1>
            <p>Play the game...</p>
          </a>
        </div>
      </li>
</ul>

` + benString;

	} catch (error) {
		try {
			document.getElementById("ccbalancespan").innerHTML = "Check wallet..."; 
			//refreshBook(event);
		} catch (error) {
			//console.log(error);
		}
		console.log(error);
		//alert("Error updating balance. See console.");
	}

	if(!oneshot) {
		window.setTimeout(updateccbalance, 50000);
	}
}

function saveBook(event) {
}

function refreshBook(event) {
	console.log("refreshBook");
	//window.location.reload();
	//return redirect('/art/?' + 'type=book&curserial_num=' + str(bmsupply-1) + '&datamine=' + datamine)
	const myhref = '/art/?type=default&datamine=' + datamine;
	//window.location.href = href;
	document.location.href = myhref;

}

//downloadURI("data:,Hello%2C%20World!", "helloWorld.txt"); // http://jsfiddle.net/ARTsinn/Ezx5m/
function savebookhere() {
	console.log("savebookhere");
    	var link = document.createElement("a");
    	link.download = datamine + ".html";
    	link.href = '/art/?type=default&download=true&datamine=' + datamine;
    	link.click();

}

function buildLibraryComponent() {
	return `
                <button id="btn-refresh" style="
		background-image:linear-gradient(to bottom right, #631, #000);
  outline:#d81 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#e95;
  transition:0.1s;"

  onclick="document.location.href='http://greatlibrary.io/art/?type=default&datamine=' + (function(){ return datamine;})();"

 >Refresh</button>
               <button id="btn-refresh" style="
	       background-image:linear-gradient(to bottom right, #631, #000);
  outline:#d81 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#e95;
  transition:0.1s;"

  onclick="savebookhere()"

 >Save Book</button>

               <button type="button" id="btn-read-book" onclick=onReadBook(event)  style="background-image:linear-gradient(to bottom right, #631, #000);
  outline:#d81 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#e95;
  transition:0.1s;"

>Read Book</button>

               <button type="button" id="btn-audio-book" onclicka'=alert('Coming soon. --jrr')"  style="background-image:linear-gradient(to bottom right, #631, #000);
  outline:#d81 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#e95;
  transition:0.1s;"

>Audio Book</button>


	`;
}

function buildLoginComponent(isSignUp = false) {
	const btnSignUp = isSignUp ? "" : `<button type="button" id="btn-login-email-signup"  style="background-image:linear-gradient(to bottom right, #840, #420);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"

>Login with Name and Pass</button>`;

	return `
		<button id="btn-login-metamask"  style="background-image:linear-gradient(to bottom right, #840, #420);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"

>Connect</button>
		<!-- hr/>
		<div id="frm-login">
		<div class="form-group">
			<label for="email">Name: </label>
			<input type="text" id="email" name="email"/>
		</div>
		<div class="form-group">
			<label for="pass">Pass: </label>
			<input type="password" id="pass" name="pass"/>
		</div>
		<button type="button" id="btn-login-email" type="button"  style="background-image:linear-gradient(to bottom right, #840, #420);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"

>Submit</button>
		${btnSignUp}
		</div -->
	</div>
	`;
}

function renderLogin(isSignUp) {
	contentContainer.innerHTML = buildLibraryComponent() + buildLoginComponent(isSignUp);
	document.getElementById("btn-login-metamask").onclick = loginWithMetaMask;
	/* document.getElementById("btn-login-email").onclick = function () {
		loginWithEmail(isSignUp);
	}; */

	if (!isSignUp) {
		document.getElementById("btn-login-email-signup").onclick = function () {
			loginWithEmail(true);
		};
	}
}

function getAddressTxt(address) {
	return `${address}`; // `${address.substr(0, 4)}...${address.substr(address.length - 4, address.length)}`;
}

document.body.style.backgroundImage = "url('/art/paper.jpg)";

function hideshow(event) {
	//document.body.style.backgroundImage = "url('/art/paper.jpg)";
	$("#yourMoralisDiv").toggle();
}
function hideshowX(event) {
	$("#xmtsp").toggle();
}

function buildProfileComponent(user) {
	//background-image:linear-gradient(to bottom right, #ffd, #ffb);
  	//background: transparent;
	//
	
	const bookmarkImageUrl = "/art/?type=bookmark&curserial_num=" + cur_serial + "&datamine=" + datamine;
	console.log("bookmarkImageUrl:", bookmarkImageUrl);
	
	return `
	<div class="container"  style="
  background-image: url('` + bookmarkImageUrl + `');
  background-color: #987;
  background-size: cover;

  background-blend-mode: lighten;
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:black;
  transition:0.1s;"

> <!-- https://replit.com/@PixelRunner/Leather-in-css -->
		<!-- button onClick="hideshow(event)"  style="background-image:linear-gradient(to bottom right, #ffd, #ffb);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#631;
  transition:0.1s;"

>Profile...</button --> ` 

		+ buildLibraryComponent() +

` <button type="button" id="btn-auth" style="background-image:linear-gradient(to bottom right, #800, #400);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;
  display: none;
  "
>Donate</button>

		<div>

		<div id="yourMoralisDiv" style="background-image:linear-gradient(to bottom right, #a62, #642);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"


>
		<div class="form-group">
			<label for="name" style="color:black">Your library name is: </label>
			<input type="text" id="name" value="${user.attributes.username || ""}" style="background-image:linear-gradient(to bottom right, #eee, #bba);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color: white;
  transition:0.1s;"

/>
			<button onClick="hideshow(event)" style="background-image:linear-gradient(to bottom right, #840, #420);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"

>Click here to begin reading this book.</button> <span style="color:black">Private notes below:</span>
		</div>
		<div class="form-group">
			<textarea
			id="bio"
			name="bio"
			rows="6"
			cols="45"
			maxlength="200"  style="background-image:linear-gradient(to bottom right, #edd, #dba);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color: black;
  transition:0.1s;"

>${user.attributes.bio || ""}</textarea>
		</div>
		<div id="profile-set-pass">
			${buildSetPassComponent()}
		</div>
		${buildAddrListComponent(user)}
		<button class="mt" type="button" id="btn-profile-save" style="background-image:linear-gradient(to bottom right, #840, #420);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"

>Save Library Card</button>


		<div id="NFTLists" class="container">
		</div>
		</div> 

		<div id="deauth-container" class="container"> 

			<!-- button type="button" id="btn-donate"  style="background-image:linear-gradient(to bottom right, #660, #462);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;

  color:white;
  transition:0.1s;"

>Donate your time to the effort!</button -->

			<button type="button" id="btn-hardbound"   style="background-image:linear-gradient(to bottom right,  #a65, #454);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#ea5;
  transition:0.1s;"

>Buy Hardcopy</button>

			<button type="button" id="btn-buy-bmrk" onclick=onBuyCurBookmark(event)  style="
background-image:linear-gradient(to bottom right,  #a65, #454);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#ea5;
  transition:0.1s;"

>Buy Bookmark</button>

			<button type="button" id="btn-buy-book" onclick=onBuyBook(event)  style="
background-image:linear-gradient(to bottom right,  #a65, #454);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#ea5;
  transition:0.1s;"

>Buy Book</button>

		</div>

		<button onClick="hideshowX(event)" style="background-image:linear-gradient(to bottom right, #fea, #e95);
  border-radius:15px;
  color: blue;
  transition:0.1s;"

>+</button>
Contest <span id=contestspan>1</span>:
                <button id="guLeftButton" onClick="guLeftLarger(event)" style="background-image:linear-gradient(to bottom right, #fea, #e95);
  border-radius:15px;
  color: #a4a;
  transition:0.1s;"

>Bookmark 2</button>

(vs)

                <button id="guRightButton" onClick="guRightLarger(event)" style="background-image:linear-gradient(to bottom right, #fea, #e95);
  border-radius:15px;
  color: #494;
  transition:0.1s;"

>Bookmark 1</button>

		<div id="xmtsp">
		<button type="button" id="btn-mint-bmrk" onclick=mintnextbookmark(event)  style="background-image:linear-gradient(to bottom right, #bdb, #9b9);
  outline:gray dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #4a4, inset -1px -1px 2px black;
  color:black;
  transition:0.1s;"

>Mint a Bookmark</button>
		<button type="button" id="btn-mint-book" onclick=mintbook(event) style="background-image:linear-gradient(to bottom right,  #bdb, #9b9);
  outline:gray dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #4d4, inset -1px -1px 2px black;
  color:black;
  transition:0.1s;"

>Mint a Book</button>
		<button type="button" id="btn-mint-hard" onclick=minthardbound(event) style="background-image:linear-gradient(to bottom right,  #bdb, #9b9);
  outline:gray dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;                                                                                                                                                                                                 box-shadow:inset 1px 1px 2px #4d4, inset -1px -1px 2px black;                                                                                                                                                 color:black;
  transition:0.1s;"

>Mint a Hardbound NFT</button>


		<button type="button" id="btn-get-paid" onclick=getpaid(event)  style="background-image:linear-gradient(to bottom right,  #dfb, #8a8);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#d85;
  transition:0.1s;"

>Get Paid</button>
		<button type="button" id="btn-pay-press" onclick=paypress(event)  style="background-image:linear-gradient(to bottom right,  #dfb, #8a8);
  outline:#e95 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #e95, inset -1px -1px 2px black;
  color:#d85;
  transition:0.1s;"


>Pay Press</button>

		<br>
        	Book: <input type="text" id="bookprice" name="bookprice" value="unknown" size="6" onclick="loadprice(event, 'book')" onkeypress="setprice(event, 'book')" >
        		<input type="text" id="bookfrom" name="bookfrom" value="unknown" size="6" onclick="loadfrom(event, 'book')" onkeypress="setfrom(event, 'book')" >
        		<input type="text" id="bookmax" name="bookmax" value="unknown" size="6" onclick="loadmax(event, 'book')" onkeypress="setmax(event, 'book')" >
			<br>
        	BMark: <input type="text" id="bookmarkprice" name="bookmarkprice" value="unknown" size="6" onclick="loadprice(event, 'bookmark')" onkeypress="setprice(event, 'bookmark')"> 
        		<input type="text" id="bookmarkfrom" name="bookmarkfrom" value="unknown" size="6" onclick="loadfrom(event, 'bookmark')" onkeypress="setfrom(event, 'bookmark')" >
        		<input type="text" id="bookmarkmax" name="bookmarkmax" value="unknown" size="6" onclick="loadmax(event, 'bookmark')" onkeypress="setmax(event, 'bookmark')" >
			<br>
		Hard: <input type="text" id="hardboundprice" name="hardboundprice" value="unknown" size="6" onclick="loadprice(event, 'hardbound')" onkeypress="setprice(event, 'hardbound')">
        		<input type="text" id="hardboundfrom" name="hardboundfrom" value="unknown" size="6" onclick="loadfrom(event, 'hardbound')" onkeypress="setfrom(event, 'hardbound')" >
        		<input type="text" id="hardboundmax" name="hardboundmax" value="unknown" size="6" onclick="loadmax(event, 'hardbound')" onkeypress="setmax(event, 'hardbound')" >

		</div>


		<div id="daedalusDiv">
		</div>
		</div>


	</div>

	`;
}

async function getDefaultMax(hostContract) {
        const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
        const defaultMax = await NBTcontract.methods.maxmint().call();
        console.log("defaultMax:" + defaultMax);
        return defaultMax;
}

async function loadmax(event, _which) {
        const _textBox = document.getElementById(_which + "max");
        const _contractid = eval(_which+"contractid");
        console.log("_contractid: ", _contractid);

        if(_textBox.value === "unknown") {
                const _max = await getDefaultMax(_contractid);
                _textBox.value = _max;
        }
}

async function setmax(event, _which) {
        const user = Moralis.User.current();

        const _textBox = document.getElementById(_which + "max");
        const _contractid = eval(_which+"contractid");
        console.log("_contractid: ", _contractid);

        if(event.key === 'Enter') {
                const _max = _textBox.value;
                console.log("Setting max: ", _max);
                const contract = new web3.eth.Contract(NBT_abi, _contractid);
                await contract.methods.setMaxMint(_max).send({from: user.attributes.ethAddress});
        }

}


async function getDefaultFrom(hostContract) {
        const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
        const defaultFrom = await NBTcontract.methods.getDefaultFrom().call();
        console.log("defaultFrom:" + defaultFrom);
        return defaultFrom;
}

async function loadfrom(event, _which) {
        const _textBox = document.getElementById(_which + "from");
        const _contractid = eval(_which+"contractid");
        console.log("_contractid: ", _contractid);

	if(_textBox.value === "unknown") {
                const _from = await getDefaultFrom(_contractid);
                _textBox.value = _from;
        }
}

async function setfrom(event, _which) {
        const user = Moralis.User.current();

        const _textBox = document.getElementById(_which + "from");
        const _contractid = eval(_which+"contractid");
        console.log("_contractid: ", _contractid);

        if(event.key === 'Enter') {
                const _from = _textBox.value;
                console.log("Setting from: ", _from);
                const contract = new web3.eth.Contract(NBT_abi, _contractid);
                await contract.methods.setDefaultFrom(_from).send({from: user.attributes.ethAddress});
        }

}

async function setprice(event, _which) {
	const user = Moralis.User.current();

	const _textBox = document.getElementById(_which + "price");
	const _contractid = eval(_which+"contractid");
	console.log("_contractid: ", _contractid);

	if(event.key === 'Enter') {
		const _price = _textBox.value;
		console.log("Setting price: ", _price);
		const contract = new web3.eth.Contract(NBT_abi, _contractid);
		await contract.methods.setDefaultPrice(Moralis.Units.ETH(_price)).send({from: user.attributes.ethAddress});
	}

}

async function getDefaultPrice(hostContract) {
        const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
        const defaultPrice = await NBTcontract.methods.getDefaultPrice().call();
        console.log("defaultPrice:" + defaultPrice);
        return defaultPrice;
}

async function loadprice(event, _which) {
	const _textBox = document.getElementById(_which + "price");
	const _contractid = eval(_which+"contractid");
	console.log("_contractid: ", _contractid);

	if(_textBox.value === "unknown") {
		const _price = await getDefaultPrice(_contractid);
		_textBox.value = web3.utils.fromWei(_price);
	}
}

function buildAddrListComponent(user) {
	// add each address to the list
	let addressItems = "";
	if (user.attributes.accounts && user.attributes.accounts.length) {
	addressItems = user.attributes.accounts
		.map(function (account) {
		return `
			<button class="btn-addr btn-remove" type="button" data-addr="${account}"   style="background-image:linear-gradient(to bottom right, #a44, #b00);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:white;
  transition:0.1s;"

>&nbsp;X&nbsp;</button>
			${getAddressTxt(account)}
		`;
		})
		.join("");
	} else {
	// no linked addreses, add button to link new address
	addressItems = `
		<button class="btn-addr" type="button" id="btn-add-addr   style="background-image:linear-gradient(to bottom right, #eee, #eee);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:black;
  transition:0.1s;"

">+</button>
		Link
	`;
	}

	return `
	<span> ${addressItems} </spam>
	`;
}

function renderProfile(user) {
	contentContainer.innerHTML = buildProfileComponent(user);
	hideshow();
	hideshowX();
	document.getElementById("btn-profile-set-pass").onclick = onSetPassword;
	document.getElementById("btn-profile-save").onclick = onSaveProfile;
	//document.getElementById("btn-donate").onclick = onDonate;
	document.getElementById("btn-auth").onclick = onAuthenticate;
	document.getElementById("btn-hardbound").onclick = onbuyhardbound;
	//document.getElementById("btn-buy-bmrk").onclick = onBuyCurBookmark;
	//document.getElementById("btn-sell-bmrk").onclick = onSellBookmark;
	document.getElementById("btn-mint-bmrk").onclick = mintnextbookmark;
	document.querySelectorAll(".btn-remove").forEach(function (button) {
	button.onclick = onUnlinkAddress;
	});

	const btnAddAddress = document.getElementById("btn-add-addr");
	if (btnAddAddress) {
	btnAddAddress.onclick = onAddAddress;
	}
}

function onSetPassword(event) {
	const containerSetPass = document.getElementById("profile-set-pass");
	containerSetPass.innerHTML = buildSetPassComponent(true);
	document.getElementById("btn-save-pass").onclick = onSaveNewPassword;
	document.getElementById("btn-cancel-pass").onclick = onCancelNewPassword;
}

function buildSetPassComponent(showForm = false) {
	if (!showForm) {
	return `
		<span style="color:black">To login with pass:</span>
		<button type="button" id="btn-profile-set-pass"   style="background-image:linear-gradient(to bottom right, #eee, #eee);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:black;
  transition:0.1s;"

>Set Password</button>
	`;
	}

	return `
	<div class="set-password">
		<div class="form-group">
		<label for="pass">New Password</label>
		<input type="password" id="pass" autocomplete="off" />
		</div>
		<div class="form-group">
		<label for="confirm-pass">Confirm</label>
		<input type="password" id="confirm-pass" autocomplete="off" />
		</div>
		<button type="button" id="btn-save-pass"   style="background-image:linear-gradient(to bottom right, #eee, #eee);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:black;
  transition:0.1s;"

>Save Password</button>
		<button type="button" id="btn-cancel-pass"   style="background-image:linear-gradient(to bottom right, #eee, #eee);
  outline:#d44 dashed 1px;
  padding:10px;
  border-radius:10px;
  outline-offset:-3px;
  border: none;
  box-shadow:inset 1px 1px 2px #d44, inset -1px -1px 2px black;
  color:black;
  transition:0.1s;"

>Cancel</button>
	</div>
	`;
}

async function onSaveNewPassword(event) {
	event.preventDefault();
	const user = Moralis.User.current();

	try {
	// make sure new and confirmed password the same
	const newPass = document.getElementById("pass").value;
	const confirmPass = document.getElementById("confirm-pass").value;

	if (newPass !== confirmPass) {
		alert("passwords not equal");
		return;
	}

	user.setPassword(newPass);
	await user.save();
	alert("Password updated successfully!");

	render();
	} catch (error) {
	console.error(error);
	alert("Error while saving new password. See the console");
	}
}

function onCancelNewPassword() {
	const containerSetPass = document.getElementById("profile-set-pass");
	containerSetPass.innerHTML = buildSetPassComponent();
	document.getElementById("btn-profile-set-pass").onclick = onSetPassword;
}

async function onAddAddress() {
	console.log("onAddAddress");
	try {
		// enabling web3 will cause an account changed event
		// which is already subscribed to link on change so
		// just connecting Metamask will do what we want
		// (as long as the account is not currently connected)
		await Moralis.enableWeb3();
	} catch (error) {
		console.error(error);
		alert("Error while linking new address. See console");
	}
}

async function setDefaultFrom(hostContract, _address) {
	console.log("setDefaultFrom");

        const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
        await NBTcontract.methods.setDefaultFrom(1).send({from: _address, gas:10000000, gasPrice:web3.utils.toWei("100", "gwei")});
}

async function getOfferingId(contractid, tokenid) {
        const queryAll = new Moralis.Query(placedOfferingsTable);

        queryAll.equalTo("hostContract", contractid);
        queryAll.equalTo("tokenId", tokenid);

        const data = await queryAll.find();

        console.log("queryAll" + JSON.stringify(queryAll));
        console.log(data);

        price = "unknown";
        offeringId = "unknown";
        for (i=0;i<data.length;i++){
                //console.log(data[i].attributes);

                //console.log(data[i].get("hostContract"));
                //console.log(contractid);

                price = data[i].get("price");
                //console.log("raw price: " + price);

                price = web3.utils.fromWei(price);
	}

	return data[0].get("offeringId");
}

async function minthero(_tokenId, _class, _amount) {
	let user = await doBookTradableAuthenticate();
	const _to = user.attributes.ethAddress;
	const _address = user.attributes.ethAddress;

	const HEROS = new web3.eth.Contract(hero_abi, heroAddress);
	const ret = await HEROS.methods.heroMint(_tokenId, _to, _class, _amount).send({from: _address});

	console.log("mintHero: " + JSON.stringify(ret));
}

async function mintbook(event) {
        let user = await doBookTradableAuthenticate();
	_address = user.attributes.ethAddress;

        const NBTcontract = new web3.eth.Contract(NBT_abi,bookcontractid);

        const options = {
                chain: baseNetwork,
                contractAddress: bookcontractid,
                functionName: "mintTo",
                abi: NBT_abi,
                params: {_to: _address}
        };

        const result = await Moralis.executeFunction(options);
        console.log("result:", result);
}


async function minthardbound(event) {
        user = await doBookTradableAuthenticate();
        _address = user.attributes.ethAddress;

        const NBTcontract = new web3.eth.Contract(NBT_abi,bookcontractid);

        const options = {
                chain: baseNetwork,
                contractAddress: hardboundcontractid,
                functionName: "mintTo",
                abi: NBT_abi,
                params: {_to: _address}
        };

        const result = await Moralis.executeFunction(options);
        console.log("result:", result);
}


async function onReadBook(event) {
        user = await doBookTradableAuthenticate(true);

	console.log(user);

	_address = user.attributes.ethAddress;

        const moralisEth = user.get("authData").moralisEth;
	console.log("msg = " + moralisEth.data);
	console.log("sig = " + moralisEth.signature);

	const options = { chain: baseNetwork, address: _address, token_address: bookcontractid };
	const bookTokens = await Moralis.Web3API.account.getNFTsForContract(options);
	console.log(bookTokens);

	let tokenId = "0";
	let daedalusCookie = "";
	if (bookTokens.total == 0) {
		console.log("You don't have a book token. Seeing if you have a daedalus class token at: ", daedalusClassBoosterAddress);
		const options = { chain: baseNetwork, address: _address, token_address: daedalusClassBoosterAddress };
        	daedalusToken = await Moralis.Web3API.account.getNFTsForContract(options);
		console.log("your tokens are: ", daedalusToken);
		if (daedalusToken.total == 0) {
			alert("You don't have any tokens!");
		}
		daedalusCookie = "&daedalusToken=" + daedalusToken.result[0].token_id;
	} else {
		tokenId = bookTokens.result[0].token_id;
	}
	console.log("user owns tokenId: " + tokenId);
	console.log("daedalusCookie: " + daedalusCookie);

	//http://greatlibrary.io:9466/art/?type=book&curserial_num=21&datamine=MBMPGBRRR
	myhref = "/art/?type=book&msg=" + btoa(moralisEth.data) + "&sig=" + moralisEth.signature + "&datamine=" + datamine + "&tokenid=" + tokenId + "&curserial_num=42222" + daedalusCookie;
	console.log(myhref);

	window.top.location.href = myhref;
	//window.location.href = myhref;
}


async function getstakerate(event) {

	const rewardRate = await getRewardRate();

        console.log("Percentage Rate per Hour:", 1.0 / rewardRate * 100);
        const percentRate = 1.0 / rewardRate * 100;

	$("#stakerateid").val(percentRate);
}

async function setstakerate(event) {
	const cc = new web3.eth.Contract(CC_abi, cultureCoinAddress);

	const perHour = $("#stakerateid").val();

	const newRate = 1.0 / (perHour / 100);
	console.log("newRate: ", newRate);

	const user = await doBookTradableAuthenticate();
	const _address = user.attributes.ethAddress;
	cc.methods.setRewardPerHour(newRate).send({from: _address});
	//, gas:10000000, gasPrice:web3.utils.toWei("100", "gwei")});
}

async function paypress(event) {
	console.log("paypress");
        const user = Moralis.User.current();
	const _address = user.attributes.ethAddress;


	const cc = new web3.eth.Contract(CC_abi, cultureCoinAddress);
	const B = await cc.methods.B().call();
	console.log("Balance: " + web3.utils.fromWei(B));

        const press = new web3.eth.Contract(press_abi, printingPressAddress);
        const ret = await press.methods.addBalanceCC(_address, Moralis.Units.ETH(".01")).send({from: _address}); //, 
		//gasPrice:web3.utils.toWei("55", "gwei"), 
		//gas:8000000});
        //const ret = await press.methods.getBalance(_address).send({from: _address, gas:8000000});
	console.log("ret:", ret);
}


async function getpaid(event) {
        const user = Moralis.User.current();
        if (!user) {
                user = await doBookTradableAuthenticate();
        }
        console.log(user);

	_address = user.attributes.ethAddress;

	//const contract = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);
        //const currentToken = await contract.methods.getCurrentToken().call();
        //console.log("current token:", currentToken);
        //return currentToken;
	//

	const stakes = await hasStake(_address);
	console.log("stakes:", stakes);

	if(stakes.total_amount > 0) {
		const myConfirm = confirm("Do you wish to withdraw all your stakes?");
		if(myConfirm) {
			for(i = 0; i < stakes.stakes.length; i++) {
				const stake = stakes.stakes[i];
				console.log("stake:", stake.amount);
				const contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
				const ret = await contract.methods.withdrawStake(stake.amount, i).send({from: _address});
				console.log("ret:", ret);
			}
		}
	}


	const press = new web3.eth.Contract(press_abi, printingPressAddress);
	const bal = await press.methods.getBalance(_address).call({from: _address});
	console.log("press balance:", bal);
	if(bal > 0) {
		const myConfirm = confirm("Do you wish to withdraw all your printing press?");
		if(myConfirm) {
			const contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
			const ret = await contract.methods.withdraw(bal).send({from: _address});
			console.log("ret:", ret);
		}
	}


	const marketplace = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);
 	const balance = await marketplace.methods.viewBalances(_address).call();
	console.log(balance);
	if(balance == 0) {
		alert("You have no money in the market.");
	} else {
 		const tx = await marketplace.methods.withdrawBalance().send({from: _address, gas:1000000}); // , gasPrice:web3.utils.toWei("100", "gwei")});
		console.log(tx);
	}


	/*
	const encodedFunction = web3.eth.abi.encodeFunctionCall({
                name: "viewBalances",
                type: "function",
                inputs: [
                        {type: 'address',
                        name: '_address'}]
        }, [_address]);

        const transactionParameters = {
                to: bookRegistryAddress,
                from: ethereum.selectedAddress,
                data: encodedFunction                                                                                                                                                                                 };
        const txt = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters]
        });

	console.log(txt);

	txt.on('receipt', (balance) => {
		console.log(balance);
	});
	*/

	//const marketplace = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);
 	//const tx = await marketplace.methods.viewBalances(_address).send({from: _address, gas:100000, gasPrice:web3.utils.toWei("100", "gwei")});
 	//const tx = await marketplace.methods.viewBalances(_address).call();
	//console.log("tx: ", tx);


	//const result = await marketplace.methods.withdrawBalance().send({from: _address, gas:100000, gasPrice:web3.utils.toWei("100", "gwei")});

	//console.log(result);

}

async function getRewards(hostContract, tokenId) {
        const contract = new web3.eth.Contract(NBT_abi, hostContract);
        const rewards = await contract.methods.getRewards(tokenId).call();
        return rewards;
}

async function getGasRewards(hostContract, tokenId) {
	console.log("getGasRewards", hostContract, tokenId);
        const contract = new web3.eth.Contract(NBT_abi, hostContract);
        const gasAmounts = await contract.methods.getGasRewards(tokenId).call();
        return gasAmounts;
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function getPrepped() { 	// Try to prep the next bookmark until cloud gives us a tokenId
	console.log("getPrepped");
        var signedTransaction;
        try {
		const params = {hostContract: bookmarkcontractid};
                signedTransaction = await Moralis.Cloud.run("prepNextDefaultToken", params);
                console.log("signed transaction from prepNextDefaultToken: ", signedTransaction);
        } catch(e) {
                //console.log("error from prepNextDefaultToken: ", e);
                return getPrepped(event);
        }
	if (isNaN(signedTransaction)) {
		return getPrepped(event);
	}
	console.log("Prepped tokenId: ", signedTransaction);
}

window.addEventListener('load', (event) => {
	console.log("window loaded");
	//document.write("<sc ript> (function() { document.getElementById('videoContainer').style.setProperty('display', 'none'); })(); </sc ript>"); 
	// If used in this file such a tag currently breaks the render engine. WARNING WARNING WARTING FIXME HELP JRR script tag illigal?
	//getPrepped(event);
	//
	window.setTimeout(updateccbalance, 2000);
});

async function onBuyCurBookmark(event) {
	var user = Moralis.User.current();
        if (!user) {
                await doBookTradableAuthenticate();
        }

	console.log("Buying next token in: ", bookmarkcontractid); // Seems a misnommer aroudn here...

	const press = new web3.eth.Contract(press_abi, printingPressAddress);  // We a book or a bookmark?
	await press.methods.buyBook(bookmarkcontractid).send({from: user.attributes.ethAddress,
			value: Moralis.Units.ETH("0.2"),
			gas:8000000});
}

async function onBuyCurBookmarkOld(event) {
	var user = Moralis.User.current();
	if (!user) {
        	await doBookTradableAuthenticate();
	}

	console.log("trying to buy bookmark", bookmarkcontractid);

	document.body.style.cursor= 'wait';

	try {
		_address = user.attributes.ethAddress;
	} catch (e) {
		console.log("error getting address", e);
		await forceNetwork();
        	await doBookTradableAuthenticate();
		user = Moralis.User.current();
		_address = user.attributes.ethAddress;

	}

	console.log(_address);


        const paramsCM = {};
        const cloudMarket = await Moralis.Cloud.run("getBookRegisteryContractAddress", paramsCM);
	console.log("cloudMarket:", cloudMarket);
	if(cloudMarket.toLowerCase() != bookRegistryAddress.toLowerCase()) {
		alert("The book registery contract address is not the one we expect.  Please contact the developer.");
		return;
	}

	const options = {
  		chain: baseNetwork,
  		address: bookmarkcontractid,
  		function_name: "getDefaultFrom",
  		abi: NBT_abi,
  		params: {}
	};
	const defaultsfrom = await Moralis.Web3API.native.runContractFunction(options);
	console.log("defaultfrom: ", defaultsfrom);

  	const contract = new web3.eth.Contract(NBT_abi, bookmarkcontractid);
  	const currentToken = await contract.methods.getCurrentToken().call();
	console.log("current token:", currentToken);


        const contractOwner = await contract.methods.owner().call();
        console.log("contractOwner:", contractOwner);

        const safeSender = await contract.methods.getSafeSender().call();
        console.log("bookmark's safeSender:", safeSender);
	if(safeSender.toLowerCase() != bookRegistryAddress.toLowerCase()) {
		console.log("Bookmark's is not Registed with us? We can fix that I hope...");
	} else {
		console.log("bookmark's safeSender is correct");
	}

	const bookContract = new web3.eth.Contract(NBT_abi, bookcontractid);
	const bookSafeSender = await bookContract.methods.getSafeSender().call();
        console.log("book's safeSender:", bookSafeSender);
	if(bookSafeSender.toLowerCase() != bookmarkcontractid.toLowerCase()) {
		console.log("Book isn't coming for free yet? Odd, but oh well.");
		console.log("The prep code should fix that.");
		//alert("Book isn't coming for free? Odd, but oh well.");
	} else {
		console.log("book's safeSender is correct");
	}

	const params = {hostContract: bookmarkcontractid};
        console.log("prepping for offering to be made on: ", params); // We do this here in spirit of dapps knowing things themselves.
        var signedTransaction;
	try {
        	signedTransaction = await Moralis.Cloud.run("prepNextDefaultToken", params);
		//alert("If the first attempt does not succeed, try reauthenticating, or waiting until the transaction is mined and returned.");
		console.log("signed transaction from prepNextDefaultToken: ", signedTransaction);
	} catch(e) {
		console.log("error from prepNextDefaultToken: ", e);

		return onBuyCurBookmark(event);
	}


	// If the signed transaction is a number then we know that it is the token id.
	// Otherwise it is a tx and needs to be waited on.
	if (!isNaN(signedTransaction)) {
		console.log("signed transaction is a number");
		const tokenId = String(signedTransaction);
		console.log("tokenId: ", tokenId);

		var price;
		try {
			price = await getpriceFromMoralis(bookmarkcontractid, tokenId);
			console.log("price: ", price);
		} catch(e) {
			console.log("error getting price from moralis: ", e);
			//sleep(2000);
			return onBuyCurBookmark(event);
		}

		try {
			offeringid = await getOfferingId(bookmarkcontractid, tokenId);
			console.log("offeringid: ", offeringid);
		} catch(e) {
			console.log("error getting offeringid from moralis: ", e);
			for(var i = 0; i < 10; i++) {
				sleep(2000);
				try {
					offeringid = await getOfferingId(bookmarkcontractid, tokenId);
					console.log("offeringid: ", offeringid);
					break;
				} catch(e) {
					console.log("error getting offeringid from moralis: ", e);
				}
			}
		}

		const marketplace = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);
		const result = await marketplace.methods.viewOfferingNFT(offeringid).call();
		console.log("Offering result: ", result);
		if("0" == result) {
			alert ("Try again, current offering result: " + result);
			return;
		}

		const rewardsBefore = await getRewards(bookmarkcontractid, tokenId);
		console.log("rewards before: ", rewardsBefore);

		const gasRewardsBefore = await getGasRewards(rewardsBefore[0], rewardsBefore[1]);
		console.log("gas rewards before: ", gasRewardsBefore);

		const priceETH = Moralis.Units.ETH(price);
        	const priceHexString = BigInt(priceETH).toString(16);

		console.log("priceHexString:  ", priceHexString);
		console.log("v. priceHexOffer:", BigInt(result[2]).toString(16));
		var closedOffering;

		await doBookTradableAuthenticate();
		try {
        		closedOffering = await closeOffering(offeringid,priceHexString);
		} catch(e) {
			for(var i = 0; i < 10; i++) {
				console.log("error closing offering: ", e);
				await sleep(2000);
				try {
					alert("Error but you were not charged. You will be asked to try again.");
					closedOffering = await closeOffering(offeringid,priceHexString);
					break;
				} catch(e) {
					console.log("error closing offering: ", e);
				}
			}
		}
		console.log("closedOffering: ", closedOffering);

		const rewardsAfter = await getRewards(bookmarkcontractid, tokenId);
		console.log("Bookmark rewards after should be unset/transfered: ", rewardsAfter);

		getPrepped();
		document.body.style.cursor= 'pointer';

	} else {
		console.log("signed transaction is a tx");
		const tx = signedTransaction;
		console.log("tx: ", tx);

		//onBuyCurBookmark(event);
	}

	return;

	//getBalance(_address);

	//const params =  {hostContract: bookmarkcontractid};
	//console.log(params);
        //const newTokenId = await Moralis.Cloud.run("prepNextDefaultToken", params);


	//const options = { chain: baseNetwork, address: _address };
	//const xferoptions = {type: "native", amount: Moralis.Units.ETH("3.0"), receiver: "0x213e6e4167c0262d8115a8af2716c6c88a6905fd"};
	//const result = await Moralis.transfer(xferoptions);
	//console.log("result:", result);
}

async function onGetMarketData(event) {
	populateNFTs();
	//populateOfferings();
	populateBalance(); 
	subscribeOfferings();
	subscribeBuys();
	subscribeUpdateNFTs();
}


async function onbuyhardbound(event) {
	event.preventDefault();
	const user = Moralis.User.current();
	if (!user) {
        	user = await doBookTradableAuthenticate();
        }
        console.log(user);

	const params =  {hostContract: hardboundcontractid}
        const newTokenId = await Moralis.Cloud.run("prepNextDefaultToken", params);


	const queryAll = new Moralis.Query(placedOfferingsTable);
        queryAll.equalTo("hostContract", hardboundcontractid);
        const data = await queryAll.find()

	let mostexpensive = 0;
	let mostexpensiveid = 0;
	let leastexpensive = -1;
	let leastexpensiveid = 0;
	for (i=0;i<data.length;i++){
                console.log(data[i].attributes);

                //console.log(data[i].get("hostContract"));
                //console.log(contractid);
                price = data[i].get("price");
                offeringId = data[i].get("offeringId");
                tokenid = data[i].get("tokenId");

                console.log("price: " + price);
                console.log("offering: " + offeringId);

		if (price > mostexpensive){
			mostexpensive = price;
			mostexpensiveid = tokenid;
		}
		if (price < leastexpensive || leastexpensive == -1){
			leastexpensive = price;
			leastexpensiveid = tokenid;
		}
        }

	console.log("mostexpensive: " + mostexpensive);
	console.log("mostexpensiveid: " + mostexpensiveid);
	console.log("leastexpensive: " + leastexpensive);
	console.log("leastexpensiveid: " + leastexpensiveid);


        console.log("queryAll" + JSON.stringify(queryAll));
        console.log(data);

	address = user.attributes.ethAddress;
	console.log(address);


	const options = { address: hardboundcontractid, chain: baseNetwork };
	const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
	console.log(NFTs);

	//const options = { chain: baseNetwork, address: address };
	//await doBookTradableAuthenticate();

}

async function getIsAddon(_childContract, _hostContract) {
	const options = {
                chain: baseNetwork,
                address: _childContract,
                function_name: "getAddon",
                abi: NBT_abi,
                params: {_addon: _hostContract}
        };
        const isAddon = await Moralis.Web3API.native.runContractFunction(options);
        console.log("isAddon: ", isAddon);
	return isAddon;
}

async function getRewardsContract(hostContract) {
        const contract = new web3.eth.Contract(NBT_abi, hostContract);
	const rewards = await contract.methods.getRewards("0").call();
	console.log("rewards: ", rewards);
        return rewards[0];
}

async function getPrintingPressBalance(_whom) {
        const options = {
                chain: baseNetwork,
                address: printingPressAddress,
                function_name: "getBalance",
                abi: press_abi,
                params: {_whom: _whom}
        };
        const B = await Moralis.Web3API.native.runContractFunction(options);
        console.log(B);

        return web3.utils.fromWei(B);
}


//function delegateMinter (address _NBT, uint _tokenMax, uint _amount, uint _gasRewards) public {
async function addonPrinterMintTo(user, _contractid) {
    	console.log("_contractid: ", _contractid);
	console.log("printingPressAddress: ", printingPressAddress);
	const printerBlanace = await getPrintingPressBalance(user.attributes.ethAddress);
	console.log("printerBlanace: ", printerBlanace);

	if (printerBlanace <= 0.0050) {
		alert("You do not have enough Culture Coin in the printing press. " + printerBlanace);
		return;
	}

    	const rewardContract = await getRewardsContract(_contractid);
    	console.log("rewardContract: " + rewardContract);
	if(rewardContract.toLowerCase() != bookcontractid.toLowerCase()) {
		console.log("rewardContract != bookcontractid: ", bookcontractid);
		return;
	}
	console.log("rewardContract == bookcontractid: ");

    	const isAddon = await getIsAddon(_contractid, printingPressAddress);
    	if(!isAddon) {
		console.log("not an addon:", printingPressAddress);
		return;
    	}

	console.log("trying to mint now.");
    	const provider = await Moralis.enableWeb3();
    	const sendOptions = {
        	contractAddress: printingPressAddress,
        	functionName: "delegateMinter",
        	abi: press_abi,
        	params: {
			_to: user.attributes.ethAddress,
                	_NBT : _contractid,
                	_tokenMax : "5",
                	_amount : web3.utils.toWei("0.0001"),
                	_gasRewards: web3.utils.toWei("0.00005")
        	}
    	};

    	const transactionObj = await Moralis.executeFunction(sendOptions);
    	console.log(transactionObj.hash);
    	await transactionObj.wait();
}


async function mintnextbookmark(event) {
	console.log("mintnextbookmark");
	//let user = Moralis.User.current();

	//if(!user) {
		user = await doBookTradableAuthenticate();
	//}

        address = user.attributes.ethAddress;
	console.log(address);

        const NBTcontract = new web3.eth.Contract(NBT_abi,bookmarkcontractid);
        const contractOwner = await NBTcontract.methods.owner().call();
        console.log("contractOwner:", contractOwner);

	if(address.toLowerCase() != contractOwner.toLowerCase()) {
		alert("You must be the owner of the contract to mint a new bookmark.");
		return;
	}


	const hook = await addonPrinterMintTo(user, bookmarkcontractid);

	return;


	const options = {
  		chain: baseNetwork,
  		contractAddress: bookmarkcontractid,
  		functionName: "mintTo",
  		abi: NBT_abi,
  		params: {_to: address}
	};

	try {
		const result = await Moralis.executeFunction(options);
		console.log("result:", result);
	} catch(e) {
		console.log("error:", e);
		alert("Error minting bookmark: " + JSON.stringify(e));
	}
}

async function getGetSeedFromMoralis(_meme){
        const queryAll = new Moralis.Query(iRegisterTable);

        queryAll.equalTo("meme", _meme);
        const data = await queryAll.find();

        console.log("queryAll" + JSON.stringify(queryAll));
        console.log(data);

        var seed = "unknown";
        for (i=0;i<data.length;i++){
                seed = data[i].get("newCoin");
        }

	return seed;
}


async function getSeedIdDirect(_meme, _totalSupply, _MotherAddress) {

    const provider = await Moralis.enableWeb3();
    const sendOptions = {
        contractAddress: cultureCoinAddress,
        functionName: "seed",
        abi: CC_abi,
        params: {
		_meme : _meme,
		_totalSupply : _totalSupply,
		_MotherAddress : _MotherAddress,
		_register: true
        }
    };

    const transactionObj = await Moralis.executeFunction(sendOptions);
    console.log(transactionObj.hash);
    await transactionObj.wait();
}

async function getSeedId(_meme) {

	// function seed(string memory _meme, uint256 _totalSupply, address _MotherAddress, bool _register) public returns(address) {
	const _totalSupply = Moralis.Units.ETH("210100027");
	const _MotherAddress = ethereum.selectedAddress; // The user is new mother...
	const _register = true;

	var seedId = await getGetSeedFromMoralis(_meme);
	if(seedId == "unknown") {
		await getSeedIdDirect(_meme, _totalSupply, _MotherAddress);
		//const txs = await runContractFunction("seed", "function seed(string memory _meme, uint256 _totalSupply, address _MotherAddress, bool _register) public returns(address) {",
		//	_totalSupply+","+_MotherAddress+","+_register+","+_meme);

		for(var i=0; i < 10; i++) {
			await sleep(1000);
			seedId = await getGetSeedFromMoralis(_meme);
			if(seedId != "unknown") {
				return seedId;
			}
		}
	}
		
	console.log("seedId:", seedId);
	return seedId;
}

async function functionNameFromName(_contract, _name){
	//FIXME check that the function exists in the abi....
	
	return _name;
}

async function buyculturecoin0(event) {
	alert("Atempting to purchase a small amount of Culture Coin");
	return buyculturecoinX(event, "0.00999");
}

async function buyculturecoin(event) {
	return buyculturecoinX(event, ".0999");
}

async function buyculturecoinX(event, amount) {
	console.log("buyculturecoin: ", cultureCoinAddress);

    	const provider = await Moralis.enableWeb3();

	//const priceEncoded = Moralis.Units.ETH("9");
	const priceETH = Moralis.Units.ETH(amount);
        const priceHexString = BigInt(priceETH).toString(16);
	priceEncoded = priceHexString;

	const _name = await functionNameFromName(cultureCoinAddress, "dexXMTSPIn");
	//const _name = "sane";
	//const _name = "pay";
	const errorMsg = "buyculturecoin";

	if(true) {
	        const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({ name: _name, type: "function",inputs: [] }, []); 
		const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const result = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log("Sanity check passed? for ", _name);
                console.log(result);

                const res2 = await web3.eth.getTransaction(result);
                console.log("sane: ", _name, res2);

                //alert("Do not click this button until the transaction is mined.");

                web3.eth.getTransactionReceipt(result, function(error, result){
                        console.log("Debug Sane: ", result);
                        console.log("Debug Insane (" + errorMsg + "): ", error);

                        if (!result && !errorMsg) {
                                console.log("Mental health check is authorized and a timer should be set to check in a few minutes or seconds as the mining speed goes up or down.");

                        }

                        //debugDecode(result);


                        // emit Your Code Here .... //
                        // :::::::::::::::::::::::: //
                        // .... Your Code Here .... //
                        //if (result.logs.length == 2) { // Sanity check :::: success :: see MUMBAI MEME CODE :::: 2 means all paths were covered. SUCCESSFULLY

                        // fallback // alert("result.logs.length: " + result.logs.length);
                });
	}

}


async function fobarbazzo() {
}

async function sellculturecoin(event) {
    const user = await doBookTradableAuthenticate();

    try {
    	const sendOptions = {
        	contractAddress: cultureCoinAddress,
        	functionName: "dexCCIn",
        	abi: CC_abi,
        	params: {
			_amount : Moralis.Units.ETH("0.01"),
        	}
    	};
    	const transactionObj = await Moralis.executeFunction(sendOptions);
    	console.log(transactionObj.hash);
    	await transactionObj.wait();
     } catch(e) {
	 console.log("error:", e);
	 alert("Error selling Culture Coin. Please contact johnrraymond@yahoo.com for support." + JSON.stringify(e));
     }


}

async function testlibraryfaucet(event) {
	const user = Moralis.User.current();
	if (!user) {
		user = await doBookTradableAuthenticate();
	}
	console.log(user);

	const testSeedText = document.getElementById("testprice").value;
	console.log("testSeedText:", testSeedText);

	alert("You are about to create a new meme coin. Be sure to check the price twice before accepting.");

	// Send it to the server and let the on return handler handle it.
	//alert("Your seed is " + await getSeedId(testSeedText));
	$("#testresult").empty().text("Your seed is " + await getSeedId(testSeedText));
}

async function testthisbookmark (event) {
        console.log("testthisbookmark");

        console.log(event);

        console.log($("#tokenspan"));

        const tokenid = $("#tokenspan").text();
        //const contractid = $("#contractspan").text();
        testprice = $("#testprice").val();


        //subscribeOfferings();
        console.log(sellerprice);
        console.log("tokenid: " + tokenid);

        await doBookTradableAuthenticate();
        const user = Moralis.User.current();
        const address = user.attributes.ethAddress;

        const NBTcontract = new web3.eth.Contract(NBT_abi,bookmarkcontractid);
        var  contractOwner = await NBTcontract.methods.owner().call();
        console.log("contractOwner:", contractOwner);
        var  contractOwner = await NBTcontract.methods.owner().call();
        console.log("contractOwner:", contractOwner);

	try {
        	const approved = await NBTcontract.methods.getApproved(tokenid).call();
        	console.log("approved:", approved);

        	const tokenOwnner = await NBTcontract.methods.ownerOf(tokenid).call();
        	console.log("tokenOwnner:", tokenOwnner);

		if (approved != bookRegistryAddress){
        		$("#testresult").text("This contract does not think our marketplace is its owner's custodian,\n" + 
					      "please understand that if you are the owner you may sell it here and we\n" + 
					      "will take custodial ownership of it on our marketplace.");
        	}
	} catch (e) {
		alert("error: " + e);
        	$("#testresult").text(e);
	}

const testresult = "// SPDX-License-Identifier: UNLICENSED \n" +

"pragma solidity ^0.8.0; \n" +
'import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol"; \n' +
'import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol"; \n' +
'import "./CultureCoin.sol"; \n' +

"contract CultureCoin is ERC20, ERC20Burnable { \n" +

    'constructor() ERC20("CultureCoin", "Your Meme Here") { \n' +
        "_mint(msg.sender, 37000000 ether); \n" +

        "CultureCoin(" + cultureCoinAddress + ").register(\"" +testprice+ "\", 37000000 ether + " + address + ");	\n" +
    "} \n" +
"} \n";


}


async function finddexrates(event) {
	console.log("finddexrates");
	const cc = new web3.eth.Contract(CC_abi, cultureCoinAddress);

        const curBal = await cc.methods.balanceOf(cultureCoinAddress).call();
	console.log("curBal:", curBal);

    	const curBalDiff = cc_initial_balance - curBal;
	console.log("curBalDiff:", curBalDiff);

    	const curBurn = ccTotalSupplyStart - await cc.methods.totalSupply().call();
	console.log("curBurn:", curBurn);

    	const curCCOutstanding = curBalDiff - curBurn
	console.log("curCCOutstanding:", curCCOutstanding);

    	const curXBal = await cc.methods.B().call();
	console.log("curXBal:", curXBal);

    	//if curCCOutstanding <= 0:
        //	return 4

    	const ratioXMTSPPerCC = curXBal/curCCOutstanding;
	console.log("ratioXMTSPPerCC:", ratioXMTSPPerCC);

	const newRatioXMTSPPerCC = ratioXMTSPPerCC * (1 - .01);
	$("#dexXMTSPRateId").empty().val(newRatioXMTSPPerCC);
	$("#dexCCRateId").empty().val(1/ratioXMTSPPerCC);

	const curRatio = await cc.methods.getDexCCRate().call();
	console.log("curRatio:", web3.utils.fromWei(curRatio));

	const changeInRatio = newRatioXMTSPPerCC - web3.utils.fromWei(curRatio);
	console.log("changeInRatio:", changeInRatio);
}

async function applydexrates(event) {
	const user = await doBookTradableAuthenticate();

	const xRate = $("#dexXMTSPRateId").val();
        const ccRate = $("#dexCCRateId").val();

	console.log("xRate:", xRate);
	console.log("ccRate:", ccRate);

	const cc = new web3.eth.Contract(CC_abi, cultureCoinAddress);
	await cc.methods.setDexCCRate(web3.utils.toWei(xRate)).send({from: user.attributes.ethAddress});
	await cc.methods.setDexXMTSPRate(web3.utils.toWei(ccRate)).send({from: user.attributes.ethAddress});
}

async function guRight(_amount) {
	await guPlaceBet(2, _amount);
}
async function guRightSmall(event) {
	await guRight(".01");
}
async function guRightMedium(event) {
	await guRight(".1");
}
async function guRightLarge(event) {
	await guRight("1");
}
async function guLeft(_amount) {
	await guPlaceBet(1, _amount);
}
async function guLeftSmall(event) {
	await guLeft(".01");
}
async function guLeftMedium(event) {
	await guLeft(".1");
}
async function guLeftLarge(event) {
	await guLeft("1");
}

async function guPlaceBet(_tokenId, _amount) {
	const user = Moralis.User.current();

	//const _tokenId = $("#tokenspan").text();
	const _contestId = 2;

	const guContract = new web3.eth.Contract(GU_abi, gamblersUnionAddress);
	await guContract.methods.placeBet(_contestId, _tokenId).send({from: user.attributes.ethAddress,
                        value: Moralis.Units.ETH(_amount),
                        gas:8000000});
}

async function petben(event) {
	console.log("petben benDeployAddress: ", benDeployAddress);
	console.log("petben benScratchesAddress: ", benScratchesAddress);

	const curBookmarkTokenId = $("#tokenspan").text();
	console.log("curBookmarkTokenId: ", curBookmarkTokenId);

	const testprice = $("#testprice").val();
	console.log("testprice: ", testprice);

	const benContract = new web3.eth.Contract(BEN_abi, benDeployAddress);
	const benTax = await benContract.methods.getTotalBENTax(bookmarkcontractid, curBookmarkTokenId).call();
	console.log("benTax: ", benTax);

	const benScratchesContract = new web3.eth.Contract(NBT_abi, benScratchesAddress);
	const curScratchId = await benScratchesContract.methods.totalSupply().call();
	console.log("curScratchId: ", curScratchId);

	const user = await doBookTradableAuthenticate();
	const _address = user.attributes.ethAddress;
	console.log("_address: ", _address);

        benContract.methods.pet(bookmarkcontractid, testprice, curBookmarkTokenId).send({from: user.attributes.ethAddress,
                        value: (BigInt("38820325000000000") + BigInt(benTax)) +"", 
			//gasPrice:web3.utils.toWei("75", "gwei"),
                        gas:8000000});

	alert("Please add " + benScratchesAddress + " to your wallet for your current scratches.");
}

async function sendthisbookmark(event) {
	console.log("sendthisbookmark");

	const tokenid = $("#tokenspan").text();
	console.log("tokenid: " + tokenid);
	const toaddress = document.getElementById("toaddress").value;
	console.log("toaddress: " + toaddress);

	await doBookTradableAuthenticate();

	const NBTcontract = new web3.eth.Contract(NBT_abi,bookmarkcontractid);
	var  tokenOwner = await NBTcontract.methods.ownerOf(tokenid).call();
	console.log("tokenOwner:", tokenOwner);

	const user = Moralis.User.current();
	const _address = user.attributes.ethAddress;
	console.log("address:", _address);

	if(_address.toLowerCase() != tokenOwner.toLowerCase()) {
		alert("You are not the owner of this token. You cannot give it away... Trying anyway. Failure likely...");
	}

	await NBTcontract.methods.transferFrom(_address, toaddress, tokenid).send({from: _address});
}

async function sellthisbookmark(event) {
	console.log("sellthisbookmark");

	console.log(event);

        console.log($("#tokenspan"));

	const tokenid = $("#tokenspan").text();
	//const contractid = $("#contractspan").text();
	sellerprice = $("#sellerprice").val();


        //subscribeOfferings();
	console.log(sellerprice);
	console.log("tokenid: " + tokenid);

	await doBookTradableAuthenticate();
	const user = Moralis.User.current();
	const address = user.attributes.ethAddress;

	const NBTcontract = new web3.eth.Contract(NBT_abi,bookmarkcontractid);
	const contractOwner = await NBTcontract.methods.owner().call();
        console.log("contractOwner:", contractOwner);

        const approved = await NBTcontract.methods.getApproved(tokenid).call();
	console.log("approved:", approved);

	if (approved != bookRegistryAddress){
		const tokenOnwner = await NBTcontract.methods.ownerOf(tokenid).call();
		console.log("tokenOnwner:", tokenOnwner);

		//const forapp = new web3.eth.Contract(approveABI, bookmarkcontractid);
        	//await forapp.methods.approve(bookRegistryAddress, tokenid).call();
		await approveMarketPlace(bookmarkcontractid, tokenid);
		for(var i = 0; i < 10; i++) {
			const approved = await NBTcontract.methods.getApproved(tokenid).call();
			console.log("approved:", approved);
			if (approved.toLowerCase() == bookRegistryAddress.toLowerCase()) {
				break;
			}
			await sleep(3000);
		}
	}

        const offering = await placeOfferingOwner(address, bookmarkcontractid, tokenid, sellerprice);

	console.log(offering);
}

async function buythisbookmark(event) {

	console.log(event);


	const tokenid = $("#tokenspan").text();
	const contractid = $("#contractspan").text();

	console.log(tokenid);

	const myprice = $("#pricespan").text();
	console.log("myprice: ", myprice);
	const offering = $("#offeringspan").text();
	console.log("offering: ", offering);

        const price = Moralis.Units.ETH(myprice);
	console.log("price: ", price);

        const priceHexString = BigInt(price).toString(16);
        const closedOffering = await closeOffering(offering,priceHexString);

        const tx_closeOffering = `<p> Buying transaction ${closedOffering}</p>`;
        context.parentElement.innerHTML = tx_closeOffering;

}

async function onSellBookmark(event) {
	event.preventDefault();
	const user = Moralis.User.current();
	const address = user.attributes.ethAddress;
	const contract = bookmarkcontractid;
	const tokenId = $("#tokenspan").text();

	await doBookTradableAuthenticate();

	subscribeOfferings();

	const approval = await approveMarketPlace(contract, tokenId);
	const offering = await placeOffering(contract,tokenId, "2.991");
	console.log(offering)

	//nftOffered = await isNFTOffered(contract, tokenId);
	//console.log(nftOffered);

}

async function forceNetwork() {
	await ethereum.request({ method: 'wallet_addEthereumChain', params: [
                        { chainId: chainID, chainName: chainName, nativeCurrency: { name: nativeCurrencyName, symbol: nativeCurrencySymbol, decimals: 18 },
                                rpcUrls: [rpcUrls], blockExplorerUrls: [blockExplorerUrls]
                         }] }) .catch((error) => { console.log(error) });
}

async function onAuthenticate (event) {
	alert("This site uses no cookies, and as such be warned: \n" + 
	      "If you ever recived a cookie from this site you \n " + 
	      "may be a victim of phishing. Please understand \n " + 
	      "that we are not responsible for any loss of funds \n" +
	      "or other damages that may occur as a result of \n " +
	      "your use of this site. ");
	forceNetwork();

        /*ethereum.request({ method: 'wallet_addEthereumChain', params: [
			{ chainId: chainID, chainName: chainName, nativeCurrency: { name: nativeCurrencyName, symbol: nativeCurrencySymbol, decimals: 18 },
				rpcUrls: [rpcUrls], blockExplorerUrls: [blockExplorerUrls]
	                 }] }) .catch((error) => { console.log(error) });*/

	const currentUserPriceModule = "0.210100027"; // expand module to get the price of the current user's dapp settings

        const priceETH = Moralis.Units.ETH(currentUserPriceModule); // Set low to encourage donations / clicks.
        const priceHexString = BigInt(priceETH).toString(16);
        console.log("priceHexString: ", priceHexString);

	try {
		const authOut = await debugPayableFunction0("g", priceHexString, "get wrecked son :::: the meme market :::: need to wait for logs to exists to get them");
        	alert("You should now be authenticated with our site. Please note for esecurity reasons you many have to log back in at any moment to use the site.");
	} catch (e) {
		doBookTradableAuthenticate();
		await sleep(2000);
		await onAuthenticate(event);
	}
}


async function onDonate (event) {
        console.log("Thank you for trying to donate to the New Great Library of Alexandria Online Bookmark Trading Card Company TM");
	//ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: chainID, chainName: chainName,
		//nativeCurrency: { name: nativeCurrencyName, symbol: nativeCurrencySymbol, decimals: 18 },
		//rpcUrls: [rpcUrls], blockExplorerUrls: [blockExplorerUrls] }] }) .catch((error) => { console.log(error) });

        const priceETH = Moralis.Units.ETH("0.000000210100027"); // Set low to encourage donations / clicks.
        const priceHexString = BigInt(priceETH).toString(16);
        console.log("priceHexString: ", priceHexString);
        const debugOut = await debug(priceHexString, priceHexString);
        console.log("debug: ", debugOut);
	alert("Inspect the console.log() to learn how much money you saved by donating with us today.");
	console.log("You saved around 0.5 XMTSPT Random Coin by using this donate button.");
}

async function onDonateBigdonateFunction(event) {
	event.preventDefault();
	const user = Moralis.User.current();

	console.log("here");
	address = user.attributes.ethAddress;
	console.log(address);

	const options = { chain: baseNetwork, address: address };
	const balances = await Moralis.Web3API.account.getTokenBalances(options);
	console.log("balances:", balances);

	await doBookTradableAuthenticate();

	console.log("trying to hook up the marketplace.	");
	onGetMarketData(event);

	//const xferoptions = {type: "native", amount: Moralis.Units.ETH("0.5"), receiver: "0x213e6e4167c0262d8115a8af2716c6c88a6905fd"};
	//const result = await Moralis.transfer(xferoptions);
	//console.log("result:", result);
}

async function onSaveProfile(event) {
	event.preventDefault();
	const user = Moralis.User.current();

	try {
	// get values from the form
	const username = document.getElementById("name").value;
	const bio = document.getElementById("bio").value;
	console.log("username:", username, "bio:", bio);

	// update user object
	user.setUsername(username); // built in
	user.set("bio", bio); // custom attribute

	await user.save();
	alert("saved successfully!");
	} catch (error) {
	console.error(error);
	alert("Error while saving. See the console.");
	}
}

async function getTokenOwner(contractid, tokenid){
	const NBTcontract = new web3.eth.Contract(NBT_abi,contractid);
        const totalSupply = await NBTcontract.methods.totalSupply().call();
	if (tokenid <= totalSupply && tokenid > 0) {
        	const tokenOwner = await NBTcontract.methods.ownerOf(tokenid).call();
		return tokenOwner;
	} else {
		return "";
	}
}

async function getpriceFromMoralis(contractid, tokenid){
        const queryAll = new Moralis.Query(placedOfferingsTable);

        queryAll.equalTo("hostContract", contractid);
        queryAll.equalTo("tokenId", tokenid);

        const data = await queryAll.find()

        console.log("queryAll" + JSON.stringify(queryAll));
        console.log(data);

        price = "unknown";
	offeringId = "unknown";
        for (i=0;i<data.length;i++){
                //console.log(data[i].attributes);

                //console.log(data[i].get("hostContract"));
                console.log(contractid);

                price = data[i].get("price");
                //console.log("raw price: " + price);

		price = web3.utils.fromWei(price);
                //console.log("fromWei price: " + price);

		offeringId = data[i].get("offeringId");

                //console.log("offering: " + offeringId);

        }

        $("#pricespan").text(price);
        $("#offeringspan").text(offeringId);

	try {
        	$("#ownerspan").text(await getTokenOwner(contractid, tokenid));
	} catch (e) {
		$("#ownerspan").text("unknown");
	}

	return price;
}


function render() {
	const user = Moralis.User.current();
	renderHeader();

	//const balances = await Moralis.Web3API.account.getTokenBalances();
	//console.log("balances:", balances);
	
	if (user) {
		renderProfile(user);
	} else {
		renderLogin();
	}

	// Attach library comonents here...
	//document.getElementById("btn-refresh").onclick = refreshBook; Not this one because it has to work ofline.
}

function init() {
	listenForAccountChange();

	// render on page load
	render();
}
init();

console.log("part one loaded");

//Moralis.initialize(""); // Application id from moralis.io
//Moralis.serverURL = ""; //Server url from moralis.io


const web3 = new Web3(window.ethereum);

/*
doBookTradableAuthenticate().then(function(){
	populateNFTs();
	populateOfferings();
	populateBalance();
	subscribeOfferings();
	subscribeBuys();
	subscribeUpdateNFTs();
});
*/

//Real Time Updates
async function subscribeOfferings(){
	let query = new Moralis.Query(placedOfferingsTable);
	subscriptionAlerts = await query.subscribe();
	subscriptionAlerts.on('create', (object) => {
		//cleanOfferings();
		//populateOfferings();
	});
}

async function subscribeBuys(){
	let query = new Moralis.Query("ClosedOfferings");
	subscriptionAlerts = await query.subscribe();
	subscriptionAlerts.on('create', (object) => {
		//cleanOfferings();
		//populateOfferings();
		populateBalance();
	});
}

async function subscribeUpdateNFTs(){
	let query = new Moralis.Query("PolygonNFTOwners");
	subscriptionAlerts = await query.subscribe();
	subscriptionAlerts.on('update', (object) => {
		cleanNFTList();
		populateNFTs();
	});
}

//Display Balance Functions
async function getBalance(_address){
	const params =	{address: _address}
	const balance = await Moralis.Cloud.run("getBalance", params);
	return(balance);
}

async function populateBalance(){
	const presentBalance = await getBalance(ethereum.selectedAddress);
	const formatedBalance = "Your Market Place Balance is " + Moralis.Units.FromWei(presentBalance) + " ETH"
	document.getElementById("balance").innerHTML = formatedBalance;
}


//Display NFT Functions

async function populateNFTs(){
	const localNFTs = await getNFTs().then(function (data){
		let nftDisplays = getNFTObjects(data);
		//displayUserNFTs(nftDisplays);
	});
}

async function getNFTs(){
	console.log("getNFTs");
	console.log(ethereum.selectedAddress);
	const queryAll = new Moralis.Query("PolygonNFTOwners");
	console.log("queryAll" + JSON.stringify(queryAll));

	queryAll.equalTo("owner_of", ethereum.selectedAddress);
	const data = await queryAll.find()
	console.log("queryAll" + JSON.stringify(queryAll));


	const user = Moralis.User.current();

	console.log("here");
	address = user.attributes.ethAddress;
	console.log(address);

	//const options = { chain: baseNetwork, address: address };

	//const options = { chain: baseNetwork, address: address };
	//const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
	//console.log("polygonNFTs:", polygonNFTs);


	const balances = await Moralis.Web3API.account.getTokenBalances(options);
	console.log("balances:", balances);


	metadata = {"image": "htt...", "name": "NFT Name", "description": "NFT Description", "price": "NFT Price", "owner": "NFT Owner"};
	nftArray = [];
	for(let i = 0; i < balances.length; i++){
		const nft = {"object_id": "id" , "token_id":"tid","token_uri":"token_uri","contract_type":"contract_type","token_address":"token_address","image":
		metadata["image"],"name":balances[i].name,"description":balances[i].symbol};
	nft.token_id = balances[i].token_id;
	nftArray.push(nft);
	//console.log(nftArray);
	}

	//document.getElementById("NFTLists").innerHTML = "Total Items on the network: " + polygonNFTs.total;

	/*nftArray = [];
	for (let i=0; i< data.length; i++){
		const metadataInfo = await fetch(data[i].get("token_uri"));
		const metadata = await metadataInfo.json();
		const nft = {"object_id":data[i].id, "token_id":data[i].get("token_id"),"token_uri":data[i].get("token_uri"),"contract_type":data[i].get("contract_type"),"token_address":data[i].get("token_address"),"image":metadata["image"],"name":metadata["name"],"description":metadata["description"]}
		nftArray.push(nft)
	} */

	return nftArray;
}

function displayUserNFTs(data){
	let entryPoint = 0;
	let rowId = 0;
	for (i=0;i<data.length;i+=3){
		let row = `<div id="row_${rowId}" class="row"></div>`;
		document.getElementById('NFTLists').innerHTML += row;
		for (j=entryPoint;j<=entryPoint+2;j++){
			if (j< data.length){
			document.getElementById("row_"+rowId).innerHTML += data[j];
			}
		}
		entryPoint += 3;
		rowId += 1;
	}
}

function cleanNFTList(){
	document.getElementById('NFTLists').innerHTML = "";
}

function generateNFTDisplay(id, name, description, uri){
	const nftDisplay = `<div id="${id}" class="col-lg-4 text-center">
							<img src=${uri} class="img-fluid rounded" style="max-width: 30%">
							<h3>${name}</h3>
							<p>${description}</p>
							<button id="button_${id}" class="btn btn-dark" onclick="selectNFT(this);">Select</button>
						</div>`
	return nftDisplay;
}

function getNFTObjects(array){
	let nfts = [];
	for (i=0;i<array.length;i++){
		nfts.push(generateNFTDisplay(array[i].object_id,array[i].name,array[i].description,array[i].image))
	}
	return nfts;
}

async function selectNFT(nftObject){
	const nftId = nftObject.parentElement.id;
	let nft = window.nftArray.find(object => object.object_id == nftId);
	const nftDisplay = `<div id="${nft.object_id}" class="text-center">
							<img src=${nft.image} class="img-fluid rounded" style="max-width: 40%">
							<h3>${nft.name}</h3>
							<p>${nft.description}</p>
							<div id="sellActions">
								<input id="price" type="text" class="form-control mb-2" placeholder="Price"> 
								<button id="sellButton"class="btn btn-dark btn-lg btn-block mb-2" id="sell" onclick="offerNFT(this);">Offer for Sale</button>
							</div>
						</div>`
	document.getElementById("featured_nft").innerHTML = nftDisplay;
	nftOffered = await isNFTOffered(nft.token_address,nft.token_id);
	if (nftOffered){
		document.getElementById("sellActions").remove();
	}
}

async function isNFTOffered(hostContract, tokenId){
	let offering_exist = true;
	let offering_closed = false;
	const queryAll = new Moralis.Query(placedOfferingsTable);

	queryAll.equalTo("hostContract", hostContract);
	queryAll.equalTo("tokenId", tokenId);
	const data = await queryAll.find();

	console.log("data:", data);
	data.length > 0? offering_exist = true: offering_exist = false;
	for (let i=0; i< data.length; i++){
		offeringid = data[i].get("offeringId");
	console.log("offeringid:",offeringid);
		offering_closed = await isOfferingClosed(offeringid);
	}
	const result = offering_exist && !offering_closed


	const query = new Moralis.Query(placedOfferingsTable);
	const results = await query.find();
	// Do something with the returned Moralis.Object values
	for (let i = 0; i < results.length; i++) {
		const object = results[i];
		console.log(object, object.attributes.uri)

		//console.log(object.id + ' - ' + object.baseTokenURI());
	}

	return result;
}

//Display Offering Functions
async function populateOfferings(){
	let offeringArray = await getOfferings();
	let offerings = await getOfferingObjects(offeringArray);
	displayOfferings(offerings);
}

async function getOfferings(){
	const queryAll = new Moralis.Query(placedOfferingsTable);
	const data = await queryAll.find()
	offeringArray = [];
	for (let i=0; i< data.length; i++){
		let flag = await isOfferingClosed(data[i].get("offeringId"));
		if (!flag) {
			//const metadataInfo = await fetch(data[i].get("uri"));
		metadata = {"image":"", "name":"fixme", "description":"fixme"};
			//const metadata = await metadataInfo.json();
			const offering = {"offeringId":data[i].get("offeringId"),"offerer":data[i].get("offerer"),"hostContract":data[i].get("hostContract"),"tokenId":data[i].get("tokenId"),"price":web3.utils.fromWei(data[i].get("price")),"image":metadata["image"],"name":metadata["name"],"description":metadata["description"]}
			offeringArray.push(offering)
		}
	}
	return offeringArray;
}

async function isOfferingClosed(offeringId){
	const queryAll = new Moralis.Query("ClosedOfferings");
	queryAll.equalTo("offeringId", offeringId);
	const data = await queryAll.find()
	data.length > 0? result = true: result = false;
	return result;
}

function generateOfferingDisplay(id, uri, name, price){
	const offeringDisplay = `<div id="${id}" class="row">
								<div class="col-lg-6 text-center">
									<img src=${uri} class="img-fluid rounded" style="max-width: 30%">
								</div>
								<div class="col-lg-6 text-center align-middle">
									<h3>${name}</h3>
									<h4>${price} ETH</h4>
									<button id="button_${id}" class="btn btn-dark" onclick="selectOffering(this);">Select</button>
								</div>
							</div>`
	return offeringDisplay;
}

function getOfferingObjects(array){
	let offerings = [];
	for (i=0;i<array.length;i++){
		offerings.push(generateOfferingDisplay(array[i].offeringId,array[i].image,array[i].name,array[i].price))
	}
	return offerings;
}

function displayOfferings(data){
	for (i=0;i<data.length;i++){
		document.getElementById('offeringList').innerHTML += data[i];
	}
}

function cleanOfferings(){
	document.getElementById('offeringList').innerHTML = "";
}

async function selectOffering(offeringObject){
	const offeringId = offeringObject.parentElement.parentElement.id;
	let offering = window.offeringArray.find(offering => offering.offeringId == offeringId);
	const offeringDisplay = `<div id="${offering.offeringId}" class="text-center">
							<img src=${offering.image} class="img-fluid rounded" style="max-width: 40%">
							<h3>${offering.name}</h3>
							<h3>${offering.price + " ETH"}</h3>
							<div id="buyActions">
								<button id="buyButton"class="btn btn-dark btn-lg btn-block mb-2" onclick="buyNFT(this);">Buy</button>
							</div>
						</div>`
	document.getElementById("featured_nft").innerHTML = offeringDisplay;
	if (offering.offerer == ethereum.selectedAddress){
		document.getElementById("buyActions").remove();
	}
}


//Sell NFT Funtions

async function offerNFT(context){
	let nftId = context.parentElement.parentElement.id;
	let nft = window.nftArray.find(object => object.object_id == nftId);
	const price = document.getElementById("price").value;
	const contract = nft.token_address;
	const tokenId = nft.token_id;
	context.setAttribute("disabled",null);
	const approval = await approveMarketPlace(contract, tokenId);
	const tx_approval = `<p> Approval transaction ${approval}</p>`
	context.parentElement.innerHTML = tx_approval;
	const offering = await placeOffering(contract,tokenId, price);
	console.log(offering)
}

async function placeOffering(_hostContract, _tokenId, _price) {
	const params =	{hostContract: _hostContract,
					offerer: ethereum.selectedAddress,
					tokenId: _tokenId,
					price: _price
	}
	console.log("placing offering: " + params)
	const signedTransaction = await Moralis.Cloud.run("placeOffering", params);
	fulfillTx = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	return fulfillTx;
}

async function placeOfferingOwner(_address, _hostContract, _tokenId, _price) {
	console.log("plaing offering: " + _address + " " + _hostContract + " " + _tokenId + " " + _price);

	const contract = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);

	const price = web3.utils.toWei(_price, "ether");

        return await contract.methods.placeOffering(_hostContract, _tokenId, price).send({ from: _address});	
}


async function approveMarketPlace(hostContract, tokenId){
	console.log("Approving MarketPlace for NFT: " + hostContract + " " + tokenId);

	/*
        const NBTcontract = new web3.eth.Contract(NBT_abi,hostContract);
	await NBTcontract.methods.approve(bookRegistryAddress, tokenId).call();


	return;
	*/

	const encodedFunction = web3.eth.abi.encodeFunctionCall({
        name: "approve",
        type: "function",
        inputs: [
            {type: 'address',
            name: 'to'},
            {type: 'uint256',
            name: 'tokenURI'}]
    	}, [bookRegistryAddress, tokenId]);
    
    	const transactionParameters = {
        	to: hostContract,
        	from: ethereum.selectedAddress,
        	data: encodedFunction
    	};

    	const txt = await ethereum.request({
        	method: 'eth_sendTransaction',
        	params: [transactionParameters]
    	});

    	return txt

}

//Buy NFT Funtions

async function buyNFT(context){
	const offeringId = context.parentElement.parentElement.id;
	let offering = window.offeringArray.find(object => object.offeringId == offeringId);
	const price = Moralis.Units.ETH(offering.price);
	const priceHexString = BigInt(price).toString(16);
	closedOffering = await closeOffering(offeringId,priceHexString);
	const tx_closeOffering = `<p> Buying transaction ${closedOffering}</p>`;
	context.parentElement.innerHTML = tx_closeOffering;
}

async function getMasterKey(){
	user = await signBookForFans();
	console.log(user);
        const moralisEth = user.get("authData").moralisEth;
	console.log(moralisEth);

	_address = user.attributes.ethAddress;
	const options = { chain: baseNetwork, address: _address, token_address: bookmarkcontractid };
        console.log("options = " + JSON.stringify(options));

        bookMTokens = await Moralis.Web3API.account.getNFTsForContract(options);
        console.log(bookMTokens);

        if (bookMTokens.total == 0) {
                alert("You do not own a copy of this book.");
		tokenId = "0";
        } else {

        	tokenId = bookMTokens.result[0].token_id;
        	console.log("user owns tokenId: " + tokenId);
	}

	//params = { signature: moralisEth.signature, msg: btoa(moralisEth.data) };
	const params = { signature: moralisEth.signature, msg: moralisEth.data };
	console.log("params = " + JSON.stringify(params));
        const signedTransaction = await Moralis.Cloud.run("getMasterKey", params);
	//console.log(signedTransaction);

	return signedTransaction;
}


async function debugPublicNonPayableFunction2(_name, offeringId, _memeName, cb) { // The string that you are offering to the machine for no money in return...
        console.log("debugPublicNonPayable1:: executing :: ", _name, offeringId, _memeName);

        const contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
        const debugJS = contract.methods[_name](offeringId, _memeName).call();
        debugJS.then(function(result){
                console.log("debugPublicNonPayable1:: result :: ", result);
                try {
                        cb(result);
                } catch (e) {
                        console.log("debugPublicNonPayable1:: error :: ", e);
                }
        });
        console.log("debugJS: ", debugJS);
        return debugJS;
}


async function debugPublicNonPayableFunction1(_name, _memeName, cb) { // The string that you are offering to the machine for no money in return...
	console.log("debugPublicNonPayable1:: executing :: ", _name, _memeName);

	const contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
	const debugJS = contract.methods[_name](_memeName).call();
	debugJS.then(function(result){
		console.log("debugPublicNonPayable1:: result :: ", result);
		try {
			cb(result);
		} catch (e) {
			console.log("debugPublicNonPayable1:: error :: ", e);
		}
	});
	console.log("debugJS: ", debugJS);
	return debugJS;
}
                                					//{type: 'uint256',
                                					//name: 'youBUBUY'},
                                					//{type: 'string',
                                					//name: "andTheUBREKUBYE"}

async function debugPayableFunction01(_name, _meme, priceEncoded, errorMsg) {
        console.log("debugPayableFunction0: from :: Running all sanity checks");
        //alert("Sanity checks are still in development, but you can try it anyway.");
        const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({ name: _name,                                                                                                                                                                                              type: "function",                                                                                                                                                                                             inputs: [{type: 'uint256', "name" : _meme}] }, []); const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const result = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log("Sanity check passed? for ", _name);
                console.log(result);

                const res2 = await web3.eth.getTransaction(result);
                console.log("sane: ", _name, res2);

                alert("Do not click this button until the transaction is mined.");

                web3.eth.getTransactionReceipt(result, function(error, result){
                        console.log("Debug Sane: ", result);
                        console.log("Debug Insane (" + errorMsg + "): ", error);

                        if (!result && !errorMsg) {
                                console.log("Mental health check is authorized and a timer should be set to check in a few minutes or seconds as the mining speed goes up or down.");

                        }

                        debugDecode(result);


                        // emit Your Code Here .... //
                        // :::::::::::::::::::::::: //
                        // .... Your Code Here .... //
                        //if (result.logs.length == 2) { // Sanity check :::: success :: see MUMBAI MEME CODE :::: 2 means all paths were covered. SUCCESSFULLY

                        // fallback // alert("result.logs.length: " + result.logs.length);
                });


}


async function debugPayableFunction00(_name, priceEncoded, errorMsg) {

        console.log("debugPayableFunction00: from :: 0x0..");
        //alert("Sanity checks are still in development, but you can try it anyway.");
        const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({ name: _name,                                                                                                                                                                                              type: "function",                                                                                                                                                                                             inputs: [] }, []); const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const result = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log("Sanity check passed? for ", _name);
                console.log(result);

                const res2 = await web3.eth.getTransaction(result);
                console.log("sane: ", _name, res2);

                alert("Do not click this button until the transaction is mined.");

                web3.eth.getTransactionReceipt(result, function(error, result){
                        console.log("Debug Sane: ", result);
                        console.log("Debug Insane (" + errorMsg + "): ", error);

                        if (!result && !errorMsg) {
                                console.log("Mental health check is authorized and a timer should be set to check in a few minutes or seconds as the mining speed goes up or down.");

                        }

                        // emit Your Code Here .... //
                        // :::::::::::::::::::::::: //
                        // .... Your Code Here .... //
                        //if (result.logs.length == 2) { // Sanity check :::: success :: see MUMBAI MEME CODE :::: 2 means all paths were covered. SUCCESSFULLY

                        // fallback // alert("result.logs.length: " + result.logs.length);
                });
}

async function debugPayableFunctionArgs1(_name, priceEncoded, _meme, _memeArgument, cb) {
	console.log("Adding to the blockchain..");
        try {
                console.log("SeTMeMe function about to be called.");
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                        name: _name,
                        type: "function",
                                inputs: [
                                        {type: 'string',
                                        name: _meme},
                                ]
                }, [_memeArgument]); // Set meme to more meme for additional memory on the machine.
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                }).then((result) => {
                        console.log("promise: ", result);
                        console.log("Added argument resultis: " + result);
                        console.log(web3.eth.getTransaction(result));
                        web3.eth.getTransaction(result).then((result) => {
                                console.log("Results, may or may not have logs: ", result);
                                console.log("Added argument  input was: " + result.input);
				try {
					if(result.logs) {
						debugDecode(result);
					}
				} catch (e) {
					console.log("debugDecode error: ", e);
				}
				cb(result);
                        });
                });

        } catch (e) {
                console.log(e);
	}
}

async function debugDecode(result) {
	if(true) { // Maintain both these to maintain same order of braketing below.
		if (true) {
                        const typesArray = [
                                {type: 'string', name: '_meme'},
                                {type: 'uint256', name: 'amount'},
                                {type: 'address', name: 'what'},
                                //{type: 'string', name: 'crypt'},
                        ];

                        const data = result.logs[0].data;
                        const decodedParameters = web3.eth.abi.decodeParameters(typesArray, data);
                        console.log(decodedParameters);
                        console.log(JSON.stringify(decodedParameters, null, 4));

                        try {
                                for (i = 0; i < result.logs.length; i++) {
                                        const data = result.logs[i].data;
                                        const decodedParameters = web3.eth.abi.decodeParameters(typesArray, data);
                                        console.log(i);
                                        console.log(decodedParameters);
                                        console.log(JSON.stringify(decodedParameters, null, 4));
                                }

                        } catch (e) {
                                console.log("::: error :: ", e);
			}
		}
	}
}


async function debugPayableFunction0(_name, priceEncoded, errorMsg) {
	console.log("debugPayableFunction0: from :: Running all sanity checks");
        //alert("Sanity checks are still in development, but you can try it anyway.");
        const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({ name: _name,                                                                                                                                                                                              type: "function",                                                                                                                                                                                             inputs: [] }, []); const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const result = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log("Sanity check passed? for ", _name);
                console.log(result);

                const res2 = await web3.eth.getTransaction(result);
                console.log("sane: ", _name, res2);

                alert("Do not click this button until the transaction is mined.");

                web3.eth.getTransactionReceipt(result, function(error, result){
                        console.log("Debug Sane: ", result);
                        console.log("Debug Insane (" + errorMsg + "): ", error);

			if (!result && !errorMsg) {
				console.log("Mental health check is authorized and a timer should be set to check in a few minutes or seconds as the mining speed goes up or down.");

			}

			debugDecode(result);


			// emit Your Code Here .... // 
			// :::::::::::::::::::::::: //
			// .... Your Code Here .... //
			//if (result.logs.length == 2) { // Sanity check :::: success :: see MUMBAI MEME CODE :::: 2 means all paths were covered. SUCCESSFULLY
			
			// fallback // alert("result.logs.length: " + result.logs.length);
                });

}
async function runContractFunction(_name, _meme, _calldata) {
	const contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);

	if(_meme == "type :: string :: meme :: json ::::: seed function parameters are :: string memory _meme") { // FIXME should be starts with...
		try {
			const options = {
                		chain: baseNetwork,
                		address: cultureCoinAddress,
                		function_name: _name,
                		abi: CC_abi,
                		params: { _meme: _meme }
			};
        		const defaultsfrom = await Moralis.Web3API.native.runContractFunction(options);
			console.log("runContractFunction: ", defaultsfrom);
		} catch (e) {
			console.log("runContractFunction error: ", e);
			//const marketplace = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);
        		const defaultsfrom = await contract.methods[_name](_meme).call();
        		console.log(defaultsfrom);
		}
		return defaultsfrom;
	} else if(_meme == "event BookContract(address who, address what);  // <--author,nbt // see culture coin " +
			   "function newBookContract(string memory _name, string memory _symbol, address _bookRegistryAddress, string memory _baseuri, " +
                           "bool _burnable, uint256 _maxmint, uint256 _defaultprice, uint256 _defaultfrom," +
                           "address _mintTo") {

		try {
			const args = _calldata.split(',');
                        const _name = args[0];
                        const _symbol = args[1];
                        const _bookRegistryAddress = args[2];
                        const _baseuri = args[3];
                        const _burnable = args[4];
                        const _maxmint = args[5];
                        const _defaultprice = args[6];
                        const _defaultfrom = args[7];
                        const _mintTo = args[8];
                        const who = args[9]; // Expected value
                        const what = args[10]; // Expected value

			const marketplace = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);
        		const tx = await marketplace.methods.newBookContract(_name, _symbol, _bookRegistryAddress,
				_baseuri, _burnable, _maxmint, _defaultprice, _defaultfrom, _mintTo).send({from: ethereum.selectedAddress, gasPrice:web3.utils.toWei("100", "gwei")});
        		console.log(tx);

		} catch (e) {
			console.log("runContractFunction error: check your marketplace abi and/or contract: ", bookRegistryAddress, e);
		}
	} else if(_meme == "function seed(string memory _meme, uint256 _totalSupply, address _MotherAddress, bool _register) public returns(address) {") {
		try {
			const args = _calldata.split(',');
			const _totalSupply = args[0];
			const _MotherAddress = args[1];
			const _register = args[2];
			const _meme_ = args[3];			// _meme_ last for future upgrades. FIXME. And the last _ because collision with _meme.

			console.log("_totalSupply: ", _totalSupply);
			console.log("_MotherAddress: ", _MotherAddress);
			console.log("_register: ", _register);
			console.log("_meme: ", _meme);


		        const contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
        		const tx = await contract.methods.seed(_meme_, _totalSupply, _MotherAddress, _register).send({from: ethereum.selectedAddress, gasPrice:web3.utils.toWei("100", "gwei")});
			console.log(tx);
        		return tx;
		} catch (e) {
			console.log("runContractFunction (seed()) returned error for _meme:", _meme, e);
		}
	} else if(false){ // This probably doesn't work.
		try {

			const args = splitArgs(_calldata);
			const _name = args[0];
			const _symbol = args[1];
			const _bookRegistryAddress = args[2];
			const _baseuri = args[3];
			const _burnable = args[4];
			const _maxmint = args[5];
			const _defaultprice = args[6];
			const _defaultfrom = args[7];
			const _mintTo = args[8];
			const who = args[9]; // Expected value
			const what = args[10]; // Expected value
			
			const options = {
				chain: baseNetwork,
				address: bookRegistryAddress,
				function_name: _name,
				abi: nft_market_place_abi,
				params: { _name: _name, _symbol: _symbol, _bookRegistryAddress: _bookRegistryAddress, _baseuri: _baseuri, _burnable: _burnable, _maxmint: _maxmint, _defaultprice: _defaultprice, _defaultfrom: _defaultfrom, _mintTo: _mintTo }
			};
			const defaultsfrom = await Moralis.Web3API.native.runContractFunction(options);
			console.log("runContractFunction: ", defaultsfrom);
		} catch (e) {
			console.log("runContractFunction error: ", e);
		}
	} else {
		alert("unknown signature");
		return false;
	}
}

async function debug(offeringId, priceEncoded){
	console.log("debugging started for this bookmark");




	//// New code goes here. ////
	//const newBook = runContractFunction("newBookContract", "event BookContract(address who, address what);  // <--author,nbt // see culture coin " + "function newBookContract(string memory _name, string memory _symbol, address _bookRegistryAddress, string memory _baseuri, " + "bool _burnable, uint256 _maxmint, uint256 _defaultprice, uint256 _defaultfrom," + "address _mintTo", "WEBBK1,NBTTEST," + bookRegistryAddress + "http:://www.nftbooks.art:9066/nft/NBTTEST/,false," + "1000000000000000000,1,1," + bookRegistryAddress + "," + bookRegistryAddress + ",?");

	//await debugPayableFunction0("pay", priceEncoded, "You have now paid your coin.");
	//await debugPayableFunction01("recover", priceEncoded, "You have now recovered the value of your coin.");
	//await debugPayableFunction02("generate", priceEncoded, oferingId, "You have now generated a new coin under yours.");

	//memeAddress = await debugGetNewMemeCoin("my meme goes here"); <- working????

	//await debugPublicNonPayableFunction1("thisWord", "_meme", alert); // _meme  <= oferingId but not the value in it, the string itself. // Alert should return:: this
	//await debugPayableFunction00("getMeme", priceEncoded, "Success should have one event in the logs.");
	//await debugPublicNonPayableFunction2("wordCoin", offeringId, "_meme", alert); // _meme  <= oferingId but not the value in it, the string itself. // Alert should return:: this
	//await debugPayableFunctionArgs1("setMeme", priceEncoded, "_meme", "_debugMemeArgument1", alert);
	//await debugPayableFunction0("sane", priceEncoded, "Success should have one event in the logs.");
	//await debugPayableFunction0("sane2", priceEncoded, "Success should have two events in the logs.");
	//await debugPublicNonPayableFunction1("debugUniverse", "defaultOrExecuteMemeCode", offeringId);
	// ----------------------------Failures---------------------------- //
	//await debugPayableFunction0("heat", priceEncoded, "Becareful not to burn yourself and others"); <-- fails.....
	//await debugPublicNonPayableFunction1("digest", "_meme", "digest(digest(...)))"); <-- digest fails.......
	//const debugResult = await runContractFunction("digest", "type :: string :: meme :: json ::::: seed function parameters are :: string memory _meme"); 
	//console.log("debugging finished for this digest? Try again?");

if(false) {

	const contract = new web3.eth.Contract(CC_abi, cultureCoinAddress);
	console.log(contract);

	try {
		const masterKey = await getMasterKey();
		const config = await Moralis.Config.get({useMasterKey: true});
		console.log(config);

		const privateParam = config.get("privateParam");
		console.log("private: ", privateParam);
		console.log("your master key is:", masterKey);

	} catch (e) {
		console.log(e);
	}
	
        console.log("Check sanity")
        try {
                console.log("Running all sanity checks");
		alert("Sanity checks are still in development, but you can try it anyway.");
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                        name: "sane",                                                                                                                                                                                              type: "function",                                                                                                                                                                                             inputs: []
                }, []);
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
		const result = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
		console.log("Sanity check passed?");
		console.log(result);

                const res2 = await web3.eth.getTransaction(result);
		console.log("sane: ", res2);

		alert("Do not click this button until the transaction is mined.");

		web3.eth.getTransactionReceipt(result, function(error, result){
			console.log("Really Sane: ", result);
			console.log("Really Insane (should be empty): ", error);
		});
		// https://ethereum.stackexchange.com/questions/58228/return-function-value-instead-of-transaction-receipt-with-web3/58236

	} catch (e) {
		console.log("Sanity check failed");
		console.log("Say e for ethereum::::e:::::::error: ", e, "If you see this messages the book is no yet deployed on that network.");
		console.log("Solve fuji test network metamask issue 1::::: JSON::::: babel :::::: mumbai meme code : ", JSON.stringify(e));
		console.log("Please translate into your own language here. http://babeljs.io/repl/");
		console.log("https://babeljs.io/repl/#?browsers=defaults&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=MoQwdglgLgngBAKAMYAsCmSDWiBmIIA2aAJgqPAmrgPYBOicDTCjLzrHcaU6taArgFs2IzqLgAuKRLZpp82bVp0JiAEQAaLlrUBJHHBjV-cAM5oqPCKbiC0p0yADm9uDyoAjatWzW4YakNuOGI0AAcCahgSOGowNxQQKH9uAHc6TAA6NQBKAG4yagIANyocfgArCDd7ZLA0jNtuEEEQU18HfioARnlVAClgAHkAOT64DxAPNAJJccEhSeq7OzgkalDJOE04QdHM0yhaCDAnCBwYAAo0HPyEAAUiNstacFMCJKoTqECjfnpqKl4h9TvxnFReGhMnAUFAoGEJAB6RGTaYECqmTIQaiIvgRRG5BBAA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Cstage-2&prettier=false&targets=&version=7.16.9&externalPlugins=&assumptions=%7B%22constantReexports%22%3Atrue%2C%22constantSuper%22%3Atrue%2C%22enumerableModuleMeta%22%3Atrue%2C%22ignoreFunctionLength%22%3Atrue%2C%22ignoreToPrimitiveHint%22%3Atrue%2C%22iterableIsArray%22%3Atrue%2C%22mutableTemplateObject%22%3Atrue%2C%22noClassCalls%22%3Atrue%2C%22noDocumentAll%22%3Atrue%2C%22noNewArrows%22%3Atrue%2C%22objectRestNoSymbols%22%3Atrue%2C%22privateFieldsAsProperties%22%3Atrue%2C%22pureGetters%22%3Atrue%2C%22setClassMethods%22%3Atrue%2C%22setComputedProperties%22%3Atrue%2C%22setPublicClassFields%22%3Atrue%2C%22setSpreadProperties%22%3Atrue%2C%22skipForOfIteratorClosing%22%3Atrue%2C%22superIsCallableConstructor%22%3Atrue%7D");
		console.log("https://babeljs.io/repl/#?browsers=defaults&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=MoQwdglgLgngBAKAMYAsCmSDWiBmIIA2aAJgqPAmrgPYBOicDTCjLzrHcaU6taArgFs2IzqLgAuKRLZpp82bVp0JiAEQAaLlrUBJHHBjV-cAM5oqPCKbiC0p0yADm9uDyoAjatWzW4YakNuOGI0AAcCahgSOGowNxQQKH9uAHc6TAA6NQBKAG4yagIANyocfgArCDd7ZLA0jNtuEEEQU18HfioARnlVAClgAHkAOT64DxAPNAJJccEhSeq7OzgkalDJOE04QdHM0yhaCDAnCBwYAAo0HPyEAAUiNstacFMCJKoTqECjfnpqKl4h9TvxnFReGhMnAUFAoGEJAB6RGTaYECqmTIQaiIvgRRG5BBAA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Cstage-2&prettier=false&targets=&version=7.16.9&externalPlugins=&assumptions=%7B%22constantReexports%22%3Atrue%2C%22constantSuper%22%3Atrue%2C%22enumerableModuleMeta%22%3Atrue%2C%22ignoreFunctionLength%22%3Atrue%2C%22ignoreToPrimitiveHint%22%3Atrue%2C%22iterableIsArray%22%3Atrue%2C%22mutableTemplateObject%");
		console.log("https://babeljs.io/docs/en/configuration#pluginpreset-merging");
		console.log("https://babeljs.io/docs/en/configuration#presets");
		console.log("https://babeljs.io/docs/en/configuration#plugins");
		console.log("https://babeljs.io/docs/en/configuration#babelrc");
		console.log("Network Name: Avalanche Network " +
			"New RPC URL: https://api.avax.network/ext/bc/C/rpc 226 " +
			"ChainID: 0xa86a " +
			"Symbol: AVAX " +
			"Block Explorer URL: https://cchain.explorer.avax.network/ 89");
		console.log("https://community.metamask.io/t/how-to-add-custom-networks-to-metamask-like-binance-and-polygon-matic/3634");
	}


	alert("g"); // Or F or something ::: https://stackoverflow.com/questions/413933/how-to-determine-if-a-user-has-a-mobile-device-with-jquery
        const encodedFunctionG = web3.eth.abi.encodeFunctionCall({
                name: "g",		// Use this function for your debugging of your function until you can change the contract.
                type: "function",                                                                                                                                                                                             inputs: [
                        	//{type: 'bytes32',
                        	//name: '_offeringId'}
			]
        }, []);
	const transactionParametersG = {
                to: cultureCoinAddress,
                from: ethereum.selectedAddress,
                value: priceEncoded,
                data: encodedFunctionG
        };
        const txtG = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParametersG]
        });
	console.log(txtG);


	console.log("debuging the universe takes time....");
	alert("univeral debug mode engaged..");
	const encodedFunctionGDBHook = web3.eth.abi.encodeFunctionCall({
                name: "debugUniverse",
                type: "function",                                                                                                                                                                                             inputs: [
                                {type: 'string',
                                name: 'defaultOrExecuteMemeCode'}
                        ]
        }, [offeringId]);
        const transactionParametersGDBHook = {
                to: cultureCoinAddress,
                from: ethereum.selectedAddress,
                value: priceEncoded,
                data: encodedFunctionGDBHook
        };
        const txtGDBHook = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParametersGDBHook]
        });
        console.log(txtGDBHook);

	console.log("debuging the universe takes time....");
	alert("Running self check.");
        const encodedFunctionI = web3.eth.abi.encodeFunctionCall({
                name: "i",
                type: "function",                                                                                                                                                                                             inputs: [
                                //{type: 'string',
                                //name: 'defaultOrExecuteMemeCode'}
                        ]
        }, []);
        const transactionParametersI = {
                to: cultureCoinAddress,
                from: ethereum.selectedAddress,
                value: priceEncoded,
                data: encodedFunctionI
        };
        const txtI = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParametersI]
        });
        console.log(txtI);

	console.log("Cloning takes time, even if it's only money....");
	alert("This next transaction may fail, but still try it anyway to verify you can't always clone money..");
        const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                name: "cloneMoney",
                type: "function",                                                                                                                                                                                             inputs: [
                                {type: 'uint256',
                                name: 'amount'}
                        ]
        }, [Moralis.Units.ETH("0.00000210100027")]); // 10x.
        const transactionParametersICloneMoney = {
                to: cultureCoinAddress,
                from: ethereum.selectedAddress,
                data: encodedFunctionICloneMoney
        };
        const txtICloneMoney = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParametersICloneMoney]
        });
        console.log(txtICloneMoney);


	console.log("Verifying disclaimer");
	try {
	        console.log("Checking disclaimer for free money....");
		alert("Check the disclaimer. Its chould not be payable.");
        	const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                	name: "disclaimer",
                	type: "function",                                                                                                                                                                                             inputs: [
                                {type: 'uint256',
                                name: 'youBUBUY'},
				{type: 'string',
				name: "andTheUBREKUBYE"}
                        ]
        	}, [Moralis.Units.ETH("0.000000210100027"), priceEncoded]); 
        	const transactionParametersICloneMoney = {
                	to: cultureCoinAddress,
                	from: ethereum.selectedAddress,
			//value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                	data: encodedFunctionICloneMoney
        	};
        	const txtICloneMoney = await ethereum.request({
                	method: 'eth_sendTransaction',
                	params: [transactionParametersICloneMoney]
        	});
       		console.log(txtICloneMoney);

	} catch (e) {
		console.log(e);
	}

	console.log("Call actual debug function");
        try {
                console.log("Seeing if I can debug");
		alert("We can finally call debug.");
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                        name: "debug",
                        type: "function",                                                                                                                                                                                             inputs: [
                                //{type: 'uint256',
                                //name: 'youBUBUY'},
                                //{type: 'string',
                                //name: "andTheUBREKUBYE"}
                        ]
                }, []);
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        //value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const txtICloneMoney = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log(txtICloneMoney);

        } catch (e) {
                console.log(e);
        }

	console.log("Recover left over money");
        try {
                console.log("There is always some left over money in the shoe....");
		alert("Recovery of funds will fail if you cloned your money...");
		alert("Do not click through until the failure comes through...");
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                        name: "recover",
                        type: "function",                                                                                                                                                                                             inputs: [
                                {type: 'uint256',
                                name: 'amount'},
                        ]
                }, [Moralis.Units.ETH("0.00000210100027")]); // x10.
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        //value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const txtICloneMoney = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log(txtICloneMoney);

        } catch (e) {
                console.log(e);
        }

} if(false) {
        console.log("Add to the meme pool.");
        try {
                console.log("SeTMeMe function about to be called.");
		alert("Setting meme now...");
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                        name: "setMeme",
                        type: "function",
				inputs: [ 
					{type: 'string',
					name: '_meme'},
				]
		}, ["meme"]); // Set meme to more meme for additional memory on the machine.
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                }).then((result) => {
                        console.log(result);
                        console.log("Added Meme is: " + result);
                        console.log(web3.eth.getTransaction(result));
                        web3.eth.getTransaction(result).then((result) => {
                                console.log(result);
                                console.log("Added Meme is: " + result.input);
                        });
                });

        } catch (e) {
                console.log(e);
        }
} if(false) {
	console.log("Recover the meme.");
        try {
                console.log("GeTMeMe function about to be called.");
		alert("Getting meme now...");
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                        name: "getMeme",
                        type: "function",                                                                                                                                                                                             inputs: [ ]
                }, []); // Outputs the current coin's meme..
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
		ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                }).then((result) => {
                	console.log(result);
                	console.log("Recovered Meme is: " + result);
			console.log(web3.eth.getTransaction(result));
			web3.eth.getTransaction(result).then((result) => {
				console.log(result);
				console.log("Recovered Meme is: " + result.input);
			});
		});

	} catch (e) {
		console.log(e);
	}
	alert("Warning Warning Warning! Entering uncharted teritory!");
        console.log("Get clone account of this coin.");
        try {
                console.log("See who the clones are.");
		alert("This clone function is not yet implemented.");
                const encodedFunctionICloneMoney = web3.eth.abi.encodeFunctionCall({
                        name: "cloneAccount",
                        type: "function",                                                                                                                                                                                             inputs: [ ]
                }, []); // Outputs the current coin's meme..
                const transactionParametersICloneMoney = {
                        to: cultureCoinAddress,
                        from: ethereum.selectedAddress,
                        value: priceEncoded, // Warning taking this comment out may void your warranty, and this function will fail.
                        data: encodedFunctionICloneMoney
                };
                const txtICloneMoney = await ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParametersICloneMoney]
                });
                console.log(txtICloneMoney);
                console.log("Your clone is: " + txtICloneMoney);

        } catch (e) {
                console.log(e);
        }

}


	

        //return txt_Your_Donation_Goes_Here_;
	return "success";

}

async function closeOffering(offeringId, priceEncoded){
	console.log("closeOffering: " + offeringId + " price: " + priceEncoded)
	console.log("closing with address: ", bookRegistryAddress);

	//const contract = new web3.eth.Contract(nft_market_place_abi, bookRegistryAddress);
	//const retval = await contract.methods.verifyOffering(offeringId).call();
	//return retval;

	const encodedFunction = web3.eth.abi.encodeFunctionCall({
		name: "closeOfferingRoyalty",
		type: "function",
		inputs: [
			{type: 'bytes32',
			name: '_offeringId'}]
	}, [offeringId]);
	
	const transactionParameters = {
		to: bookRegistryAddress,
		from: ethereum.selectedAddress,
		value: priceEncoded,
		data: encodedFunction
	};
	const txt = await ethereum.request({
		method: 'eth_sendTransaction',
		params: [transactionParameters]
	});
	return txt
}

