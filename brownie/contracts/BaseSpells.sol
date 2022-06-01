// SPDX-License-Identifier:	UNLICENSED

pragma solidity ^0.8.0;

import "./Constants.sol";
import "./Base.sol";
import "./Hero.sol";
import "./HeroXYZ.sol";
import "./CultureCoin.sol";

contract BaseSpells is Base {
	address private cCA;
	CultureCoin CC;
	mapping(address => bool) public isAddon;

	mapping(address => mapping(uint256 => uint)) private hSummons;		// A count of current summons.
	mapping(address => mapping(uint256 => mapping(int => bool))) public hState;
	mapping(address => mapping(uint256 => uint256)) private lastPowerShift;
	mapping(address => mapping(uint256 => HotsNDots)) private hotNDots;		// Where the heal and damage over time go for resolving..
	mapping(address => mapping(uint256 => Tags)) private enemies;
	mapping(address => mapping(uint256 => uint256)) private playerExp;
	mapping(address => mapping(uint256 => uint256)) private expReward;
	mapping(address => mapping(uint256 => mapping(uint256 => bool))) private blockLOS;		// Always use lower id as first key for LOS checking.
	mapping(address => mapping(uint256 => int)) private hX;
        mapping(address => mapping(uint256 => int)) private hY;
        mapping(address => mapping(uint256 => int)) private hZ;
	mapping(address => mapping(uint256 => uint)) private skin;

	mapping(address => mapping(uint256 => bool)) private charmed; 		// Not using bool because there could be types of charms.


	// Begin building the world here...

    	function initialize (address _cCA, address cultureCoin, string memory _uri) external initializer {
		__ERC1155_init(_uri);
		__ERC1155Burnable_init();
		__ReentrancyGuard_init();
	
		cCA = _cCA;
		CC = CultureCoin(cultureCoin);
    	}
        function getXYZ(address _hero, uint256 _hId) public returns(HeroXYZ memory) {
		Hero hero = Hero(_hero);
		(int a, int b) = hero.getAB(_hId);
                return HeroXYZ(hX[_hero][_hId], hY[_hero][_hId], hZ[_hero][_hId], a, b);
        }
        function setXYZ(address _hero, uint256 _hId, int _x, int _y, int _z) public {
                require(msg.sender == cCA || isAddon[msg.sender], "setXYZ");

                hX[_hero][_hId] = _x;
                hY[_hero][_hId] = _y;
                hZ[_hero][_hId] = _z;
        }
	function getAddon(address _addon) external view returns(bool) {
        	return isAddon[_addon];
    	}
        function setAddon(address _addon, bool _onOff) public {
                require(msg.sender == cCA, "Only admins may set addon.");
                isAddon[_addon] = _onOff;
        }
	function getSkin(address _hero, uint256 _hId) public returns(uint) {
		return skin[_hero][_hId];
	}
	function setSkin(address _hero, uint256 _hId, uint _amount) public {
		require(msg.sender == cCA || isAddon[msg.sender], "Only admins can set the skin.");
		skin[_hero][_hId] = _amount;
	}
	function setState(address _hero, uint256 _hId, int _which, bool _state) public {
                require(msg.sender == cCA || isAddon[msg.sender] , "Only admins can set the state like this.");
                _setState(_hero, _hId, _which, _state);
        }
	function _setState(address _hero, uint256 _hId, int _which, bool _state) internal {
                hState[_hero][_hId][_which] = _state;
	}
        function getState(address _hero, uint256 _hId, int _which) public view returns(bool) {
                return hState[_hero][_hId][_which];
        }
	function sqrt(int x) public view returns (int y) {
    		int z = (x + 1) / 2;
    		y = x;
    		while (z < y) {
        		y = z;
        		z = (x / z + z) / 2;
		}
   	}
	function xyzDist(HeroXYZ memory one, HeroXYZ memory two) public returns(uint256) {
                return uint(sqrt((one.hX - two.hX) * (one.hX - two.hX) +
                            (one.hY - two.hY) * (one.hY - two.hY) +
                            (one.hZ - two.hZ) * (one.hZ - two.hZ)));
	}
	function xyzInRange(address _hero, uint256 _hId, uint256 _target, uint256 _maxRange) public returns(bool) {
                Hero hero = Hero(_hero);

		HeroXYZ memory one = getXYZ(_hero, _hId);
		HeroXYZ memory two = getXYZ(_hero, _target);


		return sqrt((one.hX - two.hX) * (one.hX - two.hX) +
			    (one.hY - two.hY) * (one.hY - two.hY) +
			    (one.hZ - two.hZ) * (one.hZ - two.hZ) +
			    		0.00000
			     //int(uint(one.hAlpha-two.hAlpha)) + int(uint(one.hBeta-two.hBeta))
			    				) // <=== This ")" is out here because we dont want to lose it in the top half.
			    		<= 
				int (_maxRange); 	  // This is the bottom half of this check.
	}
	function hasLOS(address _hero, uint256 _hId, uint256 _target) public view returns(bool) {
		if(_hId > _target) {
			return !blockLOS[_hero][_target][_hId];
		} else {
			return !blockLOS[_hero][_hId][_target];
		}
		return true;
	}
	function addonMintTo(address _gM, uint _what, uint _amount) external {
		require(cCA == msg.sender || isAddon[msg.sender], "You aren't an admin.");
		_mint(_gM, uint(_what), _amount, "addonMintTo");
	}
	function castTo(address _hero, uint256 _to, int _what, uint _amount) public {
		require(msg.sender == cCA || isAddon[msg.sender], "castTo");
		_castTo(Hero(_hero), _to, _what, _amount);
	}
	function _castTo(Hero hero, uint256 _to, int _what, uint _amount) internal {
		_mint(address(hero), uint(_what), _amount, "_castTo");
		hero.doCast(_to, uint(_what), _amount);
	}
	function getStamMult(address _hero, uint256 _target) public view returns(uint256) {
		return 100;		// FIXME: Check state and passives...
	}
	function getPowerMult(address _hero, uint256 _target, uint _power) public view returns(uint256) {
		return 10;	// In case of powershifted heros returns 1? FIXME
	}
	function getPowBase(address _hero, uint256 _target) public view returns(uint256) {
		return 100;
	}
	function getHPBase(address _hero, uint256 _target) public view returns(uint256) {
		return 100;
	}
	function powerUp(Hero hero, uint256 _target, uint _power, uint _powerMax) internal returns(uint) {
		uint power;
		if(lastPowerShift[address(hero)][_target] == 0) {
			lastPowerShift[address(hero)][_target] = block.timestamp;
			return _power;
		}

		uint ticks = block.timestamp - lastPowerShift[address(hero)][_target];
		lastPowerShift[address(hero)][_target] = block.timestamp;

		if(hero.canCast(_target, BLOODLUST) || hero.canCast(_target, ARCANE_POWER) || hero.canCast(_target, SUMMON)) {
			power = _power + (_powerMax * 0.005 ether / 1.0 ether) * ticks;		// Say 0.5% mana per second.
		} 

		if(power > _powerMax) {
			return _powerMax;
		} else {
			return power;
		}
	}
	function getPowerShift(address _hero, uint256 _target, uint _power, uint _powerMax) public returns(int) {
		Hero hero = Hero(_hero);
		require(cCA == msg.sender || isAddon[msg.sender], "You can't take this.");

                uint power = powerUp(hero, _target, _power, _powerMax);
		if (power > _power) {
			return int(power - _power);
		} else {
			return 0;
		}
        }
	function log2(uint x) public returns (uint y){
   assembly {
        let arg := x
        x := sub(x,1)
        x := or(x, div(x, 0x02))
        x := or(x, div(x, 0x04))
        x := or(x, div(x, 0x10))
        x := or(x, div(x, 0x100))
        x := or(x, div(x, 0x10000))
        x := or(x, div(x, 0x100000000))
        x := or(x, div(x, 0x10000000000000000))
        x := or(x, div(x, 0x100000000000000000000000000000000))
        x := add(x, 1)
        let m := mload(0x40)
        mstore(m,           0xf8f9cbfae6cc78fbefe7cdc3a1793dfcf4f0e8bbd8cec470b6a28a7a5a3e1efd)
        mstore(add(m,0x20), 0xf5ecf1b3e9debc68e1d9cfabc5997135bfb7a7a3938b7b606b5b4b3f2f1f0ffe)
        mstore(add(m,0x40), 0xf6e4ed9ff2d6b458eadcdf97bd91692de2d4da8fd2d0ac50c6ae9a8272523616)
        mstore(add(m,0x60), 0xc8c0b887b0a8a4489c948c7f847c6125746c645c544c444038302820181008ff)
        mstore(add(m,0x80), 0xf7cae577eec2a03cf3bad76fb589591debb2dd67e0aa9834bea6925f6a4a2e0e)
        mstore(add(m,0xa0), 0xe39ed557db96902cd38ed14fad815115c786af479b7e83247363534337271707)
        mstore(add(m,0xc0), 0xc976c13bb96e881cb166a933a55e490d9d56952b8d4e801485467d2362422606)
        mstore(add(m,0xe0), 0x753a6d1b65325d0c552a4d1345224105391a310b29122104190a110309020100)
        mstore(0x40, add(m, 0x100))
        let magic := 0x818283848586878898a8b8c8d8e8f929395969799a9b9d9e9faaeb6bedeeff
        let shift := 0x100000000000000000000000000000000000000000000000000000000000000
        let a := div(mul(x, magic), shift)
        y := div(mload(add(m,sub(255,a))), shift)
        y := add(y, mul(256, gt(arg, 0x8000000000000000000000000000000000000000000000000000000000000000)))
    }  
}
	function damageFloor(uint _amount, int _resist) public pure returns(uint) {
		if(uint(_resist) > _amount) {
			return 0;
		} else {
			return _amount - uint(_resist);
		}
	}
	function getLevel(address _hero, uint256 _hId) public returns(uint) {
		return log2(playerExp[_hero][_hId]+1)+1;
	}
	function addExperience(address _hero, uint256 _hId, uint256 _target) public returns(uint) {
		require(cCA == msg.sender || isAddon[msg.sender], "You can't add that.");
		playerExp[_hero][_hId] += expReward[_hero][_target] + 1;
		return expReward[_hero][_target] + 1;
	}
	struct Tags {
		uint maxTags;
		uint addTags;
		mapping(uint256 => bool) tagged;
	}
	function _tag(Tags storage tags, uint256 _hId) internal {
		tags.addTags++;
		tags.tagged[_hId] = true;
	}
	function shadowTag(address _hero, uint256 _hId, uint256 _target) public returns(bool) {
		require(cCA == msg.sender || isAddon[msg.sender], "You can't force this tag.");
		Tags storage tags = enemies[_hero][_target];
		_tag(tags, _hId);
	}

	function tag(address _hero, uint256 _hId, uint256 _target) public returns(bool) {
		require(cCA == msg.sender || isAddon[msg.sender], "You can't tag this.");
		Tags storage tags = enemies[_hero][_target];
		if(tags.maxTags >= tags.addTags) {
			_tag(tags, _hId);
			return true;
		}
		return false;
	}
	function tagged(address _hero, uint256 _hId, uint256 _target) public view returns(bool) {
		Tags storage tags = enemies[_hero][_target];
		return tags.tagged[_hId];
	}
	function _yards(uint _yards) public returns(uint256) {
		return _yards * 100000;
	}
	// Arcane Orb
	function castAO(address _hero, uint256 _hId, uint256 _to1, uint256 _to2) public {
		Hero hero = Hero(_hero);
		require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");
		require(hero.canCast(_hId, ARCANE_ORB), "Hero can't cast arcane orb.");

                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                bool heroAlive = hero.alive(heroHp);
		require(heroAlive, "You are dead.");

		uint heroLevel = 1; // getLevel(_hero, _hId);	// FIXME
		uint cost = heroLevel * 0.1 ether;
		//require(cost <= heroPower, "You lack the power to do that.");
		//hero.powerDown(_hId, cost);		// FIXME.

		uint minted;
                (uint tarHp, uint tarPow) = hero.getHP(_to1);
                bool tarAlive = hero.alive(tarHp);
		if(tarAlive && xyzInRange(_hero, _hId, _to1, _yards(10))) {
			_castTo(hero, _to1, ARCANE_ORB, 1);	// This is likely also the _hero...
			minted++;
		}

		(tarHp, tarPow) = hero.getHP(_to2);
                tarAlive = hero.alive(tarHp);
		if(tarAlive && xyzInRange(_hero, _hId, _to2, _yards(10))) {
                        _castTo(hero, _to2, ARCANE_ORB, 1);      // This is likely also the _hero...
                        minted++;
                }
		_castTo(hero, _hId, ARCANE_ORB, 3 - minted);
	}
        function curSummons(address _hero, uint256 _hId) public returns(uint) {
                return hSummons[_hero][_hId];
        }
        function maxSummon(address _hero, uint256 _hId) public returns(uint) {
                return 3;
        }
	// Summon beasts
	function castSB(address _hero, uint256 _hId, uint _beastCount, int _petType, uint ccAmount) public {
		Hero hero = Hero(_hero);
		require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");

		require(hero.canCast(_hId, SUMMON), "Hero can't cast summon creatures.");
		require(curSummons(_hero, _hId) + _beastCount > maxSummon(_hero, _hId), "Hero can't summon that many total creatures.");

		// uint256 _tokenId, address _to, int _class, uint256 _amount  // TokenId is the current alpha...
		HeroXYZ memory xyz = getXYZ(_hero, _hId);
		uint256 _tokenId = uint(xyz.hAlpha);
		uint _amount = CC.dexCCInFrom(msg.sender, ccAmount);

		for(uint i = 0; i < _beastCount; i++) {
			uint256 newHero = hero.heroMint(_tokenId, msg.sender, _petType, _amount);
			_setState(_hero, newHero, FLAG_IS_SUMMONED, true);
			_setState(_hero, newHero, FLAG_IS_NPC, true);
			hSummons[_hero][_hId]++;
			//hero.summon(_hId, newHero);
		}
	}
	/*
	function castRES(address _hero, uint256 _hId, uint256 _target) public returns(uint) {
		Hero hero = Hero(_hero);
		Stats memory stats = hero.getStats(_hId);
                require(hero.canCast(_hId, RESURECTION), "Hero can't cast res.");
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");

                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                bool heroAlive = hero.alive(heroHp);
                require(heroAlive || stats.talent.talent & (1 << uint(SELF_RES)) > 0, "You are dead.");
                uint heroLevel = 1; //getLevel(_hero, _hId);
                uint cost = heroLevel * 0.1 ether;
                //require(cost <= heroPower, "You lack the power to do that.");		// FIXME : Turn oun power use...?

                if(!hero.canCast(_hId, ANCESTRAL_KNOWLEDGE)) {
			//hero.powerDown(_hId, cost);
		}

                (uint tarHp, uint tarPow) = hero.getHP(_target);
		if(hero.alive(tarHp)) {
		} else {
                	hero.healByPercent(_hId, _target, 0.5 ether, META, stats.effect);
		}
		require(getState(_hero, _target, FLAG_IS_ENEMY) == getState(_hero, _hId, FLAG_IS_ENEMY), "Not pals.");
	} */
	function hot(address _hero, uint256 _hId, uint256 _target, uint _x, uint _ten) public {
		Hero hero = Hero(_hero);
                Stats memory stats = hero.getStats(_hId);
                require(cCA == msg.sender || isAddon[msg.sender], "You can't do that.");

                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                bool heroAlive = hero.alive(heroHp);
                require(heroAlive, "You are dead.");

                uint heroLevel = 1; //getLevel(_hero, _hId);
                uint cost = heroLevel * 0.1 ether;
                require(cost <= heroPower, "You lack the power to do that.");
                hero.powerDown(_hId, cost);


                (uint tarHp, uint tarPow) = hero.getHP(_target);
                require(hero.alive(tarPow), "Target is dead.");
                require(!getState(_hero, _target, FLAG_IS_ENEMY), "Not a pal.");
                //hero.healBy(_hId, _target, 1 ether, META, stats.effect);

		HotsNDots memory hd = hotNDots[address(hero)][_target];
                for (uint i = 1; i < HOT_SLOTS; i++) {  // HOTS
			if(!hd.hots[i].needsTightening) {
				hd.hots[i].needsTightening = true;
				hd.hots[i].hero = _hero;
				hd.hots[i].target = _target;
				hd.hots[i].heal = _x;
				hd.hots[i].interval = _ten;		// 10 seconds
        			hd.hots[i].startTime = block.timestamp;
        			hd.hots[i].maxTicks = _ten;

				break;
			}
		}
	}
	function dot(address _hero, uint256 _hId, uint256 _target, uint _x, uint _ten) public {
		Hero hero = Hero(_hero);
                Stats memory stats = hero.getStats(_hId);
                require(hero.canCast(_hId, ANGUISH), "Hero can't cast anguish.");
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");

                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                bool heroAlive = hero.alive(heroHp);
                require(heroAlive, "You are dead.");

                uint heroLevel = 1; //getLevel(_hero, _hId);
                uint cost = heroLevel * 0.1 ether;
                require(cost <= heroPower, "You lack the power to do that.");
                hero.powerDown(_hId, cost);

                (uint tarHp, uint tarPow) = hero.getHP(_target);
                require(hero.alive(tarPow), "Target is dead.");
                require(!getState(_hero, _target, FLAG_IS_ENEMY), "Not a pal.");
                //hero.healBy(_hId, _target, 1 ether, META, stats.effect);

                HotsNDots memory hd = hotNDots[address(hero)][_target];
                for (uint i = 1; i < DOT_SLOTS; i++) {  // DOTS
                        if(!hd.dots[i].needsTightening) {
                                hd.dots[i].needsTightening = true;
                                hd.dots[i].hero = _hero;
                                hd.dots[i].target = _target;
                                hd.dots[i].damage = _x;
                                hd.dots[i].interval = _ten;               // 10 seconds
                                hd.dots[i].startTime = block.timestamp;
                                hd.dots[i].maxTicks = _ten;

                                break;
                        }
                }
	}

	function canReset(Screwdrivers memory _nutsNBolts) view internal returns(bool) {
		return _nutsNBolts.interval * _nutsNBolts.curTicks + _nutsNBolts.startTime <= block.timestamp;
	}
	// Try to resolve all damage and heals since last time.
        function resolveHP(address _hero, uint256 _target, uint _curHp, Screwdrivers memory _nutsNBolts) public returns(uint) {
		Hero hero = Hero(_hero);
		require(cCA == msg.sender || isAddon[msg.sender], "You can't try that!");

		uint hp = _curHp;
		if(_nutsNBolts.needsTightening) {
			hp = tighten1(hero, _target, hp, _nutsNBolts);
		}
		return tighten(hero, _target, hp);
	}
	function getRealDamage(Hero hero, uint256 _target, uint _hp, Screwdrivers memory _nutsNBolts) internal returns(uint) {
		uint _damage = 0;

		if(_nutsNBolts.startTime + _nutsNBolts.curTicks * _nutsNBolts.interval <= block.timestamp) {
			uint256 secondsElapsedFromStart = block.timestamp - _nutsNBolts.startTime;
			uint256 ticksFromStart = secondsElapsedFromStart / _nutsNBolts.interval;
			if(ticksFromStart >= _nutsNBolts.maxTicks) {
				ticksFromStart = _nutsNBolts.maxTicks;
			}
			uint256 elapsedTicks = _nutsNBolts.curTicks - ticksFromStart;

			_damage += _nutsNBolts.damage * elapsedTicks;

			_nutsNBolts.curTicks = ticksFromStart;
		}

		return _damage;		// FIXME so it is modified by resistances/toughness.
	}
	function getRealHealing(Hero hero, uint256 _target, uint _hp, Screwdrivers memory _nutsNBolts) internal returns(uint) {
		uint _healing = 0;
		if(_nutsNBolts.startTime + _nutsNBolts.curTicks * _nutsNBolts.interval <= block.timestamp) {
                        uint256 secondsElapsedFromStart = block.timestamp - _nutsNBolts.startTime;
                        uint256 ticksFromStart = secondsElapsedFromStart / _nutsNBolts.interval;
                        if(ticksFromStart >= _nutsNBolts.maxTicks) {
                                ticksFromStart = _nutsNBolts.maxTicks;
                        }
                        uint256 elapsedTicks = _nutsNBolts.curTicks - ticksFromStart;

			_healing += _nutsNBolts.heal * elapsedTicks;
			_nutsNBolts.curTicks = ticksFromStart;
		}
		return _healing;
	}
	function tighten1(Hero hero, uint256 _target, uint _hp, Screwdrivers memory _nutsNBolts) internal returns(uint) {
		if(!_nutsNBolts.needsTightening) {
			return _hp;
		}

		if(_nutsNBolts.heal > 0) {
			uint heal = getRealHealing(hero, _target, _hp, _nutsNBolts);			
			uint maxHp = hero.getMaxHp(_target);
			if(heal + _hp > maxHp) {
				_hp = maxHp;
			}
		}

		if(_nutsNBolts.damage > 0) {
			//require(false, "We are good boys here.");
			uint damage = getRealDamage(hero, _target, _hp, _nutsNBolts);
			if(damage >  _hp) {
				_hp = 0;
			} else {
				_hp =  _hp - damage;
			}
		}
		return _hp;
	}
	function rotate(Screwdrivers memory driver) internal {
		if(canReset(driver)) {
                	Screwdrivers memory empty;
                	driver = empty;
                }
	}
	function tighten(Hero hero, uint256 _target, uint _hp) internal returns(uint) {
		uint hp = _hp;

                HotsNDots memory hd = hotNDots[address(hero)][_target];

                for (uint i = 1; i < HOT_SLOTS; i++) {	// HOTS
			hp = tighten1(hero, _target, hp, hd.hots[i]);
			rotate(hd.hots[i]);

                }
		for (uint i = 1; i < DOT_SLOTS; i++) {	// DOTS
                        hp = tighten1(hero, _target, hp, hd.dots[i]);
			rotate(hd.dots[i]);
                }
		return hp;
	}
}

