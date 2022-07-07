// SPDX-License-Identifier:	UNLICENSED

pragma solidity ^0.8.0;

import "./Constants.sol";
import "./HeroXYZ.sol";
import "./Base.sol";
import "./MyItems.sol";
import "./BaseSpells.sol";
import "./CultureCoin.sol";
import "./BookTradable.sol";
import "./LiveTradables.sol";
import "./send_receive.sol";

import "../openzeppelin-solidity/contracts/token/ERC1155/IERC1155Receiver.sol";

contract Hero is BookTradable, Receiver, IERC1155Receiver, LiveTradables /*, DaedalusClassUpgradeable: FIXME will not work until upgradable. */ {
	mapping(uint256 => int) private hClass;		// Static...
	mapping(uint256 => uint256) private hSpawn;	// The spawn point is the NBT id for the hero id.

	mapping(uint256 => uint) private hHp;		// Editable by itself.  1.0 ether = 100%.
	mapping(uint256 => uint) private hPower;	// Ditto for 1.0 ether being 100%.

	mapping(uint256 => int) private hAlpha;
	mapping(uint256 => int) private hBeta;

	mapping(uint256 => mapping(uint => uint256)) private casts;
	mapping(uint256 => uint) private maxPower;	// This guy is controled from the items code.
	mapping(uint256 => uint) private maxHp;	// This guy is also controled from the items code.
	mapping(uint256 => HPSummary) private hpSum;

	CultureCoin CC;
	BookTradable private NBT;
	address private baseSpells;
	BaseSpells private spells;
	address private myItems;
	MyItems private items;

	uint256 private basePrice;
	mapping(uint256 => uint256) private mintPrice;

	/// Shaman || Arcanist ||    Druid   ||  Warrior || Warlock || Shaman || Arcanist ||	///
	/// The-Elements    Arcane Nature Physical     Shadow     All-The-Elements      Arcane
	/// +DPS+++++++DPS++---+++DPS++----TANKS--+--++DPS++++PET++HEAL+DPS++++++DPS++---++	///
	/// Each + Means damage, - means support, DPS means damage per second. TANK means damage mitigated.
	/// HEAL means restoring hit points to pets or players, etc.
	/// Each class gets ~10 main abilities with pet classes getting way more.
	// 
        // ...Cool people here...   ...Pallys sorta go here... ...More cool people...
	// I don't hate pally's, they just don't exist in the scheme. :)

	//
	// Spell Book	--	150 total spells -- Each class gets 30 spells centered any where.
	//

	// ARCANIST --		Class 15
	// Arcane Orb 		1		1 Priest: Arcane Orb, Heal, Arcane Power
	// ...
	// Arcane Power		15
	// ...
	// Arcane Cystal	30		30 Artifact: Arcane Crystal, Druidfire, Arcane Power
	//


	// DRUID --		Class 45
	// Druidfire		31		31 Wild Spirit: Druidfire, Mangle, Arcane Crystal
	// ...
	// Mangle		45
	// ...
	// Shapeshift		60		60 Guardian: Shapeshift, Iron Skin, Mangle
	//


	// WARRIOR --		Class 75
	// Taunt		61		61 Deathknight: Taunt, Irons Skin, Shapeshift
	// ...
	// Iron Skin		75
	// ...
	// Deathwish		90		90 Rogue: Deathwish, Shadow Pact, Iron Skin
	//

	// WARLOCK --		Class 105
	// Shadow Pact		91		91 Demonologist: Shadow Pact, Summon, Deathwish
	// ...
	// Summon		105
	// ...
	// Heal Pet		120		120 Hunter: Heal Pet, Summon, Totemic Insight
	//

	// Shaman --		Class 135
	// Totemic Insight	121		121 Ranger: Totemic Insight, Heal Pet, Bloodlust
	// ...
	// Bloodlust		135
	// ...
	// Heal			150		150 Pally: Heal, Arcane Orb, and Bloodlust
	//

    	constructor (address _cCA, address _cultureCoin, address _nbt, address _registryAddress, address _baseSpells, address _myItems)
		BookTradable("The Scarab Cycle's Heros", "TSCH", _registryAddress, "https://greatlibrary.io/games/TSC/heros/", true, MAXUINT, MAXUINT, MAXUINT, _cultureCoin, _cCA) {
		cCA = _cCA;
		CC = CultureCoin(_cultureCoin);

		NBT = BookTradable(_nbt);
		baseSpells = _baseSpells;
		spells = BaseSpells(baseSpells);
		myItems = _myItems;
		items = MyItems(_myItems);

		basePrice = 0;
	}	
	function getNBT() public view returns(address) {
		return address(NBT);
	}
	function getSpawn(uint256 _hId) public view returns(uint256) {
		return hSpawn[_hId];
	}
	function setPrice(uint256 _tokenId, uint256 _price) public {
		require(msg.sender == NBT.ownerOf(_tokenId));
		mintPrice[_tokenId] = _price;
	}
	function getPrice(uint256 _tokenId) public view returns(uint) {
		return basePrice + mintPrice[_tokenId];
	}
	event NewHero(uint256 hId, uint256 tokenId, address to, int class, uint256 amount);
	function heroMint(uint256 _tokenId, address _to, int _class, uint256 _amount) public returns(uint256) {
		uint256 _cost = getPrice(_tokenId);
		require(_amount >= _cost, "Costs more.");

		uint256 xAmount = CC.dexCCInFrom(msg.sender, _amount);
		uint256 msgValue = CC.dexXMTSPIn{value:xAmount}();

		CC.approve(address(this), msgValue);						// Do it in one big approval step.

		uint256 halfValue = msgValue / 2;                                             	// Divy up the spoils...
		CC.transferFrom(address(this), NBT.ownerOf(_tokenId), halfValue);

                uint256 otherHalf = msgValue - halfValue;
                uint256 quarterValue = otherHalf / 2;                                           // Authors and admins gets otherhalf the tax.
                uint256 otherQuarter = otherHalf - quarterValue;

		CC.transferFrom(address(this), NBT.owner(), quarterValue);

		CC.burn(otherQuarter);

		uint256 newTokenId = _getNextTokenId();
        	_mint(_to, newTokenId);
        	_incrementTokenId();

		// Populate the hero.
		hClass[newTokenId] = _class;
		hHp[newTokenId] = 1 ether;		// This is the percentage of total. To get real total ask the items.
		hPower[newTokenId] = _amount;
		hAlpha[newTokenId] = int(_tokenId);	// This is sort of saying that each scene of the book is 1 away from each other..
		hSpawn[newTokenId] = _tokenId;

		emit NewHero(newTokenId, _tokenId, _to, _class, _amount);

		return newTokenId;
	}
	//event HP(uint256 hId, uint256 hp);
	function getHP(uint256 _hId) public returns(uint, uint) {
		if(hHp[_hId] > 0) {
			hHp[_hId] = items.getHPWithAmount(address(this), _hId, hHp[_hId], 0, 0);
			//emit HP(_hId, hHp[_hId]);
			return (hHp[_hId], getCurrentPower(_hId));
		} else {
			//emit HP(0, 0);
			return (0, 0);  // Dead ... getCurrentPower(_hId));
		}
	}
	function setAB(uint256 _hId, int _a, int _b) public {
                require(msg.sender == cCA || isAddon[msg.sender]);
		
		hAlpha[_hId] = _a;
		hBeta[_hId] = _b;
	}
	function getAB(uint256 _hId) public returns(int, int) {
		return (hAlpha[_hId], hBeta[_hId]);
	}
	event Fizzle(uint256 hId, uint256 target, int how, uint amount, uint fizzleType);
	function fizzle(uint256 _hId, uint256 _target, int _how, uint _amount, uint _fizzleType) public {
		emit Fizzle(_hId, _target, _how, _amount, _fizzleType);
	}
	event Casting(address sender, uint256 _who, uint what, uint amount);
	function doCast(uint256 _hId, uint _whatId, uint _amount) external {
		require(msg.sender == cCA || isAddon[msg.sender], "doCast");
		casts[_hId][_whatId] += _amount;
                emit Casting(msg.sender, _hId, _whatId, _amount);
	}
	event Uncasting(address sender, uint256 _who, uint what, uint amount);
	function unCast(uint256 _hId, int _whatId, uint _amount) external returns(bool) {
                require(msg.sender == cCA || isAddon[msg.sender], "unCast");
		if(_amount > casts[_hId][uint(_whatId)]) {
			return false;
		}
                casts[_hId][uint(_whatId)] -= _amount;
		spells.burn(address(this), uint(_whatId), _amount);
                emit Uncasting(msg.sender, _hId, uint(_whatId), _amount);
		return true;
        }
	event HP(uint256 _hId, uint256 target, int amount, uint256 hp, uint effect);
	function healByPercent(uint256 _hId, uint256 _target, uint _amount, int _healType, uint _effect) public {
		require(isAddon[msg.sender] || msg.sender == cCA || msg.sender == NBT.ownerOf(hSpawn[_target]), "N");
		uint _hpBefore = hHp[_target];
		hHp[_target] += _amount;
		if(_effect > 0) items.hpByEffect(address(this), _hId, _target, _hpBefore, hHp[_target], HEAL_BY_PERCENT, _effect);
		if(hHp[_target] > 1.0 ether) {
			hHp[_target] = 1.0 ether;
		}
		emit HP(_hId, _target, int(_amount), hHp[_target], _effect);
	}
	function healBy(uint256 _hId, uint256 _target, uint _amount, int _healType, uint _effect) public {
		require(isAddon[msg.sender] || msg.sender == cCA || msg.sender == NBT.ownerOf(hSpawn[_target]), "N");

		uint _hpBefore = hHp[_target];
		hHp[_target] = items.getHPWithAmount(address(this), _target, hHp[_target], int(_amount), _healType);
		if(_effect > 0) items.hpByEffect(address(this), _hId, _target, _hpBefore, hHp[_target], _healType, _effect);

		emit HP(_hId, _target, int(_amount), hHp[_target], _effect);
	}
        function hurtBy(uint256 _hId, uint256 _target, uint _amount, int _damageType, uint _effect) public {	//NBT here means we are saying that bookmark holders own all heros minted from them.
		require(isAddon[msg.sender] || msg.sender == cCA || msg.sender == NBT.ownerOf(hSpawn[_target]), "N");
		uint _hpBefore = hHp[_target];
		hHp[_target] = items.getHPWithAmount(address(this), _target, hHp[_target], -int(_amount), _damageType);
		if(_effect > 0) items.hpByEffect(address(this), _hId, _target, _hpBefore, hHp[_target], _damageType, _effect);
		emit HP(_hId, _target, -int(_amount), hHp[_target], _effect);
	}
	function getStats(uint256 _target) public returns (Stats memory) {
		return items.getStats(address(this), _target);
	}
	function setHPSummary(uint _target, HPSummary memory sum) public {
		require(isAddon[msg.sender] || msg.sender == cCA);
		hpSum[_target] = sum;
	}
	function getHPSumary(uint _target) public returns(HPSummary memory) {
		return hpSum[_target];
	}

	function alive(uint256 _hp) public pure returns(bool) {
                return _hp > 0;
        }
	event Power(uint256 _hId, uint256 power);
	function setMaxPower(uint256 _target, uint _maxPower) public {
		require(isAddon[msg.sender] || msg.sender == cCA);
		maxPower[_target] = _maxPower;
	}
	function setMaxHp(uint256 _target, uint _maxHp)  public {
		require(isAddon[msg.sender] || msg.sender == cCA);
		maxHp[_target] = _maxHp;
	}
	function getMaxHp(uint256 _target) public returns(uint) {
		return maxHp[_target];
	}
	function getCurrentPower(uint256 _target) public returns(uint) {
		if(hHp[_target] == 0) {
			return 0;	// Dead means no power.
		} else {
			hPower[_target] = items.getCurrentPower(address(this), _target, hPower[_target]);
			return hPower[_target];
		}
	}
        function powerUp(uint256 _target, uint _amount) public {
		require(isAddon[msg.sender] || msg.sender == cCA || msg.sender == NBT.ownerOf(hSpawn[_target]), "N");
                hPower[_target] += _amount * 1 ether / maxPower[_target];
		if(hPower[_target] > 1.0 ether) {
			hPower[_target] = 1.0 ether;
		}
		emit Power(_target, hPower[_target]);
	}
	function powerDown(uint256 _target, uint _amount) public returns (uint) {
                require(isAddon[msg.sender] || msg.sender == cCA || msg.sender == NBT.ownerOf(hSpawn[_target]), "N");
		if(_amount > hPower[_target]) {
			hPower[_target] = 0;
		} else {
                	hPower[_target] -= _amount * 1 ether / maxPower[_target];
		}
                emit Power(_target, hPower[_target]);
        }
	event Bug(address sender, address from, uint256 hId, uint256 target, int how, uint amount);
        function bug(address _bugger, uint256 _hId, uint256 _target, int _how, uint _amount) public {
		emit Bug(msg.sender, _bugger, _hId, _target, _how, _amount);
	}
	function _myMod(int _class) internal view returns(int) {
		return ((_class -1) % 150) + 1;
	}
	function canCast(uint256 _hId, int _spell) public view returns(bool) {
		return _spell >= _myMod(hClass[_hId]-14) && _spell <= _myMod(hClass[_hId]+15);
	}
	function transferSpellOut(uint256 _hId, uint _whatId, uint _amount, address _to) public { // What is the spell even though it is uint here...
		require(ownerOf(_hId) == msg.sender || msg.sender == cCA || isAddon[msg.sender], "You don't own this hero.");
		casts[_hId][_whatId] -= _amount;

		spells.safeTransferFrom(address(this), _to, _whatId, _amount, "");
	}
	function transferSpellIn(uint256 _hId, uint _whatId, uint _amount) public {
		spells.safeTransferFrom(msg.sender, address(this), _whatId, _amount, "");
		casts[_hId][_whatId] += _amount;
	}
	function castsOf(uint256 _hId, uint _whatId) public view returns(uint) {
		return casts[_hId][_whatId];
	}
	function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data) external returns(bytes4) {
		return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
	}
    	function onERC1155BatchReceived(address operator, address from, uint256[] calldata ids, uint256[] calldata values, bytes calldata data) external returns(bytes4) {
    		return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    	}
}

