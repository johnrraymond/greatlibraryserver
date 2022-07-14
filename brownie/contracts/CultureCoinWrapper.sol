// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "../openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

import "./CultureCoin.sol";

import "./Stakeable.sol";

// Create your own book, dApp, or intelectual property using this wrapper coin.
contract CultureCoinWrapper is ERC20, ERC20Burnable, ReentrancyGuard {

    address private p;          // Parent.
    event Debug(string);
    event DebugUINT(uint256);
    event DebugAddress(address);
    address private cCAClone;
    address private cCA;
    uint256 private b;          // Balance.
    uint256 private price;
    uint256 private generatePrice;
    CultureCoin private CC;
    constructor(uint256 initialSupply, address _cultureCoin, address _cCAClone, string memory _meme) ERC20("CultureCoin", _meme) {
        require(_cultureCoin != address(0), "Invalid Culturcoin.");
        require(_cCAClone != address(0), "Zero address.");

        cCAClone = _cCAClone; // Not the real cCA.

        emit DebugAddress(_cultureCoin);
        emit DebugAddress(msg.sender);
        emit DebugUINT(initialSupply);
        emit Debug(_meme);

        CC = CultureCoin(_cultureCoin);
        CC.register(msg.sender);

        cCA = CC.clone(); // Only clone the best.
        p = _cultureCoin;            // Parent coin.
        _mint(cCA, initialSupply);       // Mint to the real cCA.

        if(initialSupply == 210100027 ether) {      // We let them have the same amount if they use the new meme number.
            _mint(cCAClone, initialSupply);     // Mint to the cloner // this owner.
            _mint(address(this), initialSupply);    // Mint to the coin itself.
        }

        price = CC.getDexXMTSPRate();
        generatePrice = price;
    }

    event Paid(address, uint256);
    function setPrice(uint256 _price) public {
            require(cCA == msg.sender || cCAClone == msg.sender, "Only the admin.");
        price = _price;
    }
    function buy() public payable {  // await debugPayableFunction0("pay", priceEncoded, "The coin should now be ready for step 2.");
    uint256 amount = msg.value * price /  1 ether;
    _transfer(address(this), msg.sender, amount);
    emit Paid(msg.sender, msg.value);
    b += msg.value;
    }
  
    // Step three: Call generator function for new coins under this one. Price is set based on recovered amount or aministrator.
    function setGeneratePrice(uint256 _price) public {
        require(cCA == msg.sender || cCAClone == msg.sender, "Only the admin.");
    generatePrice = _price;
    }
    function getGeneratePrice() public view returns(uint256) {
        return generatePrice;
    }
    
    function generate(string memory _meme) public payable nonReentrant{     // await debugPayableFunction02("generate", priceEncoded, oferingId, "You have now generated a new coin under yours.");
        require(generatePrice > 0, "More.");
        require(msg.value >= generatePrice, "More, more.");
        emit DebugAddress(cCA);
        emit DebugAddress(msg.sender);
        emit DebugUINT(msg.value);
        emit Debug(_meme);
        CC.seed(_meme, 210100027 ether, address(this), true);
        b += msg.value;
    }

    // Small fee for using the libary's token.
    function withdrawFunds() public {
    uint256 fee = b * 5 / 100;
    uint256 balance = b - fee;
    payable(cCA).transfer(fee);
        payable(cCAClone).transfer(balance);
    b = 0;
    }

    // Balance
    function B() public view returns(uint256) {
        return b;
    }

    // Parent function.
    function P() public view returns(address){ 
    return p;           
    }

}

