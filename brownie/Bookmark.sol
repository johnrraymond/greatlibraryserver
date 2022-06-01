// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

/**
 * @title Bookmark%s
 * Bookmark%s - a contract for datamine: %s
 */
contract Bookmark%s is ERC721Tradable {

    constructor(address _proxyRegistryAddress)
        ERC721Tradable("Bookmark%s", "NB%s", _proxyRegistryAddress) {
     }

    function baseTokenURI() override public pure returns (string memory) {
        //return "https://creatures-api.opensea.io/api/creature/";
	return "https://www.nftbooks.art/nft/%s/";
    }

    function contractURI() public pure returns (string memory) {
        return "https://www.nftbooks.art/contract/%s/";
    }

}


