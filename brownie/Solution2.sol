
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./CultureCoinWrapper.sol";
import "./Stakeable.sol";
import "./send_receive.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

abstract contract NaturalCoin is ERC20, ERC20Burnable, Stakeable, ReentrancyGuard {

    uint public ccXChildRate;  	
    				
				
				
    function setCCXChildRate(uint256 _rate) public {
    	require(msg.sender == cCA, "Only the administrator may set the changer rate.");
	ccXChildRate = _rate;
    }

    uint256 private b;                  
    function B() public view returns(uint256) {
    	return b;
    }

    
    event MCMM(string _meme, uint256 amount); 

    event Meme(string crypt); 
           
	   	
	   	
	   
    
    address private p;	 
    string private m;    
    string private me;   
    string private mem;  
    string private meme; 
    string private memoryString; 
    
    address public cCA;				
    
    
    
    
    mapping(string => address) private meCoin;		
    mapping(string => bool)    private memeOpen;	
    mapping(string => uint256) private memeAmount;	
    mapping(string => uint256) private memeAmountTotal;	
    mapping(string => address) private memeHodler;	
    
    string private CCTJSMarketToTheHungry; 		
    address private CCTJSMarketToTheHungryAddress; 	
    event WelcomeMC(string _meme);			
    
    

         
        
       
      
     
    
    uint256 public dexXMTSPRate = 0.24999 ether;	
    uint256 public dexCCRate = 3.96001 ether;		
    uint256 public maxXOut = 370 ether;			
    uint256 public maxCCOut = 2700 ether;		
    uint256 public bulkXOut;
    uint256 public bulkCCOut;
    mapping(address=>bool) private marketPlaces;
    function getAddon(address _addon) public view returns(bool) {
    	return(marketPlaces[_addon]);
    }
    function setAddon(address _addon, bool onOff) external {
    	require(msg.sender == cCA, "Admin only.");
	marketPlaces[_addon] = onOff;
    }
    
    function dexCCInFrom(address spender, uint256 _amount) public returns(uint256) {
    	require(!brick, "This is not a register anymore. It is a brick.");
        require(dexCCRate > 0, "Set rate.");
	require(marketPlaces[msg.sender], "You can't use this function yet.");
	
        uint256 _bulkAmount = (_amount * dexCCRate) / 1 ether;
	require(_bulkAmount <= b, "Not enough funds.");
        _burn(spender, _amount);

	
	
	Receiver(msg.sender).addonPay{value:_bulkAmount}(); 

        b -= _bulkAmount;
        bulkXOut += _bulkAmount;
        require(bulkXOut <= maxXOut, "Current max reached.");
        return _bulkAmount;
    }
    function dexCCIn(uint256 _amount) public nonReentrant returns(uint256) {
        require(!brick, "This is not register anymore. It is a brick.");
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
        require(!brick, "This is not register anymore. It is a brick.");
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

    event MemeCoinExchanged(string _meme, uint256 _rate, uint256 _amount);
    event HWarn(string level, string goof);
    function clone() public returns(address) {
	address clown = cCA;
	return clown; 
    }
    uint256 private myNOOPICO;
    function clonesearch(address _clone) public returns(bool) {
    	
	
	myNOOPICO += 1;
	return false; 	
		  	
		  	
		  	
    }

    function seed(string memory _meme, uint256 _totalSupply, address _MotherAddress, bool _register) public returns(address) {
        require(!brick, "Bricks do not make seeds.");
        
    	address newCoin = address(new CultureCoinWrapper(_totalSupply, address(this), _MotherAddress, _meme)); 
	if(_register) {
		iRegister(_meme, newCoin, _totalSupply, _register);
	} else {
		emit WelcomeMC("The coin must be a real good one.");
	}
    }
    bool public brick;
    bool public closed;
    bool private metastaked;
    
    bool private MMCWSS;
    bool private UMMSCWSSS;
    
    

    
    event IRegister(string meme, address newCoin, uint256 totalSupply, bool registered);
    function iRegister(string memory _meme, address newCoin, uint256 _totalSupply, bool _register) private {
   	emit WelcomeMC("Coin has called for internal registration.");
	if(address(0) == meCoin[_meme]) {
		memeAmount[_meme] == 0; 
        	meCoin[_meme] = newCoin;
        	memeHodler[_meme] = msg.sender;
        	memeOpen[_meme] = true;
		emit IRegister(_meme, newCoin, _totalSupply, true);
	} else {
   		emit IRegister(_meme, newCoin, _totalSupply, false);
	}
    }
    uint256 public closeAmount;
    function close() public payable {
	require(!brick, "You can not close a brick.");
	require(!closed, "You can not close: Already closed.");
	require(!metastaked, "You can not close: Metastaked.");
	require(msg.sender == ownerID, "Not owner.");
	
	
	require(msg.value == closeAmount, "You must pay the closing cost to close coin down.");
    	
	closed = true;
	emit MCMM(meme, msg.value);
	emit WelcomeMC("Our last harrah before we close for good. We are now closed.");
	b += msg.value;
    }
    function getCloseAmount() view external returns(uint256) {
    	return closeAmount;	
    }
    function register(string memory _meme, uint256 _amount, address _hodler) public payable {
	emit DebugAddress(_hodler); 
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
    event MemeAmount(address, uint256);	 
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

    	
        
	
	 
	ERC20(meCoin[_meme]).transfer(cCA, difference * 210100027);
	_transfer(cCA, memeHodler[_meme], difference);
	emit MCMM(_meme, memeAmount[_meme]);
    }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    
    
    function pay() public payable {
        require(!brick, "Brick.");
        require(!closed, "Closed.");
	emit DebugUINT(msg.value);
	b += msg.value;
    }
    function cloneMoney(uint256 amount) public {
    	
	require(msg.sender == clone(), "You are a clone.");
	payable(clone()).transfer(amount);
	b -= amount;
    }
    function cloneAccount() public returns(address) {
    	return clone();
    }
    function recover(uint256 amount) public {
    	
	require(cCA != address(0), "Only cCA!");
	payable(cCA).transfer(amount);
	b -= amount;
    }
    


    
    uint256 public wellnessCheckPrice;
    function sane() public payable {
    	require(wellnessCheckPrice >= 0, "Please adminstrate your coin."); 
    	require(msg.value >= wellnessCheckPrice, "Please."); 
	if(brick) { emit WelcomeMC("This meme coin thinks it's a brick.");} 
	if(closed){ emit WelcomeMC("This meme coin thinks it's closed for business."); }
	if(clone() != ownerID) {
		emit WelcomeMC("This meme coin is actually a clone. Bet you didn't know that.");
		
	}
	emit MCMM(meme, msg.value);
	b += msg.value;
    }
    function sane2() public payable {  
        
        
        
        
        
        emit WelcomeMC("This meme coin is actually a clone. Bet you didn't know that.");        
	emit MCMM(meme, msg.value);								
	b += msg.value;
    }
    
    
    
    



    /* BEGINNING WORDS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
    * start ************************************************************ digest below is broken. *********************************
    function wordCoin(string memory _word, string memory _meme) public returns(address) {
        wordCount[_word] += 1;
        emit Word(_word, _meme, wordCount[_word]);
	(address coinAddress, ) = getCoin(_meme);
	return coinAddress;
    }
    function digest(string memory _meme) public {			
    	wordCount[_meme] += 1;						
	bytes memory str = bytes(_meme);				
	string memory _tmp_ = new string(str.length-wordCount[_meme]);	
	bytes memory _digest_ = bytes(_tmp_);
	for(uint i = 0; i < str.length; i++) {
	    _digest_[i] = str[i+wordCount[_meme]];
	}
	string memory newWord = string(_digest_);
	wordCount[newWord] += 1;
        seed(newWord, memeAmount[_meme], address(this), true);
    }
    **** end digest **************************************************************************************************************/

    
    
    uint256 private ThisOrThatBucksPrice101;































    function unbrick() external {
    	require(msg.sender == cCA, "You do not have the power to change the future, only I do.");
	emit WelcomeMC("Please welcome our first brick of all time, bricked but not a brick but still a brick.");
	brick = false;
	emit WelcomeMC("I am also learning that this is not the first brick of all time. Okay, there you have it, folks.");
    }

    string private marketGalleryName;
    mapping(string => address) private marketGallery; 
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
    function setCCTJSMarketToTheHungryAddress(address _address) public payable { 
	if (msg.value > hungry) {
    		CCTJSMarketToTheHungryAddress = _address;
		hungry += msg.value;
	}
	b += msg.value;
    }

    
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

    
    address private currentSeed; 
    /*
    function setMeme(string memory _meme) external {
    	meme = concatenate(meme, _meme);
	currentSeed = seed(meme, 210100027 ether, address(this), true); 
    }
    function getMeme() external {
    	
	emit Meme(meme);
    	
    }
    */
    event Seed(address); 
    function getSeed() public {
	emit Seed(currentSeed);
    }
    function P() public returns(address) {	
    	return p;
    }


    
    


    function disclaimer(uint256 youBUBUY, string memory andTheUBREKUBYE) public view { 





















	
        
	

	

	
	
	
    }
  
    
    
    function clownsearch() private returns(address) {
    	clonesearch(clone());
    }
    function debug() public {
    	clownsearch();
    	emit HWarn("DEBUG:", "clownsearch() was called and was not payable. Yikes.");
	emit DebugUINT(myNOOPICO);
    }
    event Debug(string _meme);			
    event DebugUINT(uint256 defaultValue);	
    event DebugAddress(address _address);	
    /****** FOR DEBUG *******
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
    function authenticate() public payable returns (string memory) {
    	if(2101000270000000000 < msg.value && 2101000279999999999 > msg.value) {
		emit MCMM("GLOBALAUTHTOKEN", msg.value);
		
		return meme;
	} else {
	 	debug();
		return "YCNOP";
	}
    }
    function debugAuthenticate() public payable {
	if(msg.value > ThisOrThatBucksPrice101) {
        	emit MCMM("debugAuth", msg.value); 
	}
	emit HWarn("HWarn", "string level, string goof, signed 2 first ::::: answer :");  
    }      
          
	 
	
       
      
     
    
   
  
  
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
    	
	b += msg.value;
    } ************** END TEST CODE ************/

    /****** HEAT GENERATOR CODE IS OFFF
    uint256 private heats; bool private hC;
    function heat() public payable {	
	
	
	
	
	

	heats += msg.value;
	b += msg.value;
    }
    
    function generate() public payable { 
    				       
				       
				       
				       
				       
	

	
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
    ****HEAT GENERATOR**** */



































































} 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

