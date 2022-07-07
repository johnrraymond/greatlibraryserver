// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface LiveTradables {
	function getSpawn(uint256 _hId) external returns(uint256);
	function getNBT() external returns(address);

}
