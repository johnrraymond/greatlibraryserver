// SPDX-License-Identifier:        UNLICENSED

pragma solidity ^0.8.0;

import "../openzeppelin-contracts-upgradeable/contracts/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "../openzeppelin-contracts-upgradeable/contracts/token/ERC1155/ERC1155Upgradeable.sol";
import "../openzeppelin-contracts-upgradeable/contracts/security/ReentrancyGuardUpgradeable.sol";
import "../openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";

import "./send_receive.sol"; // For the addons to send and receive XMTSP, AKA AVAX.

/* arcaneOrb = 1
 * ironSkin = 2
 *
 *
 */


abstract contract Base is Initializable, ERC1155Upgradeable, ERC1155BurnableUpgradeable, ReentrancyGuardUpgradeable, Receiver {

}

