// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../openzeppelin-solidity/contracts/access/Ownable.sol";
import "../openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "../openzeppelin-solidity/contracts/utils/Strings.sol";

import "./common/meta-transactions/ContentMixin.sol";
import "./common/meta-transactions/NativeMetaTransaction.sol";

import "../openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";


contract OwnableDelegateBook {}

contract BookRegistry {
    mapping(address => OwnableDelegateBook) public proxies;
}

/**
 * @title ERC721BookTradable
 * ERC721BookTradable - Book Tradable ERC721 contract whitelists a trading address with minting functionality.
 */
abstract contract ERC721BookTradable is ContextMixin, ERC721Enumerable, NativeMetaTransaction, Ownable {
    using SafeMath for uint256;

    uint256 private _currentTokenId = 0;
    uint256 public maxmint;

    address public cCA;

    constructor(
        string memory _name,
        string memory _symbol,
        address _cCA,
	uint256 _maxmint
    ) ERC721(_name, _symbol) {
        cCA = _cCA;
        _initializeEIP712(_name);

        maxmint = _maxmint;
    }

    function setMaxMint(uint256 _maxmint) public {
    	require(msgSender() == owner() || msgSender()  == cCA);

    	maxmint = _maxmint;
    }

    // Handle default pricing and minting.
    function getCurrentToken () public view returns(uint256) {
        return _currentTokenId;
    }


    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mintTo(address _to) public returns(uint256) {
        require(msgSender() == owner() || msgSender() == cCA, "Only owner and marketplace can mint tokens.");
	require(_getNextTokenId() < maxmint, "Already at max tokens.") ;

        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
	_incrementTokenId();

	return newTokenId;
    }

    /**
     * @dev calculates the next token ID based on value of _currentTokenId
     * @return uint256 for the next token ID
     */
    function _getNextTokenId() public view returns (uint256) {
        return _currentTokenId.add(1);
    }

    /**
     * @dev increments the value of _currentTokenId
     */
    function _incrementTokenId() public {
        _currentTokenId++;
    }

    function baseTokenURI() virtual public view returns (string memory);

    function tokenURI(uint256 _tokenId) override public view returns (string memory) {
        return string(abi.encodePacked(baseTokenURI(), Strings.toString(_tokenId)));
    }

    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     *
    function isApprovedForAll(address owner, address operator)
        override
        public
        view
        returns (bool)
    {
        // Whitelist OpenSea proxy contract for easy trading.
        BookRegistry bookRegistry = BookRegistry(cCA);
        if (address(bookRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }
*/

    /**
     * This is used instead of msg.sender as transactions won't be sent by the original token owner, but by OpenSea.
     */
    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }
}
