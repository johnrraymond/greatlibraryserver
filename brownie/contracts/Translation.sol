// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./DaedalusClass.sol";
import "./BookTradable.sol";
import "./CultureCoin.sol";

contract Transalation is DaedalusClass {
	string private language;
	bool private doTranslate;
	address private scratches;
        uint256 private baseCost;
        uint256 private maxCost;
        address private authorAddress;
        uint256 private authorBalance;
        constructor(address _cultureCoin, address _DCBT, address _cCA, uint _tokenMax, uint _plurality, address _scratches, address _authorAddress, string memory _language){
                DCBT = _DCBT;                   //_DBCT stands for Daedalus Class Booster Token and it is the token address being boosted here. TLSCBM, etc, ...
                cCA = _cCA;                     // The CC admin.
                maxToken = maxToken;            // How many tokens we believe in.
                plurality = _plurality;         // How many of them have to vote to make waves.

                scratches = _scratches;         // BEN Specific BookTradable that BEN mints.
		authorAddress = _authorAddress; // Save it down. too. I guess.
		language = _language;		// The language this translation project is for.
        }
        mapping(uint256 => uint256) public tranlateTax;
        event Translate(string prompt, uint256 tokenId, uint256 value, uint256 scratchId);
        function translate(string memory _prompt, uint256 _tokenId) public payable {
		require(doTranslate, "Starting up...");
                require(tranlateTax[_tokenId] > 0, "BEN does not know about that spot. BEN says: Nah!");
                require(msg.value >= tranlateTax[_tokenId] && msg.value >= baseCost, "It costs more to tranlate BEN here. BEN says: Meor?");
		require(msg.value <= maxCost, "Let's not be unreasonable.");
                //require(!getYesNo(), "Sorry, but this BEN unit is offline.");

                uint256 scratchId = BookTradable(scratches).addonMintTo(msg.sender);            //// WHERE THE MAGIC HAPPENS! BEN mints new token here. ////
                emit Translate(_prompt, _tokenId, msg.value, scratchId);

                uint256 halfValue = msg.value / 2;                                              // Divy up the spoils...
                uint256 otherHalf = msg.value - halfValue;

                b[_tokenId] += halfValue;                                                 // Let token owner have half the tax.

                uint256 quarterValue = otherHalf / 2;                                           // Authors and admins gets otherhalf the tax.
                uint256 otherQuarter = otherHalf - quarterValue;
                adminBalance += quarterValue;
                authorBalance += otherQuarter;
        }
        function setBENTax(uint256 _tokenId, uint256 _tranlateTax) public {
                require(getTokenOwner(_tokenId) == msg.sender, "You aren't the boss of BEN!");
                tranlateTax[_tokenId] = _tranlateTax;
        }
	function getMaxCost() public view returns(uint256) {
		return maxCost;
	}
        function getBaseCost() public view returns(uint256) {
                return baseCost;
        }
        function setBaseCost(uint256 _baseCost) public {
                require(msg.sender == cCA, "Only BEN's administrator may change his base translate cost.");
                baseCost = _baseCost;
        }
	function setMaxCost(uint256 _maxCost) public {
                require(msg.sender == cCA, "Only BEN's administrator may change his max translate cost.");
		maxCost = _maxCost;
	}
	function setDoTranslate(bool _doTranslate) public {
                require(msg.sender == cCA, "Only BEN's administrator can say he is online.");
		doTranslate = _doTranslate;
	}
        function getPaid() public {
                require(msg.sender == authorAddress, "You don't clean my litter box!");
                payable(authorAddress).transfer(authorBalance);
                authorBalance = 0;
        }
}
