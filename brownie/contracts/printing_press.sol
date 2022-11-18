// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./BookTradable.sol";
import "./CultureCoin.sol";
import "./send_receive.sol";
import "../openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract PrintingPress is Receiver, ReentrancyGuard { // is Ownable { // because require(msg.sender == address(________) // clone ::::: see json ::::

        address private log;
	mapping(address => uint256) private B; // CC balance on this minter.
	function getBalance(address _whom) public view returns(uint256) {
		return B[_whom];
	}
	function addBalance(address _whom) public payable {
		//address.function{value:msg.value}(arg1, arg2, arg3)
		uint256 ccAmount = CultureCoin(gasToken).dexXMTSPIn{value:msg.value}();
		B[_whom] += ccAmount;
	}
	function addBalanceCC(address _whom, uint256 _amount) public {
		//CultureCoin(gasToken).transferFrom(_whom, address(this), _amount); // This would require an approval...
		uint256 xAmount = CultureCoin(gasToken).dexCCInFrom(msg.sender, _amount);
		uint256 ccAmount = CultureCoin(gasToken).dexXMTSPIn{value:xAmount}();
		B[_whom] += ccAmount;
	}

	function withdraw(uint256 _amount) public {
		CultureCoin(gasToken).transferFrom(address(this), msg.sender, _amount);
		B[msg.sender] -= _amount;
	}

	event PairPrinted(address parent, address child, uint256 parentId, uint256 childId);
	function mintPair(address _to, address _NBT, uint256 _amount, uint256 _gasRewards) public nonReentrant {
		BookTradable NBT = BookTradable(_NBT);

		// Me as written.... //Ownercheck. Non-transferable via any contract market I know of yet.. ::
		require(cCA == msg.sender || msg.sender == NBT.owner(), "Admin only.");
		_mintPair(_to, _NBT, _amount, _gasRewards);
	}
	function _mintPair(address _to, address _NBT, uint256 _amount, uint256 _gasRewards) private {
		BookTradable NBT = BookTradable(_NBT);

	    	//function getRewards(uint256 _tokenId) external view returns(address, uint256) { return(rewardContract, rewardTokenId[_tokenId]);}
		(address _rewardsContract, ) = NBT.getRewards(0);
		BookTradable CHILD = BookTradable(_rewardsContract);
		uint256 childTokenId = CHILD.addonMintTo(_to);
		uint256 parentTokenId = NBT.addonMintTo(_to);

		NBT.setRewardToken(parentTokenId, childTokenId);	// Makes it so the tramserfer is nested.

		CultureCoin CC = CultureCoin(gasToken);
		CC.approve(address(NBT), _amount);
		CC.approve(address(CHILD), _amount);

		NBT.fillGasTank(parentTokenId, _amount, _gasRewards);
		CHILD.fillGasTank(childTokenId, _amount, _gasRewards);

		B[msg.sender] -= _amount * 2;

		emit PairPrinted(address(NBT), address(CHILD), parentTokenId, childTokenId);
	}
        function delegateMinter (address _to, address _NBT, uint _tokenMax, uint _amount, uint _gasRewards) public nonReentrant {
                BookTradable NBT = BookTradable(_NBT);     //_NBT stands for Daedalus Class Booster Token and it is the token address being boosted here. TLSCBM, etc, ...

		// Me as written.... //Ownercheck. Non-transferable via any contract market I know of yet.. ::
		require(cCA == msg.sender || msg.sender == NBT.owner(), "You do not admin of this printing press."); 

		require(B[msg.sender] >= _amount * 2 * _tokenMax,  "Need more CC on the books.");

		_delegateMinter(_to, address(NBT), _tokenMax, _amount, _gasRewards);

		B[msg.sender] -= _amount;
	}
        function _delegateMinter (address _to, address _NBT, uint _tokenMax, uint _amount, uint _gasRewards) private {
                BookTradable NBT = BookTradable(_NBT);     //_NBT stands for Daedalus Class Booster Token and it is the token address being boosted here. TLSCBM, etc, ...

		for(uint256 i = 0; i < _tokenMax; i++) {
			_mintPair(_to, _NBT, _amount, _gasRewards);
		}
        }

	function buyBook(address _NBT) public payable nonReentrant {
		BookTradable NBT = BookTradable(_NBT);

		require(NBT.totalSupply() >= NBT.getDefaultFrom(), "Not yet.");
		require(NBT.getDefaultPrice() <= msg.value, "More.");

		uint256 extraX = msg.value - NBT.getDefaultPrice();
		uint256 msgValue = msg.value - extraX;

		uint256 ccExtra = CultureCoin(gasToken).dexXMTSPIn{value:extraX}();
		uint256 ccBulk = CultureCoin(gasToken).dexXMTSPIn{value: msg.value - extraX}();

        	uint256 operatorCut = (ccBulk * operatorFee) / 100;          // Divide to make it a percent.

        	B[NBT.owner()] += ccBulk - operatorCut;
        	B[cCA] += operatorCut;

		B[msg.sender] += ccExtra;

		(address _rewardsContract, ) = NBT.getRewards(0);
		if(address(0) != _rewardsContract) {
			_mintPair(address(this), _NBT, ccExtra/2, ccExtra/4) ;
		} else {
			uint256 tokenId = NBT.addonMintTo(address(this));
			CultureCoin(gasToken).approve(address(NBT), ccExtra);
			NBT.fillGasTank(tokenId, ccExtra, ccExtra/2);
			B[msg.sender] -= ccExtra;
		}

		NBT.safeTransferFromRegistry(address(this), msg.sender, NBT.totalSupply());
	}


    	address operator;
    	address private cCA; 	/// Adminisistrator 
    	address private gasToken;   /// culturecoin.
	uint256 private operatorFee = 1;
    	constructor (address _cCA, address _gasToken) { // me :: me :: culturecoin
		cCA = _cCA;
		gasToken = _gasToken;

		operatorFee = 1;
    	}
	function setOperatorFee(uint256 _operatorFee) public {
		require(msg.sender == cCA);
		
		operatorFee = _operatorFee;

	}

    	// /// To the Moon. Hold on to your books boys, we are shooting this baby to the moon. And back. /// //
    	event BookContract(address who, address what);  // <--author,nbt // see culture coin
    	function newBookContract(string memory _name, string memory _symbol, address _bookRegistryAddress, string memory _baseuri,
                                        bool _burnable, uint256 _maxmint, uint256 _defaultprice, uint256 _defaultfrom,
					address _mintTo) public returns(address) { //, address _gasToken) {

		//require(cCA == msg.sender || _mintTo == cCA, "Admins only.");
    		BookTradable book =  new BookTradable(_name, _symbol, _bookRegistryAddress, _baseuri, _burnable, _maxmint, _defaultprice, _defaultfrom, gasToken, cCA);
		book.transferOwnership(_mintTo);

		//book.setAddon(address(this)); // would be nice...
		
		emit BookContract(_mintTo, address(book));
		return address(book);
    	}

    	function retireBookContract(address _a) public {
        	require(msg.sender == cCA || msg.sender == operator, "no");
    	}

}
