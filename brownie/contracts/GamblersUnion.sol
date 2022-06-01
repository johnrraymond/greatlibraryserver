// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./DaedalusClass.sol";
import "./BookTradable.sol";
import "./CultureCoin.sol";
import "./BEN.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

/** The Gambler's Union takes bets on BEN's money making skills
 */
contract GamblersUnionBEN is DaedalusClass {
	address private scratches;
	uint256 private baseCost;
	address private gasToken;
	uint256 private authorBalance;
	BEN private ben;
	constructor(address _cultureCoin, address _DCBT, address _cCA, uint _tokenMax, uint _plurality, address _BEN) {
		gasToken = _cultureCoin;
		DCBT = _DCBT;			//_DBCT stands for Daedalus Class Booster Token and it is the token address here.
                cCA = _cCA;			// The CC admin.
                maxToken = maxToken;		// How many tokens we believe in.
                plurality = _plurality;		// How many of them have to vote to make waves.

		ben = BEN(_BEN);		// This is ben's address and the first thing the gambler's union is betting on.
		contests.push();
	}

	uint256 public contestId;
	mapping(uint256 => address) public NBT;
	mapping(uint256 => uint256) public closeTime;
	mapping(uint256 => uint256) public rightHand;
	mapping(uint256 => uint256) public leftHand;
	mapping(uint256 => uint256) public rightStart;
	mapping(uint256 => uint256) public leftStart;

	Contest[] private contests;
	event ContestStarted(uint256 contestId, address NBT, uint256 closeTime, uint256 rightTokenId, uint256 leftTokenId, uint256 rightStart, uint256 leftStart);
	function newContest(address _NBT, uint256 _rightTokenId, uint256 _leftTokenId, uint256 _closeTime) public returns(uint256) {

		require(msg.sender == cCA, "Only admins may add contests."); 

		contestId += 1;
		contests.push();

		NBT[contestId] = _NBT;
		closeTime[contestId] = block.timestamp + _closeTime;

		rightHand[contestId] = _rightTokenId;
		leftHand[contestId] = _leftTokenId;

		rightStart[contestId] = ben.getTokenBalance(_NBT, _rightTokenId);
		leftStart[contestId] = ben.getTokenBalance(_NBT, _leftTokenId);

		emit ContestStarted(contestId, _NBT, closeTime[contestId], _rightTokenId, _leftTokenId, rightStart[contestId], leftStart[contestId]);

		return contestId;
	}
	function getContestId() public view returns(uint256) {
		return contestId;
	}

	function getTimeStamp() public returns(uint256) {
		return block.timestamp;
	}

	function getContest(uint256 _contestId) public returns(address, uint256, uint256, uint256, uint256, uint256) {
		return (NBT[_contestId], closeTime[_contestId], rightHand[_contestId], leftHand[_contestId],
			rightStart[_contestId], leftStart[_contestId]);
	}

    	struct Bet {
        	address user;
		uint256 choice;
		uint256 value;
    	}
    	struct Contest {
    		Bet[] bets;
    	}
	
	mapping(uint256 => uint256) private totalBalance;
	mapping(uint256 => uint256) private rightBalance;
	event BetPlaced(uint256 _onstestId, address sender, uint256 choice, uint256 value);
	function placeBet(uint256 _contestId, uint256 _choice) public payable {
		require(block.timestamp <= closeTime[_contestId], "Closed.");

		bool useRight = false;
		
		if(_choice == rightHand[contestId]) {
			rightBalance[contestId] += msg.value;
		} 

		contests[_contestId].bets.push(Bet(msg.sender, _choice, msg.value));

		emit BetPlaced(_contestId, msg.sender, _choice, msg.value);

		totalBalance[contestId] += msg.value;
	}

	mapping(uint256 => bool) private winnerFound;
	mapping(uint256 => uint256) private winnerBalance;
	mapping(uint256 => uint256) private loserBalance;
	mapping(uint256 => uint256) private winner;
	mapping(uint256 => mapping(address => bool)) private winningsCollected;
	event WinningsCollected(uint256 contestId, address sender, uint256 winnings, uint256 ccWinnings);
	function collectWinnings(uint256 _contestId) public nonReentrant returns(uint256, uint256) {
		require(_contestId >= contestId, "No such contest.");
		require(!winningsCollected[_contestId][msg.sender], "You already collected.");
		require(block.timestamp > closeTime[_contestId], "Contest is open still.");

		
		if(!winnerFound[_contestId]) {

			uint256 rightSide = ben.getTokenBalance(NBT[_contestId], rightHand[_contestId]) - rightStart[_contestId];
			uint256 leftSide = ben.getTokenBalance(NBT[_contestId], leftHand[_contestId]) - leftStart[_contestId];
		
			if(rightSide >= leftSide) {
				winner[_contestId] = rightHand[_contestId];
				winnerBalance[_contestId] = rightBalance[_contestId];
				loserBalance[_contestId] = totalBalance[_contestId] - rightBalance[_contestId];
			} else {
				winner[_contestId] = leftHand[_contestId];
				winnerBalance[_contestId] = totalBalance[_contestId] - rightBalance[_contestId];
				loserBalance[_contestId] = rightBalance[_contestId];
			}

			//emit WinnerFound(_contestId, winner[_contestId], winnerBalance[_contestId], totalBalance[contestId], rightSide, LeftSide);

			winnerFound[_contestId] = true;
		}

		uint256 myWinnings = 0;
		Contest memory contest = contests[_contestId];
		for(uint256 i=0; i < contest.bets.length; i++) {
			Bet memory curBet = contest.bets[i];
			if(curBet.user == msg.sender) {
				if(winner[_contestId] == curBet.choice) {
					myWinnings += curBet.value;
				}
			}
		}

		uint256 percentTotal = myWinnings * 1 ether / winnerBalance[_contestId];
		myWinnings += percentTotal * loserBalance[_contestId] / 1 ether;
		
		uint256 ccAmount = CultureCoin(gasToken).dexXMTSPIn{value: myWinnings}();
                CultureCoin(gasToken).approve(address(this), ccAmount);
                CultureCoin(gasToken).transferFrom(address(this), msg.sender, ccAmount);

		winningsCollected[_contestId][msg.sender] = true;

		emit WinningsCollected(_contestId, msg.sender, myWinnings, ccAmount);

		return (myWinnings, ccAmount);
	}
}


