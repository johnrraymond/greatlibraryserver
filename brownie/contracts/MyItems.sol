// SPDX-License-Identifier:	UNLICENSED

pragma solidity ^0.8.0;

import "./Constants.sol";
import "./Hero.sol";
import "./HeroXYZ.sol";
import "./Base.sol";
import "./BaseSpells.sol";
import "./Legion.sol";
import "./CultureCoin.sol";
import "./BookTradable.sol";
import "./LiveTradables.sol";
import "./send_receive.sol";

import "../openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";

contract MyItems is BookTradable, Receiver, IERC721Receiver, LiveTradables {	// Each game gets differnt items.
	CultureCoin private CC;
	address private baseSpells;
        BaseSpells private spells;
	uint256 basePrice;

	address private nbt;
        mapping(uint256 => uint256) hSpawn;
        mapping(uint256 => int) slot;

	mapping(uint256 => HeroItem) private allItems;		// These token ids mapped their data.

	mapping(address => mapping(uint256 => mapping(int => uint256))) private heroSlots;
	mapping(address => mapping(uint256 => HeroTalents)) private talents;			// And each hero gets different talents...

	address[LEGION_LEGOS] private legionLegos;

    	constructor (address _cCA, address _cultureCoin, address _registryAddress, address _baseSpells, address _nbt)
		BookTradable("The Scarab Cycle's Items", "TSCI", _registryAddress, "https://greatlibrary.io/games/TCS/items/", true, MAXUINT, MAXUINT, MAXUINT, _cultureCoin, _cCA) {
		cCA = _cCA;
		CC = CultureCoin(_cultureCoin);

		nbt = _nbt;

		baseSpells = _baseSpells;
                spells = BaseSpells(baseSpells);

		basePrice = 0;
	}	
	function itemMint(address _hero, uint256 _hId, address _to, int _slot) public returns(uint256) {
		require(isAddon[msg.sender] || msg.sender == cCA, "You can't make a new items this way.");

		uint256 newTokenId = _getNextTokenId();
        	_mint(_to, newTokenId);
        	_incrementTokenId();

		hSpawn[newTokenId] = Hero(_hero).getSpawn(_hId);
		slot[newTokenId] = _slot;

		return newTokenId;
	}
	function addonApprove(address _addonAddress, address _sender, uint256 _iId) public {
		require(isAddon[msg.sender] || msg.sender == cCA, "You can't approve like that.");
		_approve(_addonAddress, _iId);
	}
	function getItemStats(uint256 _iId) public returns(HeroItem memory) {
		require(isAddon[msg.sender] || msg.sender == cCA, "You can't set the stats.");
		return allItems[_iId];
	}
	function setItemStats(uint256 _iId, HeroItem memory _item) public {
		require(isAddon[msg.sender] || msg.sender == cCA, "You can't set the stats.");
		allItems[_iId] = _item;
	}
	function getNBT() public view returns(address) {
		return nbt;
	}
	function getSpawn(uint256 _hId) public view returns(uint256) {
                return hSpawn[_hId];
        }
	function getCurrentPower(address _hero, uint256 _target, uint _power) public returns(uint) {
		require(isAddon[msg.sender] || msg.sender == cCA, "You lack the power.");
		uint basePow = spells.getPowBase(_hero, _target);
		PowSum memory pow = getPowerItems(_hero, _target, _power);
		uint maxPower = pow.mana + basePow;
		Hero hero = Hero(_hero);

		hero.setMaxPower(_target, maxPower);			// This is odd but the way these contracts interact this call from the hero sets state back in the hero...

		int powerShift = spells.getPowerShift(_hero, _target, _power, maxPower);

		if(powerShift < 0) {
			uint downShift = uint(-1 * powerShift);
			if(downShift > _power) {
				return 0;		// Now we at zero tho...
			} else {
				return (_power - downShift) * 1.0 ether / maxPower;
			}
		} else {
			uint upShift = uint(powerShift);
			uint power = _power + upShift;
			if(power > maxPower) {
				return 1.0 ether;
			} else {
				return power * 1.0 ether / maxPower;
			}
		}
	}
	function getStats(address _hero, uint256 _target) public returns(Stats memory) {
		uint intel;
		uint agi;
		uint strn;
		uint256 effects;
		for(int i = 1; i <= EQUP_SLOTS; i++) {
                        uint256 _itemId = heroSlots[_hero][_target][i];
                        if(_itemId > 0) {
                                HeroItem memory item = allItems[_itemId];
                                intel += uint(item.intel);
				agi += uint(item.agi);
				strn += uint(item.strn);
				effects |= item.effect;
                        }
                }
                return Stats(intel + 1, agi + 1, strn + 1, effects, talents[_hero][_target], FIZZLE_FIRE_WORKS);
	}
	function equipItemFrom(address _owner, address _hero, uint256 _hId, uint256 _iId) public {
		require(isAddon[msg.sender] || msg.sender == cCA, "equipItemFrom");

		if(_iId > 0) {
			//approve(address(this), _iId);
			//safeTransferFrom(_owner, address(this), _iId);
			_transfer(_owner, address(this), _iId);
		}

		uint256 _curItemId = heroSlots[_hero][_hId][slot[_iId]];
		if(_curItemId > 0) {
			//safeTransferFrom(address(this), _owner, _curItemId);
			_transfer(address(this), _owner, _iId);
		}
		heroSlots[_hero][_hId][slot[_iId]] = _iId;
	}
	function getPowerItems(address _hero, uint256 _target, uint _power) internal returns(PowSum memory) {
		uint mana;
		for(int i = 1; i <= EQUP_SLOTS; i++) {
			uint256 _itemId = heroSlots[_hero][_target][i];
			if(_itemId > 0) {
                                HeroItem memory item = allItems[_itemId];
				mana += uint(item.intel) * spells.getPowerMult(_hero, _target, _power);
			}
		}
		return PowSum(mana);
	}
	function getHPItems(address _hero, uint256 _target) internal returns(HPSummary memory) {
		uint stamMul = spells.getStamMult(_hero, _target);
		uint hp;
		int armor;
		int fire;
		int frost;
		int meta;
		uint256 effect;

		for(int i = 1; i <= EQUP_SLOTS; i++) {
			uint256 _itemId = heroSlots[_hero][_target][i];
			if(_itemId > 0) {
				HeroItem memory item = allItems[_itemId];
				hp += uint(item.stam) * stamMul;
				armor += item.armor;
				fire += item.fire;
				frost += item.frost;
				meta += item.meta;
				effect |= item.effect;
			}
		}
		HPSummary memory sum = HPSummary(hp, armor, fire, frost, meta, effect);
		Hero(_hero).setHPSummary(_target, sum);
		return sum;
        }
	function getHPReal(uint _totalMaxHp, uint256 _targetHp) public view returns(uint256) {
		return _totalMaxHp * _targetHp / 1 ether;
	}
	function hpByEffect(address _hero, uint256 _hId, uint256 _target, uint256 _hpBefore, uint256 _hpAfter, int _how, uint256 _effect) public {
		require(isAddon[msg.sender] || msg.sender == cCA, "hpByEffect");
		for(uint i = 0; i < LEGION_LEGOS; i++) {
                        address legion = legionLegos[i];
                        if(legion != address(0)) {
                                Legion(legion).hpByEffect(_hero, _hId, _target, _hpBefore, _hpAfter, _how, _effect);
                        }
                }
	}
	function getHPWithAmount(address _hero, uint256 _target, uint256 _targetHp, int _amount, int _amtType) public returns(uint256) {	// Not a view because we deal with HOT and DOTs here.
		require(isAddon[msg.sender] || msg.sender == cCA, "Please don't.");
		//require(_targetHp != 0, "Take me out...");		// Turn on for testing if you dont believe you are dead...
		uint baseHp = spells.getHPBase(_hero, _target);
		HPSummary memory sum = getHPItems(_hero, _target);
		uint hpMax = baseHp + sum.hp;
		//require(hpMax > 1, "No wusses allowed.");

		Hero(_hero).setMaxHp(_target, hpMax);

		uint damage;
		uint heals;

		if(_amount > 0) {
			heals = uint(_amount);
		} else {
			damage = uint(-1 * _amount);
		}

		// 1, 1, 0, 1 :: interval, curTick, starttime left 0 to force damage now, maxTick
		Screwdrivers memory _nutsNBolts = Screwdrivers(true, _hero, _target, heals, damage, _amtType, sum.armor, sum.fire, sum.frost, sum.meta, sum.effect, 1,1,0,1);
		uint hp = getHPReal(hpMax, _targetHp);
		uint256 targetHp = spells.resolveHP(_hero, _target, hp, _nutsNBolts);	// Real hp goes in the resolver...

		if(targetHp == 0) { 
			return 0; // They are already dead... didn't survive their dots.
		} else {
			targetHp += heals;
			if(damage > targetHp) {
				targetHp = 0;		// Dead now from direct damage.
			} else {
				targetHp -= damage;	// They survived it.
			}
		}

		if(targetHp > hpMax) {
			targetHp = hpMax;
		}

		return targetHp * 1 ether / hpMax;	// Back to percent..
	}
	function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4) {
        	return 0xf0b9e5ba;
    	}
}
