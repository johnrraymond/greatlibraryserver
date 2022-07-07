import time
import pytest
import logging
from brownie import accounts

LOG = logging.getLogger(__name__)

OneCC = 1000000000000000000   # This number is equal to 1 Culture Coin
maxint = 115792089237316195423570985008687907853269984665640564039457584007913129639935
deployAmount = 2 * 210100027 * OneCC

from scripts.helpful_scripts import encode_function_data

@pytest.fixture(scope="session")
def proxyAdmin(ProxyAdmin):
    return accounts[0].deploy(ProxyAdmin)

@pytest.fixture(scope="session")
def CC(CultureCoin, proxyAdmin, TransparentUpgradeableProxy, Contract):
    deployAmount = 2 * 210100027 * OneCC
    LOG.info("Deploying CC with amount:" + str(deployAmount))
    CCImpl = accounts[0].deploy(CultureCoin);

    LOG.info(CCImpl.balanceOf(accounts[0].address))

    encoded_initializer_function = encode_function_data(CCImpl.initialize, deployAmount, accounts[0].address)

    proxy = accounts[0].deploy(TransparentUpgradeableProxy,
        CCImpl.address,
        proxyAdmin,
        encoded_initializer_function
    )

    ccProxy = Contract.from_abi("CultureCoin", proxy.address, CultureCoin.abi)
    LOG.info("CCProxy: " + str(ccProxy.address))

    return ccProxy # This looks like CC but is the proxy for it.

@pytest.fixture(scope="session")
def PP(PrintingPress, CC):
    LOG.info("Deploying printing press")
    return accounts[0].deploy(PrintingPress, accounts[0].address, CC.address)

@pytest.fixture(scope="session")
def ben(BEN, CC, DCBT, scratches, BookTradable):
    LOG.info("Deploying BEN")

    #address _cultureCoin, address _DCBT, address _cCA, uint _tokenMax, uint _plurality, address _scratches, uint256 _baseCost
    myBen = accounts[0].deploy(BEN, CC.address, DCBT, accounts[0].address, 35, 18, scratches, 10000000)

    #CC.setAddon(myBen.address, True, {'from': accounts[0].address})
    BookTradable.at(scratches).setAddon(myBen.address, True, {'from': accounts[0].address})

    return myBen

@pytest.fixture(scope="session")
def MP(MarketPlace, CC):
    LOG.info("Deploying Marketplace")
    return accounts[0].deploy(MarketPlace, accounts[0].address, accounts[0].address, CC.address)

@pytest.fixture(scope="session")
def DCBT(PP, MP):
    tx = PP.newBookContract("TestDCBT", "TDCBT", MP.address, "urlgoeshere", True, maxint, OneCC, 1, accounts[0].address)
    return tx.events[2]["what"]

@pytest.fixture(scope="session")
def scratches(PP, MP):
    LOG.info("Deploying BEN's scratches")
    #_name, _symbol, _bookRegistryAddress, _baseuri, _burnable, _maxmint, _defaultprice, _defaultfrom, _mintTo
    tx = PP.newBookContract("TestScratches", "TS", MP.address, "urlgoeshere", True, maxint, OneCC, 1, accounts[0].address)
    myScratches = tx.events[2]["what"]

    return myScratches

def example_bookmark(PP, MP, BookTradable):
    tx = PP.newBookContract("exampleNBT", "BTtestNBT", MP.address, "urlgoeshere", True, maxint, OneCC, 1, accounts[0].address)
    exampleBookMark = BookTradable.at(tx.events[2]["what"])
    tx = PP.newBookContract("exampleNBT", "BMtestNBT", MP.address, "urlgoeshere", True, maxint, OneCC, 1, accounts[0].address)
    exampleBook = BookTradable.at(tx.events[2]["what"])

    exampleBookMark.setAddon(PP.address, True, {'from': accounts[0].address})
    exampleBook.setAddon(PP.address, True, {'from': accounts[0].address})

    exampleBookMark.setRewardContract(exampleBook.address, {'from': accounts[0].address})
    exampleBook.setAddon(exampleBookMark.address, True, {'from': accounts[0].address})

    #example.mintTo(accounts[0].address, {'from': accounts[0].address})
    # delegateMinter (address _to, address _NBT, uint _tokenMax, uint _amount, uint _gasRewards)
    mintTx = PP.delegateMinter(accounts[0].address, exampleBookMark.address, 5, 0, 0, {'from': accounts[0].address})
    LOG.info("Mint tx: " + str(mintTx))

    return exampleBookMark

def example_book(PP, MP, BookTradable):
    tx = PP.newBookContract("exampleNBT", "BTtestNBT", MP.address, "urlgoeshere", True, maxint, OneCC, 1, accounts[0].address)
    exampleBook = BookTradable.at(tx.events[2]["what"])
    tx = PP.newBookContract("exampleNBT", "BMtestNBT", MP.address, "urlgoeshere", True, maxint, OneCC, 1, accounts[0].address)
    exampleBookMark = BookTradable.at(tx.events[2]["what"])

    exampleBookMark.setAddon(PP.address, True, {'from': accounts[0].address})
    exampleBook.setAddon(PP.address, True, {'from': accounts[0].address})

    exampleBookMark.setRewardContract(exampleBook.address, {'from': accounts[0].address})
    exampleBook.setAddon(exampleBookMark.address, True, {'from': accounts[0].address})

    mintTx = PP.delegateMinter(accounts[0].address, exampleBookMark.address, 5, 0, 0, {'from': accounts[0].address})
    LOG.info("Mint tx: " + str(mintTx))

    buyTx = PP.buyBook(exampleBook.address, {'from': accounts[0].address, 'value': OneCC})
    LOG.info("Buy tx: " + str(buyTx))

    buyBMTx = PP.buyBook(exampleBookMark.address, {'from': accounts[0].address, 'value': OneCC})
    LOG.info("Buy tx: " + str(buyBMTx))

    return exampleBook

def test_nbts(PP, MP, BookTradable):
    LOG.info("test_nbts")

    example = example_bookmark(PP, MP, BookTradable)
    LOG.info("example: " + str(example.address))

    example.addonBurn(1, {'from': PP.address})

    exampleBook = example_book(PP, MP, BookTradable)

    LOG.info("test_nbts done")


@pytest.fixture(scope="session")
def GU(GamblersUnionBEN, ben, CC, DCBT):
    LOG.info("Deploying Gamblers Union")
    #address _cultureCoin, address _DCBT, address _cCA, uint _tokenMax, uint _plurality, address _scratches, uint256 _baseCost
    myGU = accounts[0].deploy(GamblersUnionBEN, CC.address, DCBT, accounts[0].address, 35, 18, ben.address)

    return myGU

@pytest.fixture(scope="session")
def cc_initial_total(CC):
    LOG.info("cc_initial_balance")
    assert CC.totalSupply() == 2 * 210100027 * OneCC
    LOG.info(CC.totalSupply())
    return CC.totalSupply()

@pytest.fixture(scope="session")
def cc_initial_balance(CC):
    LOG.info("cc_initial_balance")
    LOG.info(CC.balanceOf(CC.address))
    return CC.balanceOf(CC.address)

@pytest.fixture(scope="session")
def gamblers_union(GU, scratches, ben):
    LOG.info("test_gamblers_union")

    contest = GU.newContest(scratches, 1, 2, 3)
    LOG.info("Contest: " + str(contest.events))
    contestId = contest.events[0]["contestId"]

    endTx = GU.getContest(contestId)
    #LOG.info("End Times: " + str(endTx))

    endTime = endTx.return_value[1]
    LOG.info("End Time: " + str(endTime))

    while True:
        curTx = GU.getTimeStamp()
        #LOG.info("Current tx: " + str(curTx))
        #LOG.info(dir(curTx))
        LOG.info("ret: " + str(curTx.return_value))

        if int(str(curTx.return_value)) + 2 > int(str(endTime)):
            break

        GU.placeBet(contestId, 1, {'from': accounts[0].address, 'value': 100})
        GU.placeBet(contestId, 1, {'from': accounts[0].address, 'value': 100})
        GU.placeBet(contestId, 2, {'from': accounts[0].address, 'value': 1})

        ben.pet(scratches, "good kitty", 1, {'from': accounts[0].address, 'value': 10000001})
        ben.pet(scratches, "good kitty", 1, {'from': accounts[0].address, 'value': 10000001})
        ben.pet(scratches, "good kitty", 2, {'from': accounts[0].address, 'value': 100000001})

    time.sleep(3)
    winTx = GU.collectWinnings(contestId, {'from': accounts[0].address})
    LOG.info("Win tx: " + str(winTx))
    winnings = winTx.return_value[0];
    LOG.info("Winnings: " + str(winnings))

    LOG.info("Contest ID: " + str(contestId))
    return contestId

def test_staking_protocol(PP, MP, BookTradable, CC): #, GU, cc_initial_total, cc_initial_balance, gamblers_union):
    LOG.info("test_staking_protocol")

    ##CC.setRewardPerHour(1000, {'from': accounts[0].address})

    CC.stake(100000001, {'from': accounts[0].address})

    time.sleep(1)

    firstStake = CC.hasStake(accounts[0].address)
    LOG.info("First stake: " + str(firstStake))
    LOG.info(firstStake[0])

    output = CC.withdrawStake(100000001, 0, {'from': accounts[0].address})
    LOG.info(output.events["Transfer"]["value"])

    firstStakeAgain = CC.hasStake(accounts[0].address)
    LOG.info("First stake after withdrawl: " + str(firstStakeAgain))
    #LOG.info(firstStakeAgain)

    LOG.info("END test_staking_protocol")

def pet(ben, scratches):
    LOG.info("test_ben")

    # address _NBT, string memory _prompt, uint256 _tokenId
    assert ben.pet(scratches, "good boy, BEN", 1, {'from': accounts[0].address, 'value': 10000001});


def test_new_book_contructor(CC, MP, BookTradable):
    #string memory _name, string memory _symbol, address _bookRegistryAddress, string memory _baseuri,
    #                                    bool _burnable, uint256 _maxmint, uint256 _defaultprice, uint256 _defaultfrom, address _gasToken, address _cCA
    bookTradable = accounts[0].deploy(BookTradable, "_name", "_symbol", MP.address, "_baseuri", True, 1, 1, 1, CC.address, accounts[0].address)
    LOG.info("BookTradable: " + str(bookTradable.address))

def test_account_balance():
    LOG.info("test_account_balance")
    balance = accounts[0].balance()
    accounts[0].transfer(accounts[1], "10 ether", gas_price=0)

    assert balance - "10 ether" == accounts[0].balance()

def test_test():
    LOG.info("test_test")

    assert True

def est_cc_burned(ccTotalSupply, ccTotalSupplyEnd):
    return ccTotalSupply - ccTotalSupplyEnd

@pytest.fixture(scope="session")
def ccTotalSupplyStart(CC):
    return CC.totalSupply()

@pytest.fixture(scope="session")
def cc_warm_dex(CC, cc_initial_balance, ccTotalSupplyStart):
    LOG.info("test_cc_dex")

    LOG.info("XAllowStart: " + str(ccTotalSupplyStart))

    ccBalBegin = CC.balanceOf(CC.address)
    LOG.info("ccBalBegin: " + str(ccBalBegin))

    assert ccBalBegin == cc_initial_balance

    balRet = CC.B()
    LOG.info("XMTSP balRet: " + str(balRet))

    CC.dexXMTSPIn({'from': accounts[0].address, 'value': "100000000"})
    CC.dexXMTSPIn({'from': accounts[0].address, 'value': "100000000"})
    CC.dexXMTSPIn({'from': accounts[0].address, 'value': "100000000"})
    CC.dexXMTSPIn({'from': accounts[0].address, 'value': "100000000"})
    CC.dexXMTSPIn({'from': accounts[0].address, 'value': "100000000"})

    ccRet = CC.dexXMTSPIn({'from': accounts[0].address, 'value': "100000000"})
    CC.dexCCIn(ccRet.return_value, {'from': accounts[0].address})

    ccRet = CC.dexXMTSPIn({'from': accounts[0].address, 'value': "100000000"})
    LOG.info("ccAmount: " + str(ccRet.return_value))

    xRet = CC.dexCCIn(ccRet.return_value, {'from': accounts[0].address})
    #LOG.info("xRet: " + str(xRet))
    LOG.info("xRet.return_value: " + str(xRet.return_value))

    newBalRet = CC.B()
    LOG.info("New XMTSP balRet: " + str(newBalRet))

    ccBalEnd = CC.balanceOf(CC.address)
    LOG.info("ccBalEnd: " + str(ccBalEnd))
    LOG.info("Loss of CC: " + str(ccBalBegin - ccBalEnd))

    LOG.info("Gain of XMTSP: " + str(newBalRet - balRet))

    ccTotalSupplyEnd = CC.totalSupply()
    LOG.info("XAllowEnd: " + str(ccTotalSupplyEnd))

    LOG.info("Loss of XMTSP allowance out: " + str(ccTotalSupplyStart - ccTotalSupplyEnd))
    LOG.info("Esitmated CC burned from allownace: " + str((ccTotalSupplyStart - ccTotalSupplyEnd)/4))

    LOG.info("Estimated CC in tank from allowance: " + str(cc_initial_balance - (ccTotalSupplyStart - ccTotalSupplyEnd)/4))
    LOG.info("Absolute error of estimate from allowance: " + str(cc_initial_balance - (ccTotalSupplyStart - ccTotalSupplyEnd)/4 - ccBalEnd))
    LOG.info("Percent error of estimate from allowance: " + str(((ccTotalSupplyStart - ccTotalSupplyEnd)/4 - ccBalEnd)/ccBalBegin - ccBalEnd))

    #curCCRate = CC.getDexCCRate() / 1e18
    #LOG.info("Current CC rate: " + str(curCCRate))

    curXRate = CC.getDexXMTSPRate() / 1e18
    LOG.info("Current X rate: " + str(curXRate))

    estCCBurned = est_cc_burned(ccTotalSupplyStart, ccTotalSupplyEnd)
    actualBurned = ccBalBegin - ccBalEnd

    LOG.info("Estimated CC burned: " + str(estCCBurned))
    LOG.info("Actual CC burned: " + str(actualBurned))


    LOG.info("Est Percent dex CC burned: " + str(estCCBurned/cc_initial_balance))

    estDeflationPercent = (cc_initial_balance - estCCBurned)/cc_initial_balance

    LOG.info("Est Percent of original CC: " + str(estDeflationPercent * 100))

    estOutstandingCC = cc_initial_balance - ccBalEnd - estCCBurned

    LOG.info("Est Outstanding CC: " + str(estOutstandingCC))

    ratioXMTSPPerCC = newBalRet/estOutstandingCC
    LOG.info("Est Ratio XMTSP per outstanding CC: " + str(ratioXMTSPPerCC))

    estProfitAmount = newBalRet - estOutstandingCC * curXRate

    LOG.info("Est Profit: " + str(estProfitAmount))
    LOG.info("Est percent profit: " + str(estProfitAmount/newBalRet *100))

    estNewRate = newBalRet/estOutstandingCC
    LOG.info("Est New Rate: " + str(estNewRate))
    estNewRateTaxed = estNewRate * (1 - .01)
    LOG.info("Est New Rate Taxed: " + str(estNewRateTaxed))


    estPreTaxInverse = (1 - .0001) / ratioXMTSPPerCC
    LOG.info("Est Pre Tax Inverse: " + str(estPreTaxInverse))
    #LOG.info("Est Post Tax Inverse: " + str(1 / estNewRateTaxed)) ### This is how much we'd have to pay out to be 100% fair.

    #CC.setDexCCRate(str(estNewRate) + " ether", {'from': accounts[0].address})
    # How much CC could I dex in right now?

    #CC.setDexXMTSPRate(str(estPreTaxInverse) + " ether", {'from': accounts[0].address})

def getEstNewRate(CC, cc_initial_balance, ccTotalSupply):
    newBalRet = CC.B()
    ccTotalSupplyEnd = CC.totalSupply()

    #curCCRate = CC.getDexCCRate() / 1e18
    curXRate = CC.getDexXMTSPRate() / 1e18
    estCCBurned = est_cc_burned(ccTotalSupply, ccTotalSupplyEnd)
    
    estOutstandingCC = cc_initial_balance - CC.balanceOf(CC.address) - estCCBurned

    estNewRate = newBalRet/estOutstandingCC
    return estNewRate

def getEstPreTaxInverse(CC, cc_initial_balance, ccTotalSupply):
    newBalRet = CC.B()
    ccTotalSupplyEnd = CC.totalSupply()

    curXRate = CC.getDexXMTSPRate() / 1e18
    LOG.info("Current X rate: " + str(curXRate))

    estCCBurned = est_cc_burned(ccTotalSupply, ccTotalSupplyEnd)
    LOG.info("Est CC burned: " + str(estCCBurned))
    estOutstandingCC = cc_initial_balance - CC.balanceOf(CC.address) - estCCBurned
    ratioXMTSPPerCC = newBalRet/estOutstandingCC
    return 1.0 / ratioXMTSPPerCC


def getCurXMTSPRate(CC, cc_initial_balance, ccTotalSupplyStart):
    LOG.info("cc_initial_balance: " + str(cc_initial_balance))

    curBal = CC.balanceOf(CC.address)
    LOG.info("Current CC balance: " + str(curBal))

    curBalDiff = cc_initial_balance - curBal
    LOG.info("Current Balance Difference: " + str(curBalDiff))

    curBurn = ccTotalSupplyStart - CC.totalSupply()
    LOG.info("Current CC burn: " + str(curBurn))

    curCCOutstanding = curBalDiff - curBurn
    LOG.info("Current CC Outstanding: " + str(curCCOutstanding))

    curXBal = CC.B();
    LOG.info("Current XMTSP balance: " + str(curXBal))

    if curCCOutstanding <= 0:
        return 4

    ratioXMTSPPerCC = curXBal/curCCOutstanding
    LOG.info("Ratio XMTSP per CC: " + str(ratioXMTSPPerCC))

    return ratioXMTSPPerCC

def test_set_dex_rates(CC, cc_warm_dex, ccTotalSupplyStart, cc_initial_balance):
    curXRate = CC.getDexXMTSPRate();
    curCCRate = CC.getDexCCRate();
    LOG.info("Current X rate: " + str(curXRate))
    LOG.info("Current CC rate: " + str(curCCRate))

    CC.setDexRates(curXRate, curCCRate, {'from': accounts[0].address})

def test_all(gamblers_union): #cc_dex, gamblers_union):
    pass

@pytest.fixture(scope="session")
def cc_dex(CC, cc_initial_balance, cc_warm_dex, ccTotalSupplyStart):
    LOG.info("test_cc_dex")

    for i in range(0, 8):
        CC.dexXMTSPIn({'from': accounts[0].address, 'value': "1000000000000000"})

        ccRet = CC.dexXMTSPIn({'from': accounts[0].address, 'value': "10000000000000000"})
        CC.dexCCIn(ccRet.return_value, {'from': accounts[0].address})

        estNewRate = getEstNewRate(CC, cc_initial_balance, ccTotalSupplyStart)
        LOG.info("New Est Rate: " + str(estNewRate))
        newActualRate = estNewRate * (1 - .01)
        LOG.info("New Actual Rate: " + str(newActualRate))
        CC.setDexCCRate(str(newActualRate) + " ether", {'from': accounts[0].address})
        # How much CC could I dex in right now?
        estPreTaxInverse = 1 / estNewRate
        LOG.info("New Est Pre Tax Inverse: " + str(estPreTaxInverse))
        CC.setDexXMTSPRate(str(estPreTaxInverse) + " ether", {'from': accounts[0].address})


    LOG.info("test_cc_dex part one done. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

    for i in range(0, 4):
        CC.dexCCIn("100000000", {'from': accounts[0].address})

        estNewRate = getEstNewRate(CC, cc_initial_balance, ccTotalSupplyStart)
        LOG.info("New Est Rate: " + str(estNewRate))
        newActualRate = estNewRate * (1 - .01)
        LOG.info("New Actual Rate: " + str(newActualRate))
        CC.setDexCCRate(str(newActualRate) + " ether", {'from': accounts[0].address})
        # How much CC could I dex in right now?
        estPreTaxInverse = 1 / estNewRate
        LOG.info("New Est Pre Tax Inverse: " + str(estPreTaxInverse))
        CC.setDexXMTSPRate(str(estPreTaxInverse) + " ether", {'from': accounts[0].address})

    LOG.info("cc_initial_balance: " + str(cc_initial_balance))

    curBal = CC.balanceOf(CC.address)
    LOG.info("Current CC balance: " + str(curBal))

    curBurn = ccTotalSupplyStart - CC.totalSupply()
    curCCOutstanding = cc_initial_balance - curBal - curBurn
    LOG.info("Current CC Outstanding: " + str(curCCOutstanding))

    curXBal = CC.B();
    LOG.info("Current XMTSP balance: " + str(curXBal))

    ratioXMTSPPerCC = curXBal/curCCOutstanding
    LOG.info("Ratio XMTSP per CC: " + str(ratioXMTSPPerCC))

    LOG.info("test_cc_dex part two ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

    curRat = getCurXMTSPRate(CC, cc_initial_balance, ccTotalSupplyStart)
    LOG.info("Current X rate: " + str(curRat))

    LOG.info("Dexing in outstanding cc")
    CC.dexCCIn(curCCOutstanding, {'from': accounts[0].address})

    curRat = getCurXMTSPRate(CC, cc_initial_balance, ccTotalSupplyStart)
    LOG.info("Whale'd current X rate: " + str(curRat))

    curXBal = CC.B();
    LOG.info("Whale'd current XMTSP balance: " + str(curXBal))

    CC.dexXMTSPIn({'from': accounts[0].address, 'value': OneCC})

    curRat = getCurXMTSPRate(CC, cc_initial_balance, ccTotalSupplyStart)
    LOG.info("Current X rate: " + str(curRat))
    estNewRateTaxed = curRat * (1 - .01)
    LOG.info("New Est Rate: " + str(estNewRateTaxed))

    CC.dexXMTSPIn({'from': accounts[0].address, 'value': "1000000000000000"})


    curRat = getCurXMTSPRate(CC, cc_initial_balance, ccTotalSupplyStart)
    LOG.info("Current X rate: " + str(curRat))

    estNewRateTaxed = curRat * (1 - .01)
    LOG.info("New Est Rate: " + str(estNewRateTaxed))



    #CC.dexCCIn(1, {'from': accounts[0].address})
    #CC.dexCCIn(10, {'from': accounts[0].address})
    #CC.dexCCIn(100, {'from': accounts[0].address})
    #CC.dexCCIn(1000, {'from': accounts[0].address})
    #CC.dexCCIn(10000, {'from': accounts[0].address})
    #CC.dexCCIn(100000, {'from': accounts[0].address})
    #CC.dexCCIn(1000000, {'from': accounts[0].address})
    #CC.dexCCIn(10000000, {'from': accounts[0].address})
    #CC.dexCCIn(100000000, {'from': accounts[0].address})
    #CC.dexCCIn(1000000000, {'from': accounts[0].address})
    #CC.dexCCIn(100000000000, {'from': accounts[0].address})
    #CC.dexCCIn(1000000000000, {'from': accounts[0].address})
    #CC.dexCCIn(10000000000000, {'from': accounts[0].address})
    #CC.dexCCIn(100000000000000000, {'from': accounts[0].address})
    #CC.dexCCIn(100000000000000000000, {'from': accounts[0].address})
    #CC.dexCCIn(10000000000000000000000, {'from': accounts[0].address})




