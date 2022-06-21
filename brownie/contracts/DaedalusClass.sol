// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./BookTradable.sol";
import "../openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

/**
 * 
 */
abstract contract DaedalusClass is ReentrancyGuard {

	mapping(uint => bool) public upDownVote;
	mapping(uint => bool) public counted;
	mapping(uint256 => uint256) public b;
	address public DCBT;
	address public cCA;
	address public cultureCoin;
	uint public maxToken;
	uint public plurality;
	uint adminBalance;

	/*
	constructor(address _cultureCoin, address _DCBT, address _cCA, uint _tokenMax, uint _plurality) {
		DCBT = _DCBT;
		cCA = _cCA;
		maxToken = maxToken;
		plurality = _plurality;

	}
	*/

	event YesNo(uint256 tokenId, bool vote, uint256 value);
	function yesNo(uint _tokenId, bool _upDownVote) public payable {
		require(BookTradable(DCBT).ownerOf(_tokenId) == msg.sender, "Own token first.");
		require(!counted[_tokenId], "Already counted.");
		b[_tokenId] += msg.value; // Your support...
		counted[_tokenId] = true; // Your "I voted" sticker.
		upDownVote[_tokenId] = _upDownVote;
		emit YesNo(_tokenId, _upDownVote, msg.value);
	} 

	function getYesNo() public view returns(bool) {
		uint256 count;

		for(uint i = 1; i <= maxToken; i++) {
			if (upDownVote[i]) {
				i++;
				if(i >= plurality) {
					return true;
				}
			}
		}
		return false;
	}

	function recover() public {
		adminBalance = 0;
		payable(cCA).transfer(adminBalance);
	}
	function recoverCC(uint256 _amountCC) public {
		require(msg.sender == cCA, "Only the administratyor my recover left over Culture Coin.");
		CultureCoin(cultureCoin).transfer(cCA, _amountCC);
	}
	function remitPay(uint256 _tokenId) public nonReentrant {
		payable(BookTradable(DCBT).ownerOf(_tokenId)).transfer(b[_tokenId]);
		b[_tokenId]=0;
	}

	function remitAllPay() public nonReentrant {

		for(uint i = 1; i <= maxToken; i++) {
			payable(BookTradable(DCBT).ownerOf(i)).transfer(b[i]);
			b[i] = 0;
		}
	}

	function getTokenOwner(uint256 _tokenId) public view returns(address) {
		return BookTradable(DCBT).ownerOf(_tokenId);
	}

	uint256 public contractNonce;
	uint256 public noncePayment;
	event Nonce(uint256 nonce);
	function getNonce() public view returns(uint256) {
		return contractNonce;
	}
	function incrementNonce(uint256 _tokenId) public payable {
		require(getTokenOwner(_tokenId) == msg.sender, "You are not in the class of token holders who can frob this dial.");
		if(noncePayment != 0){
			require(msg.value >= noncePayment, "Costs more to frob this dial now.");
			contractNonce++;
		} else {
			contractNonce++;
		}
		adminBalance += msg.value;
		emit Nonce(contractNonce);
	}
	function setNoncePayment(uint _amount) public{
		require(cCA == msg.sender, "Only the admin may set the price.");
		noncePayment = _amount;
	}

	function getTokenOwnerWithContract(address _contract, uint256 _tokenId) public view returns(address) {
                return BookTradable(_contract).ownerOf(_tokenId);
        }
}

