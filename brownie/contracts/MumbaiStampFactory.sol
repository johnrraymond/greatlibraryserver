// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./BookTradable.sol";


contract MumbaiStampFactoryMarketPlace{
/*
    event OfferingPlaced(bytes32 indexed offeringId, address indexed hostContract, address indexed offerer, uint tokenId, uint price, string uri);
    event OfferingClosed(bytes32 indexed offeringId, address indexed buyer);
    event BalanceWithdrawn (address indexed beneficiary, uint amount);
    event OperatorChanged (address previousOperator, address newOperator);

    address operator;
    uint256 private operatorFee;

    uint offeringNonce;

    struct offering {
        address offerer;
        address hostContract;
        uint tokenId;
        uint price;
        bool closed; 
    }
    
    mapping (bytes32 => offering) offeringRegistry;
    mapping (address => uint) balances;

    constructor (address _operator) {
        operator = _operator;
        operatorFee = 1;  // 1% is the default.
    }


    function placeOfferingOperator (address _offerer, address _hostContract, uint _tokenId, uint _price) external returns(bytes32) {
        require (msg.sender == operator, "Only operator dApp can create offerings this way");
        bytes32 offeringId = keccak256(abi.encodePacked(offeringNonce, _hostContract, _tokenId));
        offeringRegistry[offeringId].offerer = _offerer;
        offeringRegistry[offeringId].hostContract = _hostContract;
        offeringRegistry[offeringId].tokenId = _tokenId;
        offeringRegistry[offeringId].price = _price;
        offeringNonce += 1;
        BookTradable hostContract = BookTradable(offeringRegistry[offeringId].hostContract);
        string memory uri = hostContract.tokenURI(_tokenId);

        emit OfferingPlaced(offeringId, _hostContract, _offerer, _tokenId, _price, uri);
	return offeringId;
    }

    function setFee(uint256 _fee) external {
    	require(msg.sender == operator, "Only the operator may change the fee for the marketplace.");

	operatorFee = _fee;
    }


    function placeOffering (address _hostContract, uint _tokenId, uint _price) external returns(bytes32) {
        BookTradable hostContract = BookTradable(_hostContract);
	address owner = hostContract.ownerOf(_tokenId);

	require(msg.sender == owner, "Caller does not own token");

        bytes32 offeringId = keccak256(abi.encodePacked(offeringNonce, _hostContract, _tokenId));
        offeringRegistry[offeringId].offerer = owner;
        offeringRegistry[offeringId].hostContract = _hostContract;
        offeringRegistry[offeringId].tokenId = _tokenId;
        offeringRegistry[offeringId].price = _price;
        offeringNonce += 1;
        string memory uri = hostContract.tokenURI(_tokenId);

        emit OfferingPlaced(offeringId, _hostContract, owner, _tokenId, _price, uri);
	return offeringId;
    }
    
    function closeOfferingRoyalty(bytes32 _offeringId) external payable {
        require(msg.value >= offeringRegistry[_offeringId].price, "Not enough funds to buy");
        require(offeringRegistry[_offeringId].closed != true, "Offering is closed");
        BookTradable hostContract = BookTradable(offeringRegistry[_offeringId].hostContract);
        hostContract.safeTransferFromRegistry(offeringRegistry[_offeringId].offerer, msg.sender, offeringRegistry[_offeringId].tokenId);
        offeringRegistry[_offeringId].closed = true;

	uint256 ownerFee = hostContract.getRoyalty();

	uint256 operatorCut = (msg.value * operatorFee) / 100; 		// Divide to make it a percent.
	uint256 royalties = (msg.value * ownerFee) / 100; 		// Divide to make it a percent.

        balances[offeringRegistry[_offeringId].offerer] += msg.value - royalties - operatorCut;
        balances[operator] += operatorCut;
        balances[hostContract.owner()] += royalties;

        emit OfferingClosed(_offeringId, msg.sender);
    } 

    function withdrawBalance() external {
        require(balances[msg.sender] > 0,"You don't have any balance to withdraw");
        uint amount = balances[msg.sender];
        payable(msg.sender).transfer(amount);
        balances[msg.sender] = 0;
        emit BalanceWithdrawn(msg.sender, amount);
    }

    function changeOperator(address _newOperator) external {
        require(msg.sender == operator,"only the operator can change the current operator");
        address previousOperator = operator;
        operator = msg.sender;
        emit OperatorChanged(previousOperator, operator);
    }

    function viewOfferingNFT(bytes32 _offeringId) external view returns (address, uint, uint, bool){
        return (offeringRegistry[_offeringId].hostContract, offeringRegistry[_offeringId].tokenId, offeringRegistry[_offeringId].price, offeringRegistry[_offeringId].closed);
    }

    function viewBalances(address _address) external view returns (uint) {
        return (balances[_address]);
    }
*/
}
