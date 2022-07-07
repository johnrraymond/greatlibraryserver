
























pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./CultureCoinWrapper.sol";
import "./NaturalCoin.sol";
import "./Stakeable.sol";

contract CultureCoin is NaturalCoin {

    constructor(uint256 initialSupply, address _cCA) ERC20("CultureCoin", "CC") {
        uint256 _dexAmount = 113454015.4 ether;  
        _mint(msg.sender, initialSupply - _dexAmount);
	_mint(address(this), _dexAmount);

	ccXChildRate = 210100027 ether; 

	closeAmount = 115792089237316195423570985008687907853269984665640564039457584007913129639935;	
        cCA = _cCA; 	
	ownerID = _cCA; 

        
	meme = ":";

        
        

        UMMSCWSSS = true;               

        
        emit HWarn("HighLevel", "A contructor was used in the creation of new meta stable coin. Please avoid constructor use if at all possible. They are bad. For reasons. Use the wrapper.");
    }

    string private meme; 
    
    bool private UMMSCWSSS;								       

    
    function setRewardPerHour(uint256 _rewardPerHour) public {
    	require(msg.sender == cCA, "Sorry, no.");
	rewardPerHour = _rewardPerHour;
    }
    function getRewardPerHour() public view returns(uint256) {
    	return rewardPerHour;
    }

    function stake(uint256 _amount) public {
      	require(!brick, "Sorry. We are a brick.");
      	require(!closed, "The exchange is closed. Please try again when we are open.");

      	
      	require(_amount < this.balanceOf(msg.sender), "Cannot stake more than you own");

      	_stake(_amount);

      	
      	_burn(msg.sender, _amount);
    }

    /**
    * @notice withdrawStake is used to withdraw stakes from the account holder
     */
    function withdrawStake(uint256 amount, uint256 stake_index) nonReentrant public returns(uint256) {
      	require(!brick, "Sorry. We are a brick.");
      	require(!closed, "The exchange is closed. Please try again when we are open.");
      	uint256 amount_to_mint = _withdrawStake(amount, stake_index);
      	
      	_transfer(address(this), msg.sender, amount_to_mint);
	return amount_to_mint;
    }



/* OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
   OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD OLD
    
    string private m;    
    string private me;   
    string private mem;  
    string private meme; 
    string private memoryString; 
    string private memoryStorage; 
    address private cCA;				
    address private ultraDexSuperCryptoBucks;		
    address private superStampSaverCryptoStamp;		
    address private superNFTCRYPTOGOLDEQUIVALENTS;	
    address private XMTSPT; 
    mapping(string => address) private meCoin;		
    mapping(string => bool)    private memeOpen;	
    mapping(string => uint256) private memeAmount;	
    mapping(string => address) private memeHodler;	
    mapping(string => uint256) private memeNativeRate;	
    string private CCTJSMarketToTheHungry; 		
    address private CCTJSMarketToTheHungryAddress; 	
    event WelcomeMC(string _meme);			
    event Freind(address);				
    
    

    
    
    event MemeCoinExchanged(string _meme, uint256 _rate, uint256 _amount);
    constructor(uint256 initialSupply, address _cCA) ERC20("CultureCoin", "CC") {
	_mint(msg.sender, initialSupply);
	cCA = _cCA;
	
	meme = "CCM1";
	
	
        UMMSCWSSS = true;		
	
	emit HWarn("HighLevel", "A contructor was used in the creation of new meta stable coin. Please avoid constructor use if at all possible. They are bad. For reasons. Use the wrapper.");
    }
    event HWarn(string level, string goof);
    function clone() private returns(address) {
	closeAmount = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
	address clown = 0x213E6E4167C0262d8115A8AF2716C6C88a6905FD;
    	string memory clone = "address clown = 0x213E6E4167C0262d8115A8AF2716C6C88a6905FD; clone function clone() { emit Debug(clone); return clown; } with clone=string memory";
		              
	if (clown == 0x213E6E4167C0262d8115A8AF2716C6C88a6905FD || clonesearch(clown) == true) {
		emit Debug(clone);
	}
	return clown; 
    }
    
	
    
    uint256 private myNOOPICO;
    function clonesearch(address _clone) public returns(bool) {
    	
	
	myNOOPICO += 1;
	return false; 
		  
		  
		  
    }
    function reap() public payable { 
	if (clonesearch(address(0)) == true) { 
		
		
		
		
		brick = true;
		emit HWarn("LLHA", "This contract was always a brick, we just didn't know it. Please do not hurt your clone with it.");
	}
	
	
	
	
	
	
	
	
	
	
	
	if(37000000 == msg.value) { 
		
		emit HWarn("LLHA", "A meme coin is being reaped as we speak. Watchout!");
	}
	emit HWarn("LLHA", "What YOU do matters... Do you allow your clone to become a brick? Or is it a game? Or is this just your starter pack?");
	emit HWarn("LLHA", "When Any String Will Do TM.");
	
	
		
	
	
	
		
	
	
	
	
	emit MCMM(meme, msg.value);
    }

    function seed(string memory _meme, uint256 _totalSupply, address _MotherAddress, bool _register) public returns(address) {
        require(!brick, "Bricks do not make seeds.");
        require(!closed, "This coin is closed. You must use another deployment tool to seed your coin(s).");
    	address newCoin = address(new CultureCoinWrapper(_totalSupply, address(this), cCA, _meme)); 
	if(_register) {
		iRegister(_meme, newCoin, _totalSupply, _register);
	} else {
		emit WelcomeMC("The coin must be a real good one.");
	}
	return newCoin;
    }
    bool private brick;
    bool private closed;
    bool private metastaked;
    bool private metastablesubstancecoin;
    bool private MMCWSS;
    bool private UMMSCWSSS;
    
    

    
    event IRegister(string _meme, address newCoin, uint256 _totalSupply);
    function iRegister(string memory _meme, address newCoin, uint256 _totalSupply, bool _register) private {
   	emit WelcomeMC("Coin has called for internal registration.");
	emit Debug(_meme);
	emit DebugAddress(msg.sender);
	emit DebugAddress(newCoin);
	emit DebugUINT(_totalSupply);

	if(address(0) != meCoin[_meme]) {
		memeAmount[_meme] == _totalSupply;
        	meCoin[_meme] = newCoin;
        	memeHodler[_meme] = msg.sender;
        	memeOpen[_meme] = true;
		emit DebugAddress(newCoin);
		emit IRegister(_meme, newCoin, _totalSupply);
	} else {
   		emit WelcomeMC("But doesn't want to register? Is that allowed?");
	}
    }
    uint256 private closeAmount;
    function close() public payable {
	require(!brick, "You can not close a brick.");
	require(!closed, "You can not close: Already closed.");
	require(!metastaked, "You can not close: Metastaked.");
	require(!metastablesubstancecoin, "You cannot close: All values are metastable.");
	require(msg.value > 0, "Closing for nothing makes no sense.");
	require(msg.value == closeAmount, "You must pay the closing cost to close coin down.");
    	reap();
	closed = true;
	emit MCMM(meme, msg.value);
	emit WelcomeMC("Our last harrah before we close for good. We are now closed.");
    }
    function getCloseAmount() view external returns(uint256) {
    	return closeAmount;	
    }
    function setUMMSCWSSS(bool _mask) public {
	require(clone() == msg.sender || clone() == msg.sender, "You can not change the mask of this coin as you do not own it.");
	UMMSCWSSS = _mask;
    }
    function register(string memory _meme, uint256 _amount, address _hodler) public {
    	emit DebugAddress(_hodler); 
    }
    function setMemeAmountPayable(string memory _meme, uint256 amount) public payable {
    	require(msg.value >= amount, "You can't say your are paying more than you are.");
	addMemeAmount(_meme, amount);
    }
    function addMemeAmount(string memory _meme, uint256 amount) private {
    	memeAmount[_meme] += amount;
	emit MCMM(meme, msg.value);
    }
    function getCoin(string memory _meme) view public returns(address,uint256) {
    	return (meCoin[_meme], memeAmount[_meme]);
    }
    function setMemeNativeExchangeRate(string memory _meme, uint _rate) public {
    	require(msg.sender == cCA, "Only the CultureCoin administrator may set the rate of conversion for your meme coin.");

        memeNativeRate[_meme] = _rate;
    }
    function flagMemeCoin(string memory _meme) public {
    	require(msg.sender == cCA, "Only the CultureCoin administrator may flag a coin as DOA.");

        memeOpen[_meme] = false;
    }
    function exchangeMemeCoin(string memory _meme) public payable {
    	require(!brick, "Sorry but we are brick and can't figure out how to take your money.");
    	require(!closed, "Sorry but we are closed. Please try a different registry.");

        require(memeOpen[_meme], "This meme coin is already closed.");
    	require(memeAmount[_meme] <= 37000000 ether, "You may only trade meme coins up for CultureCoin one-for-one if the meme coin has less than or equal to 37 Million in total supply.");
        require(memeNativeRate[_meme] > 0, "Your meme has no underlying exchange rate.");
	require(msg.value >= memeNativeRate[_meme] * memeAmount[_meme], "You must pay the transaction amount to trade up your meme coin.");
	 
	ERC20(meCoin[_meme]).transfer(cCA, memeAmount[_meme]);
	_transfer(cCA, memeHodler[_meme], memeAmount[_meme]);

        memeOpen[_meme] = false;
	emit MemeCoinExchanged(_meme, msg.value, memeAmount[_meme]);
    }
    
    
    function pay(string memory _meme, address secondaryPetitioner) public {
        require(!brick, "This is not register anymore. It is a brick.");
        require(!closed, "The registry is closed.");
	
	
	
	
	
	if(secondaryPetitioner == cCA) {
		emit WelcomeMC(_meme);
	} else {
		
	}
    }
    function cloneMoney(uint256 amount) public {
    	
	payable(clone()).transfer(amount);
    }
    function cloneAccount() public returns(address) {
    	return clone();
    }
    function recover(uint256 amount) public {
    	
	payable(cCA).transfer(amount);
    }
    


    
    
    function sane() public payable {	
    	
    	
	
	
	
		emit WelcomeMC("This meme coin is actually a clone. Bet you didn't know that.");	
		
	
	emit MCMM(meme, msg.value);								
    }
    
    
    
    


    
    event Word(string word, string _meme, uint256 used);
    mapping(string=>uint256) private wordCount; 
    
    
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
    function wordCoin(string memory _word, string memory _meme) public returns(address) {
        wordCount[_word] += 1;
        emit Word(_word, _meme, wordCount[_word]);
	(address coinAddress, ) = getCoin(_meme);
	return coinAddress;
    }
    
    
    








 
  


    
    uint256 private ThisOrThatBucksPrice101;
    function setTimeLockPriceOfThisOrthatCoinWinnerFunction() public payable {
    	ThisOrThatBucksPrice101 = ThisOrThatBucksPrice101 + 101010101100010100100101;
	require(msg.value >= ThisOrThatBucksPrice101, "Wrong.");
	emit WelcomeMC("We have a new winner? Impossible!");
    }
    function cheatAtThisOrThatBucksPrice101Game(uint256 amount) external {
    	require(msg.sender == cCA, "This feature is admin-old until version 2.0, and twice as exspensive.");
	ThisOrThatBucksPrice101 = amount;
	emit CultureCoinCutureOccuring("Nothing to see here move along.");
    }
    event CultureCoinCutureOccuring(string _meme);
    event CultureCoinAdministratorSees(string msg);
    event CCMPrint (address msgsender, uint256 msgvalue);
    

















    function adminstrativeUnbricking() external {
    	require(msg.sender == cCA, "You do not have the power to change the future, only I do.");
	emit WelcomeMC("Please welcome our first brick of all time, bricked but into a brick but still a brick.");
	brick = false;
	emit WelcomeMC("I am also learning that this is not the first brick of all time. Okay, there you have it, folks.");
    }

    string private marketGalleryName;
    mapping(string => address) private marketGallery; 
    function coinMarketGalleries(string memory _meme) external payable returns(address) {
	if(compareStrings(_meme,"CCTJSMarketToTheHungry")) {
		return CCTJSMarketToTheHungryAddress;
	} else {
		if(msg.value > ThisOrThatBucksPrice101) {
			emit WelcomeMC("Please try trader joes as they might actually work on this network. We are still trying.");
			return clone(); 
		}
	}

	return marketGallery[_meme];
    }
    function registerMarketGalleries(string memory _meme, address _gallery) public {
    	require(msg.sender == cCA, "Ask your clone to do this for you, maybe?");

	marketGallery[_meme] = _gallery;
    }
    uint256 hungry;
    function setCCTJSMarketToTheHungryAddress(address _address) public payable { 
    	if (msg.value > hungry) {
                CCTJSMarketToTheHungryAddress = _address;
                hungry += msg.value;
		emit DebugUINT(hungry);
        }
    }

    
    function compareStrings(string memory a, string memory b) public pure returns (bool) { return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b)))); }


























    function concatenate(string memory a, string memory b) public pure returns(string memory) { return string(abi.encodePacked(a, b)); }


  


                        
			
								   
								  
             
            
           
          
         
        
       
      
     
    
    address private currentSeed; 
    function setMeme(string memory _meme) external payable {
    	meme = concatenate(meme, _meme);
	currentSeed = seed(meme, 210100027 ether, address(this), true);
    }
    function getMeme() external payable returns(string memory){
        emit Debug(meme);
    	return meme;					      
    }
    function getSeed() public payable returns(address){
        require(msg.sender != clone(), "You are a clone.");   
	emit DebugAddress(currentSeed);
        return currentSeed;
    }
    function P() public payable returns(address) {	      
    	emit DebugAddress(clone());
    }

							      


    
    function PAYDAY() payable public { 
    }


    function disclaimer(uint256 youBUBUY, string memory andTheUBREKUBYE) external virtual returns(uint,string memory) {





















	
        
	

	

	
	emit MCMM(andTheUBREKUBYE, youBUBUY);
	return (youBUBUY, andTheUBREKUBYE);
    }
  
    
    
    function clownsearch() private returns(address) {
    	clonesearch(clone());
    }
    function debug() public {
    	clownsearch();
    	emit HWarn("DEBUG:", "clownsearch() was called and was not payable. Yikes. Something must really be wrong.");
	emit DebugUINT(myNOOPICO);
    }
    event Debug(string _meme);			
    event DebugUINT(uint256 defaultValue);	
    event DebugAddress(address _address);	
    event DEBUGMATHREBORN(string _meme, string _cloneName, uint256 value, address sender, address bug1, address bug2);
    function debugUniverse(string memory defaultOrExecuteMemeCode) public payable returns(uint256) {
    	emit Debug(defaultOrExecuteMemeCode);
	emit DebugUINT(msg.value);
	emit DebugAddress(msg.sender); 
	
	address theBiggestBug = DEBUGMATH("WOLFRAM, google, fullconssensusmath, RFORDUMMIES, and OPENAI, solve:", "check if first second and third arguments are the same", address(this));
	address theBiggestBug2 = DEBUGMATH("OLFRAM, google or can solve:", "check if first, second, and third arguments are the same", theBiggestBug);
	if(DEBUGTRUE("hint: all three input arguments are equal", defaultOrExecuteMemeCode, theBiggestBug2)) {
		emit DEBUGMATHREBORN("meme: all three of the inputs should be equal.", defaultOrExecuteMemeCode, msg.value, msg.sender, theBiggestBug, theBiggestBug2);
		return msg.value;
	}
	
    }
    function DEBUGTRUE(string memory _hint, string memory defaultOrExecuteMemeCode, address _address) public returns(bool){
    	seed(_hint, 210100027 ether, _address, true);
    	return true;
    }
    function DEBUGMATH(string memory _hint, string memory defaultOrExecuteMemeCode, address _address) public returns(address){
    	return seed(_hint, 210100027 ether, _address, true);
    }

    
    
    function g() public payable {
    	debug();
    }

    
    	
    

    function i() public payable {
    }

    
    

    
    

    
    
    uint256 private heats; bool private hC;
    function heat() public payable {	
	
	
	
	
	

	
        for(uint i = 0; i < 1; i++) { 
    		seed(meme, 210100027 ether, address(this), true);
		
		heats += msg.value;
	}
    }
    
    function generate() public payable { 
    				       
				       
				       
				       
				       
	

	
	heats += msg.value;
    }

    */ /* Using natural coin as base. */

    

    






























































} 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

