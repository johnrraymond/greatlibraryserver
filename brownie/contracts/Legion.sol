// SPDX-License-Identifier:        UNLICENSED

import "./Constants.sol";

pragma solidity ^0.8.0;

interface Legion {
	function playLegend(uint _playHow, int _spell, Stats memory _stats, uint256 _hId) external;
	function playLegend(uint _playHow, int _spell, Stats memory _stats, uint256 _hId, uint256 _target, int _how, uint _amount) external;

	function hpByEffect(address _hero, uint256 _hId, uint256 _target, uint256 _hpBefore, uint256 _hpAfter, int _how, uint256 _effect) external;
}

