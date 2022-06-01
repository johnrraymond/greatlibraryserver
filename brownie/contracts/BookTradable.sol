// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./ERC721BookTradable.sol";
//import "./Solution.sol";
import "./CultureCoin.sol";

/**
 * @title BookTradable is like a Regular opensea ERC721 tradable,
 * but allows the marketplace account to also help with the 
 * minting process.
 *
 * And some other additions for editing metadata and the like.
 */
contract BookTradable is ERC721BookTradable {

    event GasTokenSpent(address owner, uint256 tokenId, uint256 amount, string reason);

    string private baseuri;

    bool private burnable;
    //mapping(uint256 => uint256) private burnerfee;   // It may be really expensive to ship the item so a fee may be required. Defaults to 0.
    //mapping(uint256 => string) private shipaddress;  // Where to ship to.

    uint256 private defaultprice;
    uint256 private defaultfrom;

    uint256 private royalty;

    address private safeSender;
    address private bookRegistryAddress;

    // Culture Coin 
    mapping(uint256 => uint256) private gasBalance;  // The Culture Coin balances for each token.
    mapping(uint256 => uint256) private gasRewards;  // How much gas to send the purchaser of each token.
    address private gasToken;

    address private rewardContract; 			// This is the book's contract in the case of bookmarks.
    mapping(uint256 => uint256) private rewardTokenId;	// The contract must have it's safeSender set this parent contract.
    							// The tokenId of the book's to ship when a token transfers from marketplace.
							// It it sht emaster rewarders job to set up the linkage and the approvals.
    mapping(uint256 => bool) private tokenRewarded;	// If false then the reward token can be sent to the buyer.
    constructor(string memory _name, string memory _symbol, address _bookRegistryAddress, string memory _baseuri,
    					bool _burnable, uint256 _maxmint, uint256 _defaultprice, uint256 _defaultfrom, address _gasToken, address _cCA)
        ERC721BookTradable(_name, _symbol, _cCA, _maxmint) {

	cCA = _cCA;
        baseuri = _baseuri;
	burnable = _burnable;	// Please do not burn books.
	defaultprice = _defaultprice;
	defaultfrom = _defaultfrom;

	gasToken = _gasToken;

        royalty = 5;  //5%

	bookRegistryAddress = _bookRegistryAddress;
    }

    // Used like: DCBT.safeTransferFromRegistry(address(this), msg.sender, DCBT.totalSupply());
    function safeTransferFromRegistry(address from, address to, uint256 tokenId) public {
	require(msgSender() == bookRegistryAddress || isAddon[msgSender()], "Only addon can safe send.");

        address tokenOwner = ERC721.ownerOf(tokenId);
	require(tokenOwner != to, "Token owner can not transfer token to self.");

	// Transfers the base otken to the buyer.
        _transfer(from, to, tokenId);

        // Transfers the reward token if any.
	if(address(0) != rewardContract && rewardTokenId[tokenId] != 0 && !tokenRewarded[tokenId]) {
	    BookTradable(rewardContract).safeTransferFromRegistry(from, to, rewardTokenId[tokenId]);
            tokenRewarded[tokenId] = true;
	}

        // Give the buyer their share of the gas.
	if(gasRewards[tokenId] != 0) {
       	    CultureCoin(gasToken).transfer(to, gasRewards[tokenId]);
	    gasRewards[tokenId] = 0;		// Rewards are now empty.
	}
	
    }
    mapping(address => bool) public isAddon;
    function setAddon(address _addon, bool _isAddon) public {
	require(cCA == msgSender() || msgSender() == bookRegistryAddress || isAddon[msg.sender]);
	isAddon[_addon] = _isAddon;
    }
    function getAddon(address _addon) external view returns(bool) {
    	return isAddon[_addon];
    }
    function addonMintTo(address _to) public returns(uint256) {
        require(isAddon[msg.sender], "Addons only.");
        require(_getNextTokenId() < maxmint, "At max tokens.") ;

        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        _incrementTokenId();

        return newTokenId;
    }
    function addonBurn(uint256 _tokenId) public {
        require(isAddon[msg.sender]);
        _burn(_tokenId);
    }


    function getGasRewards(uint256 _tokenId) external view returns(uint256, uint256){
    	return (gasBalance[_tokenId], gasRewards[_tokenId]);
    }

    function getRewards(uint256 _tokenId) external view returns(address, uint256) {
    	return(rewardContract, rewardTokenId[_tokenId]);
    }

    function setRewardContract(address _rewardContract) public {
        require(msgSender() == owner() || msgSender() == bookRegistryAddress || cCA == msgSender(), "Only the owner or registery may change the reward contract.");

    	rewardContract = _rewardContract;
    }
    
    function setRewardToken(uint256 _tokenId, uint256 _rewardTokenId) public {
	require(isAddon[msg.sender] || cCA == msgSender());

        rewardTokenId[_tokenId] = _rewardTokenId;
	tokenRewarded[_tokenId] = false;		// On setting this the safetransgerfromregistry can send it on.
    }


    function getRoyalty() external view returns(uint256) {
    	return royalty;
    }

    function setRoyalty(uint256 _royalty) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress || msgSender() == cCA);
	require(royalty <= 99, "Be between 0 and 99.");

	royalty = _royalty;
    }
    	

    function setGasToken(address _gasToken) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress || cCA == msgSender());

    	gasToken = _gasToken;
    }

    function getGasToken() public view returns(address) {
    	return gasToken;
    }

    // This function burns the Culture Coins that the contract owns on behalf of the token owner.
    function burnGas(uint256 _tokenId, uint256 _amount, string memory _reason) external {
        address tokenOwner = ownerOf(_tokenId);
	require(msgSender() == tokenOwner || msgSender() == bookRegistryAddress || cCA == msgSender(), "Amins only.");

	require(gasBalance[_tokenId] >= _amount, "Refill.");
	gasBalance[_tokenId] -= _amount;

	CultureCoin(gasToken).burn(_amount);

	emit GasTokenSpent(tokenOwner, _tokenId, _amount, _reason);
    }

    function fillGasTank(uint256 _tokenId, uint256 _amount, uint256 _gasRewards) external {
	uint256 allowedAmount = CultureCoin(gasToken).allowance(msgSender(), address(this));
        require(allowedAmount >= _amount, "fillGasTank");

	CultureCoin(gasToken).transferFrom(msgSender(), address(this), _amount);

	gasBalance[_tokenId] += _amount - _gasRewards;
        gasRewards[_tokenId] += _gasRewards;
    }


    function getDefaultPrice() public view returns(uint256) {
	return defaultprice;
    }
    function setDefaultPrice(uint256 _defaultprice) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress || cCA == msgSender());
    	defaultprice = _defaultprice;
    }
    function setDefaultFrom(uint256 _defaultfrom) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress || cCA == msgSender());
	defaultfrom = _defaultfrom;
    }
    function getDefaultFrom() public view returns(uint256) {
    	return defaultfrom;
    }

    // The people have no voice in what things are burnt. That is the creators/author's choice.
    function setBurnable(bool _burnable) public onlyOwner {
    	burnable = _burnable;
    }
/*
    function setBurnerFee(uint256 tokenId, uint256 _fee) public {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress || msgSender() == cCA);
	burnerfee[tokenId] = _fee;
    }
*/
    function burn(uint256 tokenId) public {
    	require(burnable, "You can't burn this... yet?");
        require(_isApprovedOrOwner(_msgSender(), tokenId) || cCA == msgSender(), "Caller is not owner nor approved");

	//require(burnerfee[tokenId] > 0, "Set fee..");
	//require(msg.value >= burnerfee[tokenId]);

        _burn(tokenId);

	//payable(CultureCoin(gasToken).clone()).transfer(msg.value);
    }

    function setBaseURI(string memory _baseuri) public {
    	require(msgSender() == owner() || msgSender() == cCA);
    	baseuri = _baseuri;
    }


    // For ERC721Tradable.
    function baseTokenURI() override public view returns (string memory) {
        return string(abi.encodePacked(baseuri, "tokens/"));
    }

    // For Opensea integration.
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(baseuri, "contract/"));
    }

    function getProxyRegistryAddress() public view returns(address) {
    	return bookRegistryAddress;
    }

    // So we can change the marketplace address for the books if needed.
    function setProxyRegistryAddress(address _bookRegistryAddress) public {
        require(msgSender() == owner() || msgSender() == bookRegistryAddress || msgSender() == cCA, "Not owner or book rigistery.");

    	bookRegistryAddress = _bookRegistryAddress;
    }
}

