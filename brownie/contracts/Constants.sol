// SPDX-License-Identifier:     UNLICENSED

pragma solidity ^0.8.0;

struct Screwdrivers {
        // Message
        bool needsTightening;    // Leave null/0/false to exit try block before permission check and rely on the bridge.

        // Target Hero
        address hero;
        uint256 target;

        // Heal
        uint heal;

        // Damage
        uint damage;
        int damageType;

        // Mitigation
        int armor;
        int fire;
        int frost;
        int meta;

        uint256 effect;         // Only allowed 256 lego effects using this model.

	uint interval;
	uint curTicks;
	uint startTime;
	uint maxTicks;
}

struct HeroXYZ {
        int hX;
        int hY;
        int hZ;
        int hAlpha;
        int hBeta;
}

struct HeroItem {
        int slot;

        int stam;

        int strn;
        int intel;
        int agi;

        int armor;
        int fire;
        int frost;
        int meta;

        uint256 effect;

	uint level;
}

struct HPSummary {
       uint hp;
       int armor;
       int fire;
       int frost;
       int meta;
       uint256 effect;
}

struct Stats {
	uint intel;
	uint agi;
	uint strn;

	uint256 effect;
	HeroTalents talent;
	uint fizzle;
}

struct PowSum {
        uint mana;
}

struct HeroTalents {
	uint256 talent;
}

/////// SPELL BOOK ---------------------------- The Names of the Classes.... \\\\\\\\
/////////////ARCANIST\\\\\\\\\\\\\\
int constant ARCANE_ORB         = 1;		int constant PRIEST		= 1;
int constant ARCANE_POWER       = 15;		int constant ARCANIST		= 15;
int constant ARCANE_CRYSTAL     = 30;		int constant ARIFACT		= 30;

/////////////DRUID\\\\\\\\\\\\\\\\\
int constant DRUID_FIRE         = 31;		int constant WILD_SPIRIT	= 31;
int constant WILD_FIRE		= 43;		int constant SEEDLING		= 43;
int constant REGENERATION	= 44;		int constant TREE		= 44;
int constant MANGLE             = 45;		int constant DRUID		= 45;
int constant CHARM_BEAST        = 46;		int constant PRINCESS		= 46;
int constant SHAPESHIFT         = 60;		int constant GUARDIAN		= 60;

/////////////WARRIOR\\\\\\\\\\\\\\\
int constant TAUNT              = 61;		int constant DEATHKNIGHT	= 61;
int constant IRON_IDOL		= 66;		int constant MORTUARY		= 66;
int constant IRON_SKIN          = 75;		int constant WARRIOR		= 75;
int constant DEATHWISH          = 90;		int constant ROGUE		= 90;

/////////////WARLOCK\\\\\\\\\\\\\\\
int constant SHADOW_PACT        = 91;		int constant DEMONOLOGIST	= 91;
int constant ANGUISH		= 103;		int constant STANDARD_METRIC	= 103;
int constant LIFE_STEAL         = 104;		int constant BLOODBEAST		= 104;
int constant SUMMON             = 105;		int constant WARLOCK		= 105;
int constant SHADOW_BOLT	= 106;
int constant HEAL_PET           = 120;		int constant HUNTER		= 120;

/////////////SHAMAN\\\\\\\\\\\\\\\\
int constant TOTEMIC_INSIGHT    = 121;		int constant RANGER		= 121;
int constant GHOST_WOLF         = 133;
int constant ANCESTRAL_KNOWLEDGE= 134; 		int constant DAEDALUS		= 134;
int constant BLOODLUST          = 135;		int constant SHAMAN		= 135;
int constant RESURECTION	= 136;		
int constant SELF_RES		= 137;
int constant HEAL               = 150;		int constant PALADIN		= 150;

/* Leave room here....
 ... room room ... */

int constant CUBE_DUST		= 1000;
int constant CUBE_TIME		= 1001;

/* Still more room... */

int constant FLAG_IS_NPC	= 10000;
int constant FLAG_IS_SUMMONED	= 10001;
int constant FLAG_IS_ENEMY 	= 10002;

//int constant SPELL_MAX		= ???;	// FIXME

// These are outside constants and can conflict with the above 
uint256 constant MAXUINT		= 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;


// Now we are done with spells.

int constant EQUP_SLOTS		= 14;
int constant MAX_CUBE_SLOTS	= 4;

// Damage types
int constant FIRE		= (1 << 0);
int constant ICE		= (1 << 1);
int constant META		= (1 << 2);
int constant PHYS		= (1 << 3);

int constant HEAL_BY_PERCENT 	= (1 << 4);

uint constant HOT_SLOTS		= 5;
uint constant DOT_SLOTS		= 5;

uint constant FIZZLE_NOT_OWNER	= 1;
uint constant FIZZLE_NOT_IN_RANGE = 2;
uint constant FIZZLE_NO_LOS	= 3;
uint constant FIZZLE_DEAD	= 4;
uint constant FIZZLE_TAR_DEAD	= 5;
uint constant FIZZLE_FIRE_WORKS = 6;			// We want this ... 6 means success of an activation.
uint constant FIZZLE_NO_BUFF 	= 7;

uint constant LEGO_CAST 	= 1;
uint constant LEGO_ACTIVATE	= 2;

uint constant LEGION_LEGOS	= 4;


struct HotsNDots {
	Screwdrivers[HOT_SLOTS] hots;
        Screwdrivers[DOT_SLOTS] dots;
}


uint constant L_IRON_SKIN_HEALS= (1 << 0);

