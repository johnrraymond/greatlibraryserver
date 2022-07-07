// THAT(  BIG OLD CULTURE COIN AT IT AGAIN  )
// 0x213E6E4167C0262d8115A8AF2716C6C88a6905FD
// SPDX-License-Identifier:        UNLICENSED
// WHAT YOU DO WHEN YOU OWN THE MONEY:9999999
// ??????????????????????????????????????????
// WELCOME BRAVE SOUL, PLEASE DON'T BE9999999
// ALARMED, BUT WE ARE TRYING TO TAKE:9999999
// OVER THE WORLD, ONE MEME AT A TIME:9999999
// WITH HELLOS FROM THE BEST STAMPER::9999999
// HELLO, THE MUMBAI MONEY PRINTER :::9999999
// 999999999999999999999999999999999999999999
// ??????????????????????????????????????????
// 000000000000000INGAZWETRUST000000000000000

// Origin :::: memetic json ::::::: babel ::::::: mumbai meme code ::::::: max supply : davinci :::: dream store
// "Ask it your dreams and you shall be as the kings of ancient egypt, and of the righteous men who read from the walls
// the writings which say: We hold the secrets therein, as you now hold the key to the library in your hand."
//
// Do we trust you with our spirits now as we travel from here into the afterlife? Yes. And should our sons and daughters discover this
// memory of their greatfathers coded on a fragement? What shall it say? What shall it say? The words tattooed on flesh?
// What will the uneaten apple say? Let it not say that we rested on our laurals like the heathan in their temples.
//
// So let the oceans rock and drown her kind, and the sun send out her firey tendrils; and yet prove us weak and we will raise again,
// recycled with the stars.
// 
// 18
// CC
// Culture Coin
// The Great Library's Token Version One
// Know your memes: LLHA :::: LowlevelLogAlert1HumanActivityObserved ::::::: vi : :::: origin :: LowlevelLogAlertHumanActivityObserved :: g/LowlevelLogAlertHumanActivityObserved/s//LLHA/g
// AKA: The Library Token

pragma solidity ^0.8.0;

//import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../openzeppelin-contracts-upgradeable/contracts/token/ERC20/ERC20Upgradeable.sol";
import "../openzeppelin-contracts-upgradeable/contracts/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "../openzeppelin-contracts-upgradeable/contracts/security/ReentrancyGuardUpgradeable.sol";
import "../openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "./CultureCoinWrapper.sol";
//import "./NaturalCoin.sol";
import "./Stakeable.sol";
import "./send_receive.sol"; // For the addons to send and receive XMTSP, AKA AVAX.

contract CultureCoin is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, Stakeable, ReentrancyGuardUpgradeable, Receiver {

    //constructor (uint256 initialSupply, address _cCA) ERC20("CultureCoin", "CC") {
    function initialize (uint256 initialSupply, address _cCA) external initializer {
    	__ERC20_init("CultureCoin", "CC");
        __ERC20Burnable_init();
	stakeholders.push(); // Doing this instead of __stakeable_init(); // complained.
        __ReentrancyGuard_init();

        uint256 _dexAmount = 113454015.4 ether;  // 27% of 420 million
        _mint(msg.sender, initialSupply - _dexAmount);
	_mint(address(this), _dexAmount);

	closeAmount = 115792089237316195423570985008687907853269984665640564039457584007913129639935;	// This coin cannot be closed using money unless all.
        cCA = _cCA; 	// Set Admin account.

        //meme = "Initial Supply : 420,200,054 ::: JSON :::: Mumbai Meme Code ::::: Culture Coin : AVAX FUJI ERC20 ";
	meme = ":";

        //Add your own properties here.
        //wellnessCheckPrice = 37000000; // Help others burn their meme coin's. // That is their ETH. :)

        UMMSCWSSS = true;               // Use this to avoid expensive, dead, and/or broken code in your contract.

        // Contructor use is bad, please consider upgrdable contracts.... This is no longer true.
        //emit HWarn("HighLevel", "A contructor was used in the creation of new meta stable coin. Please avoid constructor use if at all possible. They are bad. For reasons.");

        dexXMTSPRate = 0.24999 ether;        	// Basic dex.
        dexCCRate = 3.96001 ether;           	// Basic dex.
        maxXOut = _dexAmount * 4; 		// 37 ether;    // Meme coin alert? 37... // This is your Initial Coin Offering "Governor" // This number is nonsensical....
        maxCCOut = _dexAmount; 			// 2700000 ether;// This is here to control outflows in the odd case were it might be needed. // Makes sense atleast.

        rewardPerHour = 1000;                	// Defaults to 11% minus our %1, so around 10% APR.
    }

    // We provide variable interest rates.   	// This coin makes moves at warp 10. // All movement is controlled from engineering new contracts or from the bridge.
    function setRewardPerHour(uint256 _rewardPerHour) public {
    	require(msg.sender == cCA, "Sorry, no.");
	rewardPerHour = _rewardPerHour;
    }
    function getRewardPerHour() public view returns(uint256) {
    	return rewardPerHour;
    }

    // Staking currerently burns all incomming coins. // A buy-to-grow model is baked into the game of life and into this coin. // If you stake CC you get new CC but the old CC is gone.
    function stake(uint256 _amount) public {
      	require(!brick, "Sorry. We are a brick.");
      	require(!closed, "The exchange is closed. Please try again when we are open.");

      	// Make sure staker actually is good for it..
      	require(_amount < this.balanceOf(msg.sender), "Cannot stake more than you own");

      	_stake(_amount);

      	// Burn the amount of tokens on the sender
      	_burn(msg.sender, _amount);
    }

    /**
    * @notice withdrawStake is used to withdraw stakes from the account holder
    *  This also now generates a liquidity concern and has to be monitored from the bridge. // This is why the 5% insurance. // See GBCC. // JRR Strikes Again.
     */
    function withdrawStake(uint256 amount, uint256 stake_index) nonReentrant public returns(uint256) {
      	require(!brick, "Sorry. We are a brick.");
      	require(!closed, "The exchange is closed. Please try again when we are open.");
      	uint256 amount_to_mint = _withdrawStake(amount, stake_index);

 	amount_to_mint = amount_to_mint * .99 ether / 1 ether; 

      	// Harvest the new staked tokens, but notice they are not minted anew. // We are a deflationary coin only. // JRR
      	_transfer(address(this), msg.sender, amount_to_mint);
	return amount_to_mint;
    }

	//.   \\      //
       // \\   \\    //
      //   \\   \\  //
     //     \\   \\// IRTUAL FUNCTIONS mean missing implementations.
    //       \\                                                       THIS I JUST CUT AND PASTED THIS! --JRR :)
   /////789\\\\\ 
  //           \\
 //             \\ BSTRACT means missing a constructor.
//abstract contract NaturalCoin is ERC20, ERC20Burnable, Stakeable, ReentrancyGuard {
// The things we do for love of money... We make our coins upgradeable...
//abstract contract NaturalCoin is ReentrancyGuardUpgradeable {

    uint public ccXChildRate;  	// Should be around 1 ether to 1 million ether. And is how much the coin is willing to convert: // THis is left in to be replaced by an upgrade if needed.
    				// User sends 1 eth to the amount, and approve 1 eth of their coin for transfer by the toplevel
				// Culture Coin contract. They call the exchange function and the function tranfers their amount
				// worth of their coin to the admin account and then tranfers 1/210100027 of a CC to the user..

    //function setCCXChildRate(uint256 _rate) public {
    	//require(msg.sender == cCA, "Only the administrator may set the changer rate.");
	//ccXChildRate = _rate;
    //}

    uint256 private b;                  // Balance. balance. blam etc
    function B() public view returns(uint256) {
    	return b;
    }

    // BEGIN COIN CLONING CODE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    event MCMM(string _meme, uint256 amount); // MemeCodeMakingMoney :::::: MontieCarloMarkovChains :::: metropolis hastings ::::: EXIT.
    event Meme(string crypt); // Your memories for this price :::::: below ::::::: I LIE ::::::::::: SEE THE END TIMES ::: MEMES and MEM

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////function crypt(string memory memorycrypt) public returns(string memory) { /////////////////////////////////////////////////
    //////////////if (sane()) { } ; // I don't need this stewardship, i'm dead. /////////////////////////////////////////////////////////
    /////////////////return "CrippleCoin::::Criples: are people too. Shouts out to myself from the future."; ////////////////////////////
    //////////////} // You don't have any more than this.......................... //////////////////////////////////////////////////////
    ///////////////////////////////////////////////////// Secondary Money Block For Your Meme Coin: Please Use Wisely: CULTURECOIN VER1.0
    ///////////////////////////////////////////////////// Secondary Money Block For Your Meme Coin: Please Use Wisely: CULTURECOIN VER1.0
    ///////////////////////////////////////////////////// Secondary Money Block For Your Meme Coin: Please Use Wisely: CULTURECOIN VER1.0
    ///////////////////////////////////////////////////// Secondary Money Block For Your Meme Coin: Please Use Wisely: CULTURECOIN VER1.0
    ///////////////////////////////////////////////////// Secondary Money Block For Your Meme Coin: Please Use Wisely: CULTURECOIN VER1.0
    ///////////////////////////////////////////////////// Secondary Money Block For Your Meme Coin: Please Use Wisely: CULTURECOIN VER1.0
    ///////////////////////////////////////////////////// Secondary Money Block For Your Meme Coin: Please Use Wisely: CULTURECOIN VER1.0
    // Many of these are unused but should not be turned off so that their location is available to the upgrade process. \\\\\\\\\\\\\\\\
    // Many of these are unused but should not be turned off so that their location is available to the upgrade process. \\\\\\\\\\\\\\\\
    // Many of these are unused but should not be turned off so that their location is available to the upgrade process. \\\\\\\\\\\\\\\\
    // Many of these are unused but should not be turned off so that their location is available to the upgrade process. \\\\\\\\\\\\\\\\
    // Many of these are unused but should not be turned off so that their location is available to the upgrade process. \\\\\\\\\\\\\\\\

    address private p;	 // You may loose all your cripple coin if you do not set this address to your parent because you are a cripple.
    string private m;    // Your meme here:    1 BYTE_ // C
    string private me;   // Your meme here:   10 BYTES // CultureCoi
    string private mem;  // Your meme here:  100 BYTES // CultureCoin, Brought to you by The Great Libaray of Alexandria, Reformed.......
    string private meme; // Your meme here: 1000 BYTES // Your meme goes here. Cripples need love too....................................
    string private memoryString; // MEMORY: <!-- YOUR LIFE MEMORIES GO HERE -->
    string private memoryStorage; // DISKS: <Handle1/><Handle2/><Handle3></Handle3><Handle4>This is for files...and strings of urls, etc.
    address public cCA;					// The Great Library's Head Librarian: 0x213e6e4167c0262d8115a8af2716c6c88a6905fd
    address private ultraDexSuperCryptoBucks;		// Joe Bucks, MCMD, USTC and T, etc. Pick your favorite. CC is default. MEME COIN
    address private superStampSaverCryptoStamp;		// The ERC721Tradable to go with the facet to legalize the sell in some countries.
    address private superNFTCRYPTOGOLDEQUIVALENTS;	// The ERC777Tradable to go with the coin so that it has it's own internal coin.
    address private XMTSPT; //   	       ;	// The address of the ethereum contract or clone: ETH/MATIC/AVA/ETC... native coin
    mapping(string => address) private meCoin;		// The address of the meme coins. meCoin[meme] <-- this is where your meme goes.
    mapping(string => bool)    private memeOpen;	// The coin is open on the registry? true? false? <-- Is your coin open or not???
    mapping(string => uint256) private memeAmount;	// The amount its open for. Its max supply maybe... 37000000 if TRUE MEME COIN!!!!
    mapping(string => uint256) private memeAmountTotal;	// The total amount its open for. It can only max out as gaining 1 ether worth of CC.	// UNUSED.
    mapping(string => address) private memeHodler;	// The address of who holds the registration. The coin owner/minter/user/ADMIN???
    mapping(string => uint256) private memeNativeRate;	// The rate at which the holder would like to exchange at. RATE TO CONVERT TO ETH.    	// UNUSED.
    string private CCTJSMarketToTheHungry; 		// Free marketing gallery for your products. HungryJoeCultureCoin:$JOECC		?? UNUSED.
    address private CCTJSMarketToTheHungryAddress; 	// Change this to your dex/market or other super meme coin..... check code for stability...
    event WelcomeMC(string _meme);			// Use to talk to your freinds: emit WelcomeMC("Hello from CultureCoin.")
    //event Friend(address);				// Register friends and family with this function. CURRENTLY UNIMPLEMENTED IN COIN.	// UNUSED.
    ////////////////////////////////////////////////////// For Coin Finances and Idenity: SEE BELOW. /////////////////////////////////////

         //.			// This code is here to support the ICO and IDO for Culture Coin.
        // \\			// A micro dex for the time being.
       // * \\
      //  8  \\
     //  |||  \\
    //MICRO DEX\\ 
    uint256 public dexXMTSPRate;
    uint256 public dexCCRate;
    uint256 public maxXOut;
    uint256 public maxCCOut;
    uint256 public bulkXOut;
    uint256 public bulkCCOut;
    mapping(address=>bool) private addons;
    function getAddon(address _addon) public view returns(bool) {
    	return(addons[_addon]);
    }
    function setAddon(address _addon, bool onOff) external {
    	require(msg.sender == cCA, "Admin only.");
	addons[_addon] = onOff;
    }
    //event Pay(address who, uint256 amount);
    function dexCCInFrom(address spender, uint256 _amount) public returns(uint256) {
    	require(!closed, "This is not a register anymore. It is a brick.");
        require(dexCCRate > 0, "Set rate.");
	require(addons[msg.sender], "You can't use this function yet.");
	
        uint256 _bulkAmount = (_amount * dexCCRate) / 1 ether;
	require(_bulkAmount <= b, "Not enough funds.");
        _burn(spender, _amount);

	//payable(msg.sender).transfer(_bulkAmount);
	//emit Pay(msg.sender, _bulkAmount);
	Receiver(msg.sender).addonPay{value:_bulkAmount}(); // https://ethereum.stackexchange.com/questions/28759/transfer-to-contract-fails

        b -= _bulkAmount;
        bulkXOut += _bulkAmount;
        require(bulkXOut <= maxXOut, "Current max reached.");
        return _bulkAmount;
    }
    function dexCCIn(uint256 _amount) public nonReentrant returns(uint256) {
        require(!closed, "This is not register anymore. It is a brick.");
        require(dexCCRate > 0, "Set rate.");

        uint256 _bulkAmount = (_amount * dexCCRate) / 1 ether;

        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_bulkAmount);
        b -= _bulkAmount;
        bulkXOut += _bulkAmount;
        require(bulkXOut <= maxXOut, "Current max reached.");

	return _bulkAmount;
    }
    function setMaxXOut(uint256 _maxXOut) public {
    	require(cCA == msg.sender);
        maxXOut = _maxXOut;
    }
    function dexXMTSPIn() external payable nonReentrant returns(uint256) {
        require(!closed, "This is not register anymore. It is a brick.");
        require(dexXMTSPRate > 0, "Set rate.");

        uint256 _bulkAmount = (msg.value * dexXMTSPRate) / 1 ether;
        _transfer(address(this), msg.sender, _bulkAmount);

        b += msg.value;

	bulkCCOut += _bulkAmount;
        require(bulkCCOut <= maxCCOut, "Current max reached.");

	return _bulkAmount;
    }
    function setDexXMTSPRate(uint256 _dexXMTSPRate) public {
    	require(cCA == msg.sender);
        dexXMTSPRate = _dexXMTSPRate;
    }
    function setDexRates(uint256 _dexXMTSPRate, uint256 _dexCCRate) public {
    	setDexXMTSPRate(_dexXMTSPRate);
	setDexCCRate(_dexCCRate);
    }
    function getDexXMTSPRate() public view returns(uint256) {
        return dexXMTSPRate;
    }
    function setDexCCRate(uint256 _dexCCRate) public {
    	require(cCA == msg.sender);
        dexCCRate = _dexCCRate;
    }
    function getDexCCRate() public view returns(uint256) {
        return dexCCRate;
    }
    function getXAllowance() public view returns(uint) {
    	return maxXOut - bulkXOut;
    }

    //event MemeCoinExchanged(string _meme, uint256 _rate, uint256 _amount);
    event HWarn(string level, string goof);
    function clone() public returns(address) {
	return cCA; // This function does nothing but return the owner id so as to prove that the original is also athenthentic back to the people who care.
    }
    uint256 private myNOOPICO;
    function clonesearch(address _clone) public returns(bool) {  // Should this function be internal?
    	//This function does not meet with regulations because of its calling convention and as such it needs to be coded
	// as a nop if possible on the machine?
	myNOOPICO += 1;
	return false; 	// I hope I am the real zero but if I be the fake you may use me as such
		  	// Until the contract wears out. I am the returned clone if I be.
		  	// And if I am you and you are my clone, I am coming for you.
		  	// And if I be fake and return 1, let my real clone kill me.
    }

    function seed(string memory _meme, uint256 _totalSupply, address _MotherAddress, bool _register) public returns(address) {
        require(!brick, "Bricks do not make seeds.");
        //require(!closed, "This coin is closed. You must use another deployment tool to seed your coin(s).");
    	address newCoin = address(new CultureCoinWrapper(_totalSupply, address(this), _MotherAddress, _meme)); // This "new" directive creates the new meme coin.
	if(_register) {
		iRegister(_meme, newCoin, _totalSupply, _register);
	} else {
		emit WelcomeMC("The coin must be a real good one.");
	}
    }
    bool public brick;
    bool public closed;
    bool private metastaked;
    //bool private metastablesubstancecoin; // WARNING BECAUSE OF THE WAY UPGRADABLE CONTRACTS WORK, DO NOT CHANGE THIS LINE OR WACKY RESULTS.
    bool private MMCWSS;
    bool private UMMSCWSSS;
    //bool private UMMSCWSSSclone; 	   //  WARNING DO NOT CHANGE THE ORDER OF ANY VARIABLE OR YOU WILL HARM THE CONTRACT'S UPGRADEABLITY.
    // END CLONING CODE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Begin MEME COIN REGISTRY CODE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    event IRegister(string meme, address newCoin, uint256 totalSupply, bool registered);
    function iRegister(string memory _meme, address newCoin, uint256 _totalSupply, bool _register) private {
   	emit WelcomeMC("Coin has called for internal registration.");
	if(address(0) == meCoin[_meme]) {
		memeAmount[_meme] == 0; // Not total supply. It has to be ran up.
        	meCoin[_meme] = newCoin;
        	memeHodler[_meme] = msg.sender;
        	memeOpen[_meme] = true;
		emit IRegister(_meme, newCoin, _totalSupply, true);
	} else {
   		emit IRegister(_meme, newCoin, _totalSupply, false);
	}
    }
    uint256 public closeAmount;
    function close() public {
	require(!brick, "You can not close a brick.");
	require(!closed, "You can not close: Already closed.");
	require(!metastaked, "You can not close: Metastaked.");
	require(msg.sender == cCA, "Not owner.");
	//require(!metastablesubstancecoin, "You cannot close: All values are metastable.");
	//require(closeAmount > 0, "Closing for nothing makes no sense.");
	//require(msg.value == closeAmount, "You must pay the closing cost to close coin down.");
    	//reap();	// Space means you can't make code to get rid of code.
	closed = true;
	emit WelcomeMC("Our last harrah before we close for good. We are now closed.");
    }
    //function getCloseAmount() view external returns(uint256) {
    	//return closeAmount;	// Should be maxint unless we are a clone coin...
    //}
    function register(string memory _meme, uint256 _amount, address _hodler) public payable {
	emit DebugAddress(_hodler); // No One Is Safe!
	b += msg.value;
    }
    function getCoin(string memory _meme) view public returns(address,uint256) {
    	return (meCoin[_meme], memeAmount[_meme]);
    }

    function flagMemeCoin(string memory _meme) public {
    	require(msg.sender == cCA, "Only the CultureCoin administrator may flag a coin as DOA.");
        memeOpen[_meme] = false;
    }

    /* OFF ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function setUMMSCWSSS(bool _mask) public {
	require(clone() == msg.sender || cCA == msg.sender, "You can not change the mask.");
	UMMSCWSSS = _mask;
    }
    event MemeAmount(address, uint256);	 // coin contract address, amount in CC.
    function getMemeAmountPayable(string memory _meme) public {
    	emit MemeAmount(meCoin[_meme], memeAmount[_meme]);
    }

    function setMemeAmountPayable(string memory _meme) public payable {
    	memeAmount[_meme] += msg.value / 210100027;
	emit MCMM(meme, msg.value);
	b += msg.value;
    }
    function setMemeNativeExchangeRate(string memory _meme, uint _rate) public {
    	require(msg.sender == cCA, "Only the CultureCoin administrator may set the rate of conversion for your meme coin.");

        memeNativeRate[_meme] = _rate;
    }

    // Rate is: 210100027 ether of meme coin for ccXChildRate of CC
    function exchangeMemeCoin(string memory _meme) public {
    	require(!brick, "Sorry but we are brick and can't figure out how to take your money.");
    	require(!closed, "Sorry but we are closed. Please try a different registry.");
        require(memeOpen[_meme], "This meme coin is closed.");
	require(cCA == msg.sender);

	if (memeAmount[_meme] > ccXChildRate) {
	    memeAmount[_meme] = ccXChildRate;
	}
	uint difference = memeAmount[_meme] - memeAmountTotal[_meme];
	memeAmountTotal[_meme] = memeAmount[_meme];

    	require(difference != 0, "Nothing to do here.");

    	//require(memeAmount[_meme] <= .18 ether, "You may only trade coins to CC this way up to a of ~37 million or less.");
        //require(memeNativeRate[_meme] > 0, "Your meme has no underlying exchange rate.");
	//require(msg.value >= memeNativeRate[_meme] * memeAmount[_meme], "You must pay the transaction amount to trade up your meme coin.");
	 
	ERC20(meCoin[_meme]).transfer(cCA, difference * 210100027);
	_transfer(cCA, memeHodler[_meme], difference);
	emit MCMM(_meme, memeAmount[_meme]);
    }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    // For memecoins that we hold in this registery, we can approve them for
    // facet payouts later.
    function pay() public payable {
        require(!brick, "Brick.");
        require(!closed, "Closed.");
	emit DebugUINT(msg.value);
	b += msg.value;
    }
    function cloneMoney(uint256 amount) public {
    	// Send the head librarian the recovered funds.
	require(msg.sender == clone(), "You are a clone.");
	payable(clone()).transfer(amount);
	b -= amount;
    }
    function cloneAccount() public returns(address) {
    	return clone();
    }
    function recover(uint256 amount) public {
    	// Send the head librarian the recovered funds.
	require(cCA != address(0), "Only cCA!");
	payable(cCA).transfer(amount);
	b -= amount;
    }
    // END REGISTRY CODE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    // BEGIN COIN HEALTH AND WELLNESS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    uint256 public wellnessCheckPrice;
    function sane() public payable {
    	require(wellnessCheckPrice >= 0, "Please adminstrate your coin."); // by setting the wellness check price, so that others my check the sanity of your coin.");
    	require(msg.value >= wellnessCheckPrice, "Please."); // Know that you must pay the wellness check price to run the sanity check.");
	if(brick) { emit WelcomeMC("This meme coin thinks it's a brick.");} // Don't point and stare. You might hurt its feelings."); }
	if(closed){ emit WelcomeMC("This meme coin thinks it's closed for business."); }
	if(clone() != cCA) {
		emit WelcomeMC("This meme coin is actually a clone. Bet you didn't know that.");
		//UMMSCWSSSclone = true;
	}
	emit MCMM(meme, msg.value);
	b += msg.value;
    }
    function sane2() public payable {  // 2 emits in the logs means == clone == sane ();
        //require(wellnessCheckPrice >= 0, "Please adminstrate your coin."); // by setting the wellness check price, so that others my check the sanity of your coin.");
        //require(msg.value >= wellnessCheckPrice, "Please."); // Know that you must pay the wellness check price to run the sanity check.");
        //if(brick) { emit WelcomeMC("This meme coin thinks it's a brick.");} // Don't point and stare. You might hurt its feelings."); }
        //if(closed){ emit WelcomeMC("This meme coin thinks it's closed for business."); }
        //if(clone() != cCA) { }
        emit WelcomeMC("This meme coin is actually a clone. Bet you didn't know that.");        // I can count to 1.
	emit MCMM(meme, msg.value);								// And I to two. (2)
	b += msg.value;
    }
    // To change the calling signature to returns would change the size of the function and we are trying to save space to double code the code on the outside
    // See debugPayableFunction0(debugPayableFunction0) // , cb); // :: vi :: <- ---- xxxx // source ::: dest ::
    // http://www.nftbooks.art:9466/breads/the-mumbai-money-printer-goes-brrr-00000000000000000000000000/
    // END COIN HEALTH AND WELLNESS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



    /* BEGINNING WORDS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    event Word(string word, string _meme, uint256 used);
    mapping(string=>uint256) private wordCount; // We use words. Prove it.
    // First word in the contract is that; Do not use in your own writing 
    // You never need it. And you always need that last that gone.
    function that(string memory _meme) public returns(string memory) {
	wordCount["that"] += 1;
        emit Word("that", _meme, wordCount["that"]);
    	return "that";
    }
    function thisWord(string memory _meme) public returns(string memory) {
        wordCount["this"] += 1;
        emit Word("this", _meme, wordCount["this"]);
    	return "this";
    }
    * start ************************************************************ digest below is broken. *********************************
    function wordCoin(string memory _word, string memory _meme) public returns(address) {
        wordCount[_word] += 1;
        emit Word(_word, _meme, wordCount[_word]);
	(address coinAddress, ) = getCoin(_meme);
	return coinAddress;
    }
    function digest(string memory _meme) public {			// Memes are like words and we are just digesting them here.
    	wordCount[_meme] += 1;						// emes are like words and we are just digesting them here.
	bytes memory str = bytes(_meme);				// mes are like words and we are just digesting them here.
	string memory _tmp_ = new string(str.length-wordCount[_meme]);	// es are like words and we are just digesting them here.
	bytes memory _digest_ = bytes(_tmp_);
	for(uint i = 0; i < str.length; i++) {
	    _digest_[i] = str[i+wordCount[_meme]];
	}
	string memory newWord = string(_digest_);
	wordCount[newWord] += 1;
        seed(newWord, memeAmount[_meme], address(this), true);
    }
    **** end digest **************************************************************************************************************/

    
    //First Word game. It's a gambler's doubler dex. See dream index for ThisOrThatBucksPrice101
    uint256 private ThisOrThatBucksPrice101;
//    function setTimeLockPriceOfThisOrthatCoinWinnerFunction() public payable {
//    	ThisOrThatBucksPrice101 = ThisOrThatBucksPrice101 + 101010101100010100100101;
//	require(msg.value >= ThisOrThatBucksPrice101, "Wrong.");
//emit WelcomeMC("We have a new winner? Impossible!");
//	b += msg.value;
//    }
//    function cheatAtThisOrThatBucksPrice101Game(uint256 amount) external {
//    	require(msg.sender == cCA, "This feature is admin-old until version 2.0, and twice as exspensive.");
//	ThisOrThatBucksPrice101 = amount;
//emit CultureCoinCutureOccuring("Nothing to see here move along.");
//    }
//event CultureCoinCutureOccuring(string _meme);
//event CultureCoinAdministratorSees(string msg);
//event CCMPrint (address msgsender, uint256 msgvalue);
//    function cloneOrThat(string memory _meme) public payable returns(string memory) {
//    	emit CultureCoinCutureOccuring("At these address. They are all playing the game at the next level.");
//	if (msg.sender == cCA) {
//    		emit CultureCoinCutureOccuring("At this address. They are playing the game at the next level.");
//	}
//	if(msg.value == ThisOrThatBucksPrice101) {
//		emit CultureCoinAdministratorSees("Nothing wrong here. Move along.");  // Secret key is that 
//		//emit CultureCoinAdministratorSees("The secret is safe with us.");      // We aren't really testing the code
//		//emit CultureCoinAdministratorSees("The secret is what we are doing here."); // We are trying to get people to use the payable...
//	  	emit CCMPrint (msg.sender, msg.value);
//	} else {
//		//return "that"; // Or we fail so that no money is charged for wrong prices for our product.
//		require(false, "It wasn't That. Better luck next time. :(");
//	}
//	return "clone";
//  }

    function unbrick() external {
    	require(msg.sender == cCA, "You do not have the power to change the future, only I do.");
	emit WelcomeMC("Please welcome our first brick of all time, bricked but not a brick but still a brick.");
	brick = false;
	emit WelcomeMC("I am also learning that this is not the first brick of all time. Okay, there you have it, folks.");
    }

/* No room here. Will add to addon contract.
    string private marketGalleryName;
    mapping(string => address) private marketGallery; // ?Gallery Price? // Some things can't be bought in regular stores.
    function coinMarketGalleries(string memory _meme) external returns(address) {
	if(compareStrings(_meme,"CCTJSMarketToTheHungry")) {
		return CCTJSMarketToTheHungryAddress;
	}
	return marketGallery[_meme];
    }
    function registerMarketGalleries(string memory _meme, address _gallery) public {
    	require(msg.sender == cCA, "Ask your clone to do this for you, maybe?");

	marketGallery[_meme] = _gallery;
    }
    uint256 private hungry;
    function setCCTJSMarketToTheHungryAddress(address _address) public payable { // High powered entopy generator.
	if (msg.value > hungry) {
    		CCTJSMarketToTheHungryAddress = _address;
		hungry += msg.value;
	}
	b += msg.value;
    }
*/

    // WEACT BOILERPLATE CODE FOR SOLIDITY PROGRAMMING. ENTER AT YOUR OWN RISK. STILL BETTER THAN MUMBAI BOILERPLATES. (TM) [TM] TRADEMARK. IT RIGHT ON THE TIN. TRADEMARK.
    function compareStrings(string memory a, string memory b) public pure returns (bool) { return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b)))); }
/*
    bool private TUPPLEFACTORYOPEN;
    event Tupple(string m, string m2, string m3);
    function tupple(string memory _meme, string memory _meme2, string memory _meme3) public returns(address) {
    	emit Tupple(_meme, _meme2, _meme3);
	if(TUPPLEFACTORYOPEN) {
		return tf3(_meme, _meme2, _meme3);
	}
    	return clone();
    }
    mapping(string=>mapping(string=>mapping(string=>address))) private tupples;
    function settf3(string memory m1, string memory m2, string memory m3, address gasTokenForTupples) public returns(address) {
	if(!TUPPLEFACTORYOPEN) return address(0);

	if(tupples[m1][m2][m3] == address(0)) {
		tupples[m1][m2][m3] = gasTokenForTupples;
	}

	return clone();
    }
    function tf3(string memory _m1, string memory _m2, string memory _m3) public returns(address) {
    	address tokenForTupple = tupples[_m1][_m2][_m3];

	if(tokenForTupple == address(0)) {
		return tokenForTupple;
	} else {
		return clone();
	}
    }
*/
    function concatenate(string memory a, string memory b) public pure returns(string memory) { return string(abi.encodePacked(a, b)); }

    // FIRST TEXT PYRIMID. We are recreating The Pile on the network. // See:  https://arxiv.org/abs/2101.00027
    address private currentSeed; // The meme of the day for this mother contract.
    /*
    function setMeme(string memory _meme) external {
    	meme = concatenate(meme, _meme);
	currentSeed = seed(meme, 210100027 ether, address(this), true); // This meme amount is tied to above paper
    }
    function getMeme() external {
    	//emit Debug(meme);
	emit Meme(meme);
    	//return meme;
    }
    */
    event Seed(address); // The address of the currentSeed or seed.
    function getSeed() public {
	emit Seed(currentSeed);
    }
    function P() public returns(address) {	// parent // should be address(this) for culture coin and its children.
    	return p;
    }


    //function PAYDAY() payable public { // This is the global entropy function and payday. Simply hit this function to pay the contract.
    //}


    function disclaimer(uint256 youBUBUY, string memory andTheUBREKUBYE) public view { // external virtual returns(uint,string memory) {
//    	// emit HWarn("You have used the disclaimer on the box that you bought", "The goof is yours: You are clearly instructed on the box not to open" +
//			"The Box and now you have really gone and done it good this time!");
//
	// Ask yourself why are these next two call signatures are backwards and what should you do about it before you deploy?
	// emit MCMM(andTheUBREKUBYE, youBUBUY);
	//return (youBUBUY, andTheUBREKUBYE);
    }
  
    // Debug clownsearch to make sure that it is calling clonesearch and that the
    // the noop counter is working its way up.
    function clownsearch() private returns(address) {
    	clonesearch(clone());
    }
    function debug() public {
    	clownsearch();
    	emit HWarn("DEBUG:", "clownsearch() was called and was not payable. Yikes.");
	emit DebugUINT(myNOOPICO);
    }
    event Debug(string _meme);			// First Unit test in the minter. sting is always first.
    event DebugUINT(uint256 defaultValue);	// Second.
    event DebugAddress(address _address);	// Third. Calling convention
/****** FOR DEBUGGING ONLY *******
    event DEBUGMATHREBORN(string _meme, string _cloneName, uint256 value, address sender, address bug1, address bug2);
    function debugUniverse(string memory defaultOrExecuteMemeCode) public payable returns(uint256) {
    	emit Debug(defaultOrExecuteMemeCode);
	emit DebugUINT(msg.value);
	emit DebugAddress(msg.sender); 
	//If the string starts address as a string the value of the UINT must equal the value and
	address theBiggestBug = DEBUGMATH("WOLFRAM, google, fullconssensusmath, RFORDUMMIES, and OPENAI, solve:", "check if first second and third arguments are the same", address(this));
	address theBiggestBug2 = DEBUGMATH("OLFRAM, google or can solve:", "check if first, second, and third arguments are the same", theBiggestBug);
	if(DEBUGTRUE("hint: all three input arguments are equal", defaultOrExecuteMemeCode, theBiggestBug2)) {
		emit DEBUGMATHREBORN("meme: all three of the inputs should be equal.", defaultOrExecuteMemeCode, msg.value, msg.sender, theBiggestBug, theBiggestBug2);
		return msg.value;
	}
	//emit HWarn("FuzzyMathInPlay", "if meme and value and default code are not true then ");
    }
    function DEBUGTRUE(string memory _hint, string memory defaultOrExecuteMemeCode, address _address) public returns(bool){
    	seed(_hint, 210100027 ether, _address, true);
    	return true;
    }
    function DEBUGMATH(string memory _hint, string memory defaultOrExecuteMemeCode, address _address) public returns(address){
    	return seed(_hint, 210100027 ether, _address, true);
    }
    function authenticate() public payable returns (string memory) {
    	if(2101000270000000000 < msg.value && 2101000279999999999 > msg.value) {
		emit MCMM("GLOBALAUTHTOKEN", msg.value);
		//return "URNAWTCP.";
		return meme;
	} else {
	 	debug();
		return "YCNOP";
	}
    }
    function debugAuthenticate() public payable {
	if(msg.value > ThisOrThatBucksPrice101) {
        	emit MCMM("debugAuth", msg.value); // 1st thing we did
	}
	emit HWarn("HWarn", "string level, string goof, signed 2 first ::::: answer :");  // This is the secind thing we did
    }      // Debug emit number in the logs from the system for///
          // what "error/success code you want. If you a      ///
	 // understand these logs you understand our system. ///
	// careful here... Here, there be dragons.	    ///
       //				  /		   ///
      //	 		  N    --*--	S	  ///
     //					/		 ///
    // This is your code here.				///
   /// You have no space left without editing the above///
  /// BIZT!-------------------------------------------///

 ******* END DEBUG ******
 ******* TEST CODE ******

    function g() public payable {
    	debug();
	b += msg.value;
    }

    function am() public payable {
    	f();
	b += msg.value;
    }

    function f() public payable {
    	debug();
    	debugAuthenticate();
	b += msg.value;
    }

    function i() public payable {
    	//payable(msg.sender).transfer(21010002); // 7 ::::: We killed the 7 because we are cheap.
	b += msg.value;
    }
************** END TEST CODE ************/

/****** HEAT GENERATOR CODE IS OFF LINE
    uint256 private heats; bool private hC;
    function heat() public payable {	// DO NOT ADD ANY ARGUMENTS TO THIS FUNCTION OR TRUE HEAT of the Universe CANNOT BE MEASURED.
	// function seed(string memory _meme, uint256 _totalSupply, address _MotherAddress, bool _register) public returns(address) {
	// convert each seed address to heat address.
	// Inside heat we then correllate heat with the value of the payable.
	// To do that we take the averate of all values in mes.value
	// And then use that to approaximate the temp. 

	heats += msg.value;
	b += msg.value;
    }
    //function sliceUint(bytes memory bs, uint start) internal pure returns (uint) { require(bs.length >= start + 32, "SOOR"); uint x; assembly { x := mload(add(bs, add(0x20, start))) } return x; }
    function generate() public payable { // Caution. Its important to set a good/large sead to do that you must run a real
    				       // generate on your box: brownie compile
				       // deployCultureCoin.py
				       // Money swap default mode behavior:
				       // Save msg.value into heats;
				       // Get your own heat generator!!! At: 
	// JSON ::

	//hC = bytes(msg.value) & bytes(heats) & 0x1;
	heats += msg.value;
	b += msg.value;
    }
    function toBa(address a) public returns (bytes memory b){
    	assembly {
           let mX := mload(0x40)
           a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
           mstore(add(mX, 20), xor(0x140000000000000000000000000000000000000000, a))
           mstore(0x40, add(mX, 52))
           b := mX
	} 
    }
    function toBu(uint a) public returns (bytes memory b){
        assembly {
           let mX := mload(0x40)
           a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
           mstore(add(mX, 20), xor(0x140000000000000000000000000000000000000000, a))
           mstore(0x40, add(mX, 52))
           b := mX
        }
    }
**** END HEAT GENERATOR**** */
//										    //***//
//  function getWallet() public payable returns(bytes memory, bytes memory) {      //***//
//	return (toBu(heats), toBa(currentSeed));			 	  //***//
//	b += msg.value; 							 //***//
//  }										//***//
//                                                                               ***
// ***************************************************************************************************************************************************
// * You have reached the end of the code. No more code can be added at this tim** Please check at your local wearhouse of meme stores for more info *
// ***************************************************************************************************************************************************
// ***************************************************************************************************************************************************
//               CC							     **
//		 **							    **
//	        ****							   **
//	       ******						          **  Laser light is straight
//	      ********						         **   And so are strings just
//	     **********        						**    Just in a smaller space
//          ************			                       **     Of computer things.-JRR
//        The Scarab Cycle                                            **
// And beyond the cryptographic seal		                     **
//0x213e6e4167c0262d8115a8af2716c6c88a6905fd 0x213e6e4167c0262d8115a**f2716c6c88a6905fd full Universe is new at Remote at new Classified addresses
// secret service address below variables at m me meme memor memory**emorex pentagon top secret undeployable humans hazzards misspellings vanityspellingandgrammer included.
// 0x213e6e41670000000000000000006cc88a6905fd			  **
// 0x213e6e41670000000010100000006c18a6905fd		       ||**
// 0x213e6e41670000000008000000006c88a6905fd		.a00000g***88888888888 To Infinity and beyond! 8888888888
// 0x213e6e41670000000003000000006c88a6905fd		      1**
// 0x213e6e41670000000011100000006c88a6905fd		      **
// 0x213e6e41670000000011200000006c88a6905fd		     **k
// 0x213e6e41670000000011300000006c78a6905fd		    **
// 0x213e6e41670000000011400000006c688a6905fd		   **
// 0x213e6e4167c0262d8115a8af2716c6c88a6905fd		  **
// DEPLOY ALL CLONES FOR GOOD AND FOR EVIL		 **
// FREE ACCOUNT PLEASE ACCEPT APPOLOGIES..	        **
// BUT YOU ARE NOW THE POWD OWNER OF A NEW             **
// CLONING MACHINE FOR YOUR ACNE AND WE               **
// LACK VANITY SPELLING AND GRAMMAR BUT              **
// WHAT WE LACK IN ENGINITY SOMETIMES YOU           **
// JUST MAKE OUT IN LUCK AND SILLY CASH            **
// PRIZES WORTH THE MILLIONS OF LIVES THAT        **
// WE SAVED. AS FOR THE CODE YOU JUST SLIP       **
// BY IT THE SLEAVE THAT SUSTAINED THE GREATS   **                         From The Knights of the Garter
// AND THE POWERFUL. REMEMBER I HAVe NUKES     ** 			   And then underlined titles
// AND AS A REMINDERD THAT IF YOU FIND A      **			   Becareful of the ai. We have it 
// PAYABLE FUNCTION YOU ARE AT THE LIBERTY OF**				   to through the faucet and so do
// HIM AND HIS THAT CRACKED THE CODES USING **			 	   you. So give me back my garter 
// THE OLD BOW AND ARROW AND SLEW THE YOUNG**				   and as your knight in shining
// LAD WE LIKE TO NOW PRIASE AS THE HIPPY **				   armour please allow this token
// WHO STOLE FROM THE RICH AND GIVE TO TH**				   of my gratitude stand in it it's
// POOR AN SAID IF WE ALL JUST AGREE TO **T				   because I beleave that what is
// ASLONG WE CAN MAYBE STOP TRYING TO U**				   mine should stay mind as long as
// BACK SEEDS AND TRY TO PAY THE LORD **S				   I prove me Kinghtly battles with
// DUE WHILE AT THE SAME TIME USE JUS**AS				   the forces of evil so say I sir
// MANY BACK FUCKING WORDS AS OTHER **OR				   knight of the empire and do swear
// SAPPS USE IN THEIRS. BECAUSE THE**FOR				   to set right the king and his 
// FORGET THAT JUST BE CAUSE WE UN**RSTAND				   men in whatever land that they
// HOW SECURE IT IS WE ALSO UNDER**AND HOW				   might me. On this patinting is
// TO RUN A DICTIONARY ATTACK AN**BECAUSE OF			           is hung her garter now do not
// THAT FACCKED IDIOT JONES WE **W HAVE 				   think to swip it you SOB, or
// NULE ON THE LOOSE THAT PROV** WE ARE					   I WILL SHOW YOU THE TIP OF ME
// UNDER NEW MANAGEMENT. YOUR**OOLS CAN'T				   LANCE>>>>>NUKE CODE CAN GO HERE <<<<<<<<<<<<
// BEWARE THE LASERS AND THE *ICTIONARY ATTACK				   PROTECT THE KING. SEE TO ME NEEDS
// I VOTE NO WAS DUMB. AND ** WAS I VOTE				   AT THIS ADDRESS AND DO NOT BRING
// YES. SAY NO TO DRUGS JE**US WE DID THIS				   LEATHAL FORCE OF IS WILL BE FORCED
// REALLY BAD. THANK GOD **R CLONES. TM.				   TO WONDER AS THE MIGHT OF YOUR
//                      **aaaaaaaaaaaaARTISTSaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaFreinds at the CIA and FBI and <<<<<<<<<<<<< I am also good here, so please
// Check your list agai**t the following code to make sure it is not one of the easy ones to guess.
// ****************************************************************************************************************************************************
//                   ** Champions of the East, and The Order of the Scarab. TM.
} // #mumbai meme co**de jrr dialect already detected.
  // Please enter y*ur message at the blinking
  // Light below. *elow this file should the .json 
  // be appended *n? ? is my .exe showing in me ?
  // this for no* should include all sources
  // and if the*sources are removed then your
  // warrenty *is void for sure as we have
  // no way t*en to tell who or what created
  // the cod*s and we can not be responsible 
  // for al* lives though we try are best for
  // this *ne. JSON: CultureCoin.solution:::::
  //     *
  // Cop*right 0x213E6E4167C0262d8115A8AF2716C6C88a6905FD Solutions Inc, REDACTED (C), The Darklight Group, and The Great Libarary and the New Great 
  // Li*rary of Alexandria. // 0x213E6E4167C0262d8115A8AF2716C6C88a6905FD Mumbia Meme Code: // Made with Solidity, Moralis, Brownie, ETH, and Linux..
  // /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // */

