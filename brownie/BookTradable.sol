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
    mapping(uint256 => uint256) private burnerfee;   // It may be really expensive to ship the item so a fee may be required. Defaults to 0.
    mapping(uint256 => string) private shipaddress;  // Where to ship to.

    uint256 private defaultprice;
    uint256 private defaultfrom;

    uint256 private royalty;

    address private safeSender;

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
    					bool _burnable, uint256 _maxmint, uint256 _defaultprice, uint256 _defaultfrom, address _gasToken)
        ERC721BookTradable(_name, _symbol, _bookRegistryAddress, _maxmint) {

        baseuri = _baseuri;
	burnable = _burnable;	// Please do not burn books.
	defaultprice = _defaultprice;
	defaultfrom = _defaultfrom;

	gasToken = _gasToken;

        royalty = 5;  //5%
    }

    function getMsgSender() public returns(address) {
    	return msgSender();
    }

    function getSafeSender() public view returns(address) {
    	return safeSender;
    }

    function setSafeSender(address _safeSender) public {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress, "Only the owner and operator may set the safe sender's address.");

	safeSender = _safeSender;
    }

    function safeTransferFromRegistery(address from, address to, uint256 tokenId) public virtual {
	require(safeSender != address(0) && msgSender() == safeSender, "Only the registry contract or safeSender may call the safeTransferFromRegistery function.");

        address tokenOwner = ERC721.ownerOf(tokenId);
	require(tokenOwner != to, "Token owner can not transfer to token to self.");

	// Transfers the base otken to the buyer.
        _transfer(from, to, tokenId);

        // Transfers the reward token if any.
	if(address(0) != rewardContract && rewardTokenId[tokenId] != 0 && !tokenRewarded[tokenId]) {
	    BookTradable(rewardContract).safeTransferFromRegistery(from, to, rewardTokenId[tokenId]);
            tokenRewarded[tokenId] = true;
	}

        // Give the buyer their share of the gas.
	if(gasRewards[tokenId] != 0) {
       	    CultureCoin(gasToken).transfer(to, gasRewards[tokenId]);
	    gasRewards[tokenId] = 0;		// Rewards are now empty.
	}
	
    }

    function getGasRewards(uint256 _tokenId) external view returns(uint256, uint256){
    	return (gasBalance[_tokenId], gasRewards[_tokenId]);
    }

    function getRewards(uint256 _tokenId) external view returns(address, uint256) {
    	return(rewardContract, rewardTokenId[_tokenId]);
    }

    function setRewardContract(address _rewardContract) public {
	require(msgSender() == bookRegistryAddress, "Only the operator may set reward contract.");

    	rewardContract = _rewardContract;
    }
    
    function setRewardToken(uint256 _tokenId, uint256 _rewardTokenId) public {
	require(msgSender() == bookRegistryAddress, "Only the operator may set reward token.");

        rewardTokenId[_tokenId] = _rewardTokenId;
	tokenRewarded[_tokenId] = false;		// On setting this the safetransgerfromregistry can send it on.
    }


    function approve(address to, uint256 tokenId) public virtual override {
        address tokenOwner = ERC721.ownerOf(tokenId);
        require(to != tokenOwner, "ERC721: approval to current owner");

 	require(msgSender() == owner() || msgSender() == bookRegistryAddress || msgSender() == tokenOwner, "Not allowed to approve. Need to be contract owner, operator, or token owner.");

        _approve(to, tokenId);
    }


    function getRoyalty() external view returns(uint256) {
    	return royalty;
    }

    function setRoyalty(uint256 _royalty) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress, "Only the owner and operator may change royalty.");
	require(royalty <= 99, "Royaltys must be between 0 and 99%.");

	royalty = _royalty;
    }
    	

    function setGasToken(address _gasToken) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress, "Only the owner and operator may change the essence token.");

    	gasToken = _gasToken;
    }

    function getGasToken() public view returns(address) {
    	return gasToken;
    }

    // This function burns the Culture Coins that the contract owns on behalf of the token owner.
    function burnGas(uint256 _tokenId, uint256 _amount, string memory _reason) external {
        address tokenOwner = ownerOf(_tokenId);
	
	require(msgSender() == tokenOwner || msgSender() == bookRegistryAddress, "Only the token owner or operator may use a token's gas.");

	require(gasBalance[_tokenId] >= _amount, "Token doesn't have enough Culture Coin. Please refill the tank.");
	gasBalance[_tokenId] -= _amount;

	CultureCoin(gasToken).burn(_amount);

	emit GasTokenSpent(tokenOwner, _tokenId, _amount, _reason);
    }

    function getMyAllowanceToContract() external view returns(uint256) {
    	return CultureCoin(gasToken).allowance(msgSender(), address(this));
    }

    function fillGasTank(uint256 _tokenId, uint256 _amount, uint256 _gasRewards) external {
	uint256 allowedAmount = CultureCoin(gasToken).allowance(msgSender(), address(this));
        require(allowedAmount >= _amount, "The sender's allowance for this contract inside the gas token is too low.");

	CultureCoin(gasToken).transferFrom(msgSender(), address(this), _amount);

	gasBalance[_tokenId] += _amount - _gasRewards;
        gasRewards[_tokenId] = _gasRewards;
    }


    function getDefaultPrice() public view returns(uint256) {
	return defaultprice;
    }
    function setDefaultPrice(uint256 _defaultprice) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress);
    	defaultprice = _defaultprice;
    }
    function setDefaultFrom(uint256 _defaultfrom) external {
	defaultfrom = _defaultfrom;
    }
    function getDefaultFrom() public view returns(uint256) {
    	return defaultfrom;
    }

    // The people have no voice in what things are burnt. That is the creators/author's choice.
    function setBurnable(bool _burnable) public onlyOwner {
    	burnable = _burnable;
    }

    function setShipAddress(uint256 tokenId, string memory _shipaddress) external {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress);

	shipaddress[tokenId] = _shipaddress; 
    }

    function setBurnerFee(uint256 tokenId, uint256 _fee) public {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress);

	burnerfee[tokenId] = _fee;
    }

    function burn(uint256 tokenId) public payable {
    	require(burnable, "You can't burn this... yet?");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721BookTradable like ERC721Burnable says: caller is not owner nor approved");

	require(burnerfee[tokenId] > 0, "It costs something to burn this and no fee was set.");
	require(msg.value >= burnerfee[tokenId]);

        _burn(tokenId);
    }

    function setBaseURI(string memory _baseuri) public {
    	require(msgSender() == owner() || msgSender() == bookRegistryAddress);
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


    // So we can change the marketplace address for the books if needed.
    function setProxyRegistryAddress(address _bookRegistryAddress) public {
        require(msgSender() == owner() || msgSender() == bookRegistryAddress);

    	bookRegistryAddress = _bookRegistryAddress;
    }
}

