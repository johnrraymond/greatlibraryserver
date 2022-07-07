// SPDX-License-Identifier:        UNLICENSED

pragma solidity ^0.8.0;

import "./Constants.sol";
import "./Base.sol";
import "./BaseSpells.sol";
import "./Hero.sol";
import "./CultureCoin.sol";

contract BaseLoot is Base {

        address private cCA;
        address private baseSpells;
        CultureCoin CC;
        BaseSpells private spells;
	mapping(uint256 => mapping(uint256 => bool)) private isLooted;

	mapping(address => bool) public isAddon;

	uint256 private _unused;

        function initialize (address _cCA, address _cultureCoin, address _baseSpells, string memory _uri) external initializer {
                __ERC1155_init(_uri);
                __ERC1155Burnable_init();
                __ReentrancyGuard_init();

                cCA = _cCA;
                CC = CultureCoin(_cultureCoin);
                baseSpells = _baseSpells;
                spells = BaseSpells(baseSpells);
        }
	function getAddon(address _addon) external view returns(bool) {
        	return isAddon[_addon];
    	}
	function setAddon(address _addon, bool _onOff) public {
                require(msg.sender == cCA, "Only admins may set addon.");
                isAddon[_addon] = _onOff;
        }
	function addLoot(Hero hero, uint256 _hId, uint256 _target) public {
		require(msg.sender == cCA || isAddon[msg.sender], "You can't add the loot.");
		isLooted[_hId][_target] = false;
	}
	function looted(Hero hero, uint256 _hId, uint256 _target) internal view returns(bool) {
		return isLooted[_hId][_target];
	}
	function setLooted(address _hero, uint256 _hId, uint256 _target, bool _flag) external {
		require(msg.sender == cCA || isAddon[msg.sender], "You cant set the loot.");
		isLooted[_hId][_target] = _flag;
	}
	function _setLooted(Hero hero , uint256 _hId, uint256 _target, bool _flag) internal {
		isLooted[_hId][_target] = _flag;
	}
	function lootTo(address _hero, uint256 _hId, uint256 _target, uint _amount) public {
		require(cCA == msg.sender || isAddon[msg.sender], "lootTo");
		_mint(_hero, _hId, 1, "loot");
	}
	function burnFrom(address _sender, uint _what, uint _amount) public {
		require(cCA == msg.sender || isAddon[msg.sender], "burnFrom");
		_burn(_sender, _what, _amount);
	}
	function loot(address _hero, uint256 _hId, uint256 _target) external returns(uint) {
	        Hero hero = Hero(_hero);
                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                (uint tarHp, uint tarPow) = hero.getHP(_target);
                bool heroAlive = hero.alive(heroHp);
                bool tarAlive = hero.alive(tarHp);

		require(!tarAlive, "Target is alive still.");
		require(heroAlive, "You are dead.");

		//require(spells.tagged(_hero, _hId, _target), "That has no loot for you.");	// FIXME: Loot is Free for all.. Chaos!

                require(hero.ownerOf(_hId) == msg.sender || msg.sender == cCA, "You can't do that.");
                require(spells.xyzInRange(_hero, _hId, _target, 1), "loot is OOR");
                require(spells.hasLOS(_hero, _hId, _target), "loot lacks LOS");
		require(spells.getState(_hero, _target, FLAG_IS_NPC), "Can't loot that.");
		require(!looted(hero, _hId, _target), "Already looted.");

		_mint(msg.sender, _target, 9, "loot9");		// Player gets the loot...
		_mint(BookTradable(hero.getNBT()).ownerOf(hero.getSpawn(_hId)), _target, 1, "loot1");

		_setLooted(hero, _hId, _target, true);

		return spells.addExperience(_hero, _hId, _target);
	}
	// Druidfire
        function castDF(address _hero, uint256 _hId, uint256 _target, uint _id) public {
                Hero hero = Hero(_hero);
                require(hero.canCast(_hId, DRUID_FIRE), "Hero can't cast druid fire.");
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");

                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                bool heroAlive = hero.alive(heroHp);
                require(heroAlive, "You are dead.");

                uint heroLevel = spells.getLevel(_hero, _hId);
                uint cost = heroLevel * 0.1 ether;
                require(cost <= heroPower, "You lack the power to do that.");
                hero.powerDown(_hId, cost);

                (uint tarHp,) = hero.getHP(_target);
                require(hero.alive(tarHp), "Target is dead.");

                Stats memory stats = hero.getStats(_hId);
                uint amount = stats.intel * heroLevel;

                HPSummary memory tarSum = hero.getHPSumary(_target);
                amount = spells.damageFloor(amount, tarSum.fire);
		tarHp = spells.getSkin(_hero, _target);		// Reusing tarHp for the skin amouint because solidity is bad.
		if(tarHp > 0.5 ether) {
			amount = amount / 2;
		}
		spells.setSkin(_hero, _target, tarHp/2);
                hero.hurtBy(_hId, _target, amount, FIRE, stats.effect);
        }
	function activateIS(address _hero, uint256 _hId) public {
		Hero hero = Hero(_hero);
                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                bool heroAlive = hero.alive(heroHp);

                if(!heroAlive) {
                        hero.fizzle(_hId, _hId, IRON_SKIN, 1, FIZZLE_DEAD);
                        return;
                }

                if(hero.ownerOf(_hId) != msg.sender && msg.sender != cCA) {
                        hero.fizzle(_hId, _hId, IRON_SKIN, 1, FIZZLE_NOT_OWNER);
                        return;
                }

                hero.unCast(_hId, IRON_SKIN, 1);
		spells.setState(_hero, _hId, IRON_SKIN, true);
		spells.setSkin(_hero, _hId, 1 ether);
	}
	// Iron Skin
        function castIS(address _hero, uint256 _hId) public {
                Hero hero = Hero(_hero);
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");
                require(hero.canCast(_hId, IRON_SKIN), "Hero can't cast iron skin.");

                spells.castTo(_hero, _hId, IRON_SKIN, 1);
        }
	// Ghost Wolf
        function castGW(address _hero, uint256 _hId, uint oldToken, uint ccAmount) public {
                Hero hero = Hero(_hero);
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");
                require(hero.canCast(_hId, GHOST_WOLF), "Hero can't cast ghost wolf.");
                spells.setState(_hero, _hId, GHOST_WOLF, !spells.getState(_hero, _hId, GHOST_WOLF));
        }
        function activateAO(address _hero, uint256 _hId, uint256 _target, int _how, uint _amount) public returns(Stats memory) {
		Hero hero = Hero(_hero);
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");
		Stats memory stats = hero.getStats(_hId);

		if(!hero.unCast(_hId, ARCANE_ORB, _amount) ) {
			hero.fizzle(_hId, _target, _how, _amount, FIZZLE_NO_BUFF);
			stats.fizzle = FIZZLE_NO_BUFF;
			return stats;
		}

                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                (uint tarHp, uint tarPow) = hero.getHP(_target);
                bool heroAlive = hero.alive(heroHp);
                bool tarAlive = hero.alive(tarHp);

		if(!heroAlive) {
			hero.fizzle(_hId, _target, _how, _amount, FIZZLE_DEAD);
			stats.fizzle = FIZZLE_DEAD;
			return stats;
		}

		if(!tarAlive) {
			hero.fizzle(_hId, _target, _how, _amount, FIZZLE_TAR_DEAD);
			stats.fizzle = FIZZLE_TAR_DEAD;
			return stats;
		}

               	if(!spells.xyzInRange(_hero, _hId, _target, 1)) {
			hero.fizzle(_hId, _target, _how, _amount, FIZZLE_NOT_IN_RANGE);
			stats.fizzle = FIZZLE_NOT_IN_RANGE;
			return stats;
		}
               	if(!spells.hasLOS(_hero, _hId, _target)) {
			hero.fizzle(_hId, _target, _how, _amount, FIZZLE_NO_LOS);
			stats.fizzle = FIZZLE_NO_LOS;
			return stats;
		}


                if(_how == HEAL) {
                        if(hero.canCast(_hId, HEAL)) {
                        	hero.healBy(_hId, _target, _amount * 1 ether, META, stats.effect);	// FIXME. Need to figure out spell costs.
			} else {
                      		hero.bug(msg.sender, _hId, _target, _how, _amount);
			}
		}

                if (_how == ARCANE_ORB) {
			// The power and danger of arcane orb is that it can do damage for anyone not just the caster.
                        hero.hurtBy(_hId, _target, _amount * _getSpellDamage(stats), META, stats.effect);		//FIXME fire but say we are meta?
                } else if (_how == DRUID_FIRE) {
                        if(hero.canCast(_hId, DRUID_FIRE)) {
                        	hero.hurtBy(_hId, _target, _amount * _getSpellDamage(stats), FIRE, stats.effect);
                        	hero.powerDown(_target, 1); // FIXME
			} else {
				hero.bug(msg.sender, _hId, _target, _how, _amount);
			}
                } else if (_how == TAUNT) {
                        require(hero.canCast(_hId, TAUNT), "Quiet you.");
                        if(spells.getState(_hero, _target, FLAG_IS_NPC)) {
                               hero.powerDown(_target, 1); // FIXME
			}  else {
                               hero.powerUp(_target, 1); // FIXME
                        }
                } else {
                        hero.bug(msg.sender, _hId, _target, _how, _amount);
                }
		stats.fizzle = FIZZLE_FIRE_WORKS;
		return stats;
	}
	function _getSpellDamage(Stats memory stats) pure internal returns(uint) {
		return stats.intel + 1;
	}
	// Life Steal
        function castLS() public {
        }
	// Charm Beast
        function castCB(address _hero, uint256 _hId, uint256 _target, bool _charm, uint ccAmount) public {
                Hero hero = Hero(_hero);
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");
                require(hero.canCast(_hId, CHARM_BEAST), "Hero can't cast charm beast.");
                require(spells.getState(_hero, _hId, FLAG_IS_NPC), "Can't charm that.");

                spells.setState(_hero, _target, CHARM_BEAST, _charm);
        }
	function castRES(address _hero, uint256 _hId, uint256 _target) public returns(uint) {
                Hero hero = Hero(_hero);
                Stats memory stats = hero.getStats(_hId);
                require(hero.canCast(_hId, RESURECTION), "Hero can't cast res.");
                require(hero.ownerOf(_hId) == msg.sender || isAddon[msg.sender], "You can't do that.");

                (uint heroHp, uint heroPower) = hero.getHP(_hId);
                bool heroAlive = hero.alive(heroHp);
                require(heroAlive || stats.talent.talent & (1 << uint(SELF_RES)) > 0, "You are dead.");
                uint heroLevel = 1;// + getLevel(_hero, _hId);
                uint cost = heroLevel * 0.1 ether;
                //require(cost <= heroPower, "You lack the power to do that.");         // FIXME : Turn oun power use...?

                if(!hero.canCast(_hId, ANCESTRAL_KNOWLEDGE)) {
                        //hero.powerDown(_hId, cost);
                }

                (uint tarHp, uint tarPow) = hero.getHP(_target);
                if(hero.alive(tarHp)) {
                } else {
                        hero.healByPercent(_hId, _target, 0.5 ether, META, stats.effect);
                }
                require(spells.getState(_hero, _target, FLAG_IS_ENEMY) == spells.getState(_hero, _hId, FLAG_IS_ENEMY), "Not pals.");
        }
}

