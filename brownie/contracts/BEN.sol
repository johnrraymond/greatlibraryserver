// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./DaedalusClass.sol";
import "./BookTradable.sol";
import "./CultureCoin.sol";
import "../openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

/** BEN the AI cat. He creates tokens here as well as in his litter box.
 *  Currently you may pet him and he gives you scratches. These scraches
 *  are BookTradables that can be traded on our marketplace. These are a
 *  good simple microstransaction for the site, and BEN kills all MICE!!
 */
contract BEN is DaedalusClass {
	address private scratches;
	uint256 private baseCost;
	address private gasToken;
	uint256 private authorBalance;
	constructor(address _cultureCoin, address _DCBT, address _cCA, uint _tokenMax, uint _plurality, address _scratches, uint256 _baseCost){
		gasToken = _cultureCoin;
		DCBT = _DCBT;			//_DBCT stands for Daedalus Class Booster Token and it is the token address being boosted here. TLSCBM, etc, ...
                cCA = _cCA;			// The CC admin.
                maxToken = maxToken;		// How many tokens we believe in.
                plurality = _plurality;		// How many of them have to vote to make waves.

		scratches = _scratches;		// BEN Specific BookTradable that BEN mints.
		baseCost = _baseCost;		// Only allow people to set the cost of minting these tokens so low.
	}
	mapping(address => mapping(uint256 => uint256)) private tokenBalance;
	function getTokenBalance(address _NBT, uint256 _tokenId) public returns(uint256) {
		return tokenBalance[_NBT][_tokenId];
	}
	event Pet(address NBT, string prompt, uint256 tokenId, uint256 value, uint256 scratchId);
	function pet(address _NBT, string memory _prompt, uint256 _tokenId) external payable nonReentrant returns(uint256) {
		//require(petTax[_tokenId] > 0, "BEN does not know about that spot. BEN says: Nah!");
		require(msg.value >= petTax[_NBT][_tokenId] && msg.value >= baseCost, "It costs more to pet BEN here. BEN says: Meor?");
		require(!getYesNo(), "Sorry, but this BEN unit is offline.");

		uint256 scratchId = BookTradable(scratches).addonMintTo(msg.sender);		//// WHERE THE MAGIC HAPPENS! BEN mints new token here. ////
		emit Pet(_NBT, _prompt, _tokenId, msg.value, scratchId);
		tokenBalance[_NBT][_tokenId] += msg.value;

		uint256 halfValue = msg.value / 2;						// Divy up the spoils...
		uint256 otherHalf = msg.value - halfValue;

		uint256 ccAmount = CultureCoin(gasToken).dexXMTSPIn{value: halfValue}();	// Token hodler...
		CultureCoin(gasToken).approve(address(this), ccAmount);
		CultureCoin(gasToken).transferFrom(address(this), BookTradable(_NBT).ownerOf(_tokenId), ccAmount);

		uint256 quarterValue = otherHalf / 2;						// Authors and admins gets otherhalf the tax.
		uint256 otherQuarter = otherHalf - quarterValue;
	        payable(BookTradable(_NBT).owner()).transfer(otherQuarter);

		payable(cCA).transfer(quarterValue);  // Using a payout to simplify the code. //adminBalance += quarterValue;

		return scratchId;
	}
	mapping(address => mapping(uint256 => uint256)) public petTax;
	function getTotalBENTax(address _NBT, uint256 _tokenId) public view returns(uint256) {
		return getPetTax(_NBT, _tokenId) + baseCost;
	}
	function getPetTax(address _NBT, uint256 _tokenId) public view returns(uint256) {
		return petTax[_NBT][_tokenId];
	}
	function setPetTax(address _NBT, uint256 _tokenId, uint256 _petTax) public nonReentrant {
		require(getTokenOwnerWithContract(_NBT, _tokenId) == msg.sender, "You aren't the boss of BEN!");
		petTax[_NBT][_tokenId] = _petTax;
	}
	function getBaseCost() public view returns(uint256) {
		return baseCost;
	}
	function setBaseCost(uint256 _baseCost) public {
		require(msg.sender == cCA, "Only BEN's administrator may changed his base pet cost.");
		baseCost = _baseCost;
	}
}

