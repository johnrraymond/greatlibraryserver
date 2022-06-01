// SPDX-License-Identifier:        UNLICENSED

pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract FutureCoin is ERC20 {
    constructor(uint256 initialSupply, address _cCA) ERC20("CultureCoin", "CC") {
        _mint(msg.sender, initialSupply);
    }

}

