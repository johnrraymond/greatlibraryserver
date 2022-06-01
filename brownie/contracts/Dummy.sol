// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract DummyContract {
	//event Dummy();		// Only use this if you absolutely need to.
	function dummy() public view returns(string memory) {
		//emit Dummy();
		return "dummy";		// runContractFunction() should work on this bad boy.
	}
}

