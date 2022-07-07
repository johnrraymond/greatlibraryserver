// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./DaedalusClass.sol";
import "./BookTradable.sol";
import "./CultureCoin.sol";

contract TheGoldenKeys is DaedalusClass {
	address private log;
	constructor(address _cultureCoin, address _DCBT, address _cCA, uint _tokenMax, uint _plurality) {
		cultureCoin = _cultureCoin;
		DCBT = _DCBT;			//_DBCT stands for Daedalus Class Booster Token and it is the token address being boosted here. TLSCBM, etc, ...
                cCA = _cCA;			// The CC admin.
                maxToken = maxToken;		// How many tokens we believe in.
                plurality = _plurality;		// How many of them have to vote to make waves.
	}
	// 1. User calls proof before timelock runs out between last one.
	mapping(address => uint256) public timeLock;
	function setTimeLock(address _contract, uint256 _timeLock) external {
		require(cCA == msg.sender, "Only admins may change the time lock.");
		timeLock[_contract] = _timeLock;
	}
	function getTimeLock(address _contract) public view returns(uint256) {
		return timeLock[_contract];
	}
	event Proof(address theContract, uint256 tokenId);
	function getLog() external view returns(address) {
		return log;
	}
	function setLog(address _log) public {
		require(cCA == msg.sender, "Not admin.");
		log = _log;
	}
	function proveOwnership(address _contract, uint256 _tokenId) external {
		require(getTokenOwnerWithContract(_contract, _tokenId) == msg.sender, "But you don't own it.");
		uint256 _log = BookTradable(log).addonMintTo(msg.sender);            //// WHERE THE MAGIC HAPPENS! BEN mints new token here. ////
		emit Proof(_contract, _tokenId);
	}
	// 2. If user should not blacklisted with the site lightly. The user needs to be actively attacking the server.
	mapping(address => bool) private blacklist;
	function getBlacklist(address _userAddress) public view returns(bool) {
		require(!getYesNo(), "This method is no longer approved.");
		bool _blacklist = blacklist[_userAddress];
		return blacklist[_userAddress];
	}
	function setBlacklist(address _userAddress, bool _utility) external {
		require(!getYesNo(), "This method is no longer approved.");
		require(cCA == msg.sender, "Only admins may change the time lock.");
		blacklist[_userAddress] = _utility;
	}
	// 3. Better to have the users set a password and we check it?
	mapping(address => mapping(uint256 => mapping(string => mapping(uint256 => uint256)))) private keyPass;
	function setKeyPass(address _contract, uint256 _tokenId, string memory _key, uint256 _pass) public {
		require(!getYesNo(), "This method is no longer approved.");
		require(getTokenOwnerWithContract(_contract,_tokenId) == msg.sender, "Whoops. That's someone else's.");
		keyPass[_contract][_tokenId][_key][_pass] = _pass;
	}
	event KeyUsed(address theContract, address sender, uint256 tokenId, string passKey);
	function isKeyPass(address _contract, uint256 _tokenId, string memory _key, uint256 _pass) public view returns(bool) {
		require(!getYesNo(), "This method is no longer approved.");
		return (getTokenOwnerWithContract(_contract, _tokenId) == msg.sender
			|| cCA == msg.sender && !getYesNo() && _isKeyPass(_contract, _tokenId, _key, _pass));
	}
	function _isKeyPass(address _contract, uint256 _tokenId, string memory _key, uint256 _pass) private view returns(bool) {
		if(_pass == keyPass[_contract][_tokenId][_key][_pass]) {
			return true;
		}
		return false;
	}
	// 4. The memetic blacklist is for msgs into the site as proof of ownership that are stale and we know it.
	mapping(string => bool) private memeBlacklist;
	function getMemeBlacklist(string memory _meme) public view returns(bool) {
		return memeBlacklist[_meme];
	}
	function setMemeBlacklist(string memory _meme, bool _utility) public {
		require(msg.sender == cCA, "Only the admin may change the blacklist.");
		memeBlacklist[_meme] = _utility;
	}
}

