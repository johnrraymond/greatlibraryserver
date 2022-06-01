import time
import pytest
import logging
from brownie import accounts

from allHeros import HEROS
from greatLibrary import CC, MP, PP, example_bookmark, proxyAdmin
from itemsSpellsLoot import  items, spells, loot

LOG = logging.getLogger(__name__)

OneCC = 1000000000000000000   # This number is equal to 1 Culture Coin
maxint = 115792089237316195423570985008687907853269984665640564039457584007913129639935
deployAmount = 2 * 210100027 * OneCC

from scripts.helpful_scripts import encode_function_data


@pytest.fixture(scope="session")
def heros(CC, PP, HEROS, spells):
    nbt = HEROS.getNBT();

    for i in range(1, 16):
        LOG.info("i: " + str(i))
        HEROS.heroMint(1, accounts[0].address, i, 0, {'from': accounts[0].address})
        spells.setState(HEROS.address, i, FLAG_IS_NPC, True, {'from': accounts[0].address});

    tx = HEROS.heroMint(1, accounts[0].address, DAEDALUSCLASS, 0, {'from': accounts[0].address})
    LOG.info("tx: " + str(tx))
    tx.info()

    spells.setState(HEROS.address, DAEDALUS, FLAG_IS_NPC, True, {'from': accounts[0].address});

    return HEROS

@pytest.fixture(scope="session")
def timecube(TimeCube, proxyAdmin, TransparentUpgradeableProxy, Contract, CC, heros, spells, items, loot):

    TCImpl = accounts[0].deploy(TimeCube)

    ## address _cCA, address _cultureCoin, address _hero, address _spells, address _loot, address _items, string memory _uri
    encoded_initializer_function = encode_function_data(TCImpl.initialize, accounts[0].address, CC.address, heros.address, spells.address, loot.address, items.address, "Uri")

    proxy = accounts[0].deploy(TransparentUpgradeableProxy,
        TCImpl.address,
        proxyAdmin,
        encoded_initializer_function
    )

    tcProxy = Contract.from_abi("TimeCube", proxy.address, TimeCube.abi)
    LOG.info("timeCube: " + str(tcProxy.address))

    CC.setAddon(tcProxy.address, True, {'from': accounts[0].address})
    items.setAddon(tcProxy.address, True, {'from': accounts[0].address})
    loot.setAddon(tcProxy.address, True, {'from': accounts[0].address})
    spells.setAddon(tcProxy.address, True, {'from': accounts[0].address})
    heros.setAddon(tcProxy.address, True, {'from': accounts[0].address})

    return tcProxy



GAZ=1
RENNLY=15
DAEDALUS=16
DAEDALUSCLASS=134
FLAG_IS_NPC=10000
ARCANE_ORB=1
def test_timecube(heros, timecube, loot):

    #curTime = timecube.cubeTime({'from': accounts[0].address})
    #LOG.info("time: " + str(curTime))
    walk = timecube.walkStart(GAZ, {'from': accounts[0].address})
    LOG.info("Gaz starts walking." + str(walk.events))

    time.sleep(2)
    trip = timecube.walkEnd(GAZ, OneCC+1, OneCC+1, OneCC+1, {'from': accounts[0].address});
    ##trip.info()
    LOG.info("Gaz ends walking." + str(trip))
    ##LOG.info("Gaz has has a trip: " + str(dir(trip)))
    ##LOG.info("Gaz's trip log: " + str(trip.logs))
    LOG.info("Notable events on his trip: " + str(trip.events))

    ## Now we need to move Rennly into play.
    walk = timecube.walkStart(RENNLY, {'from': accounts[0].address})
    trip = timecube.walkEnd(RENNLY, OneCC, OneCC, OneCC, {'from': accounts[0].address});
    
    ## GAZ cast Arcane Orb on himself twice and Rennly one.
    ao = timecube.castAO(GAZ, GAZ, RENNLY, {'from': accounts[0].address})
    LOG.info("Gaz casts Arcane Orb on himself twice and Rennly once." + str(ao.events))


    ## Rennly activates the arcane orb attacking gaz with it.
    act = timecube.activateAO(RENNLY, GAZ, ARCANE_ORB, 1, {'from': accounts[0].address})
    LOG.info("Rennly activates his arcane orb attacking Gaz with it." + str(act.events))

    ## GAZ is dead, so Rennly loots him.
    l = loot.loot(heros.address, RENNLY, GAZ, {'from': accounts[0].address})
    LOG.info("Gaz is dead, so Rennly loots him." + str(l.events))

    ## Add loot back onto Gaz for Rennly.
    al = loot.addLoot(heros.address, RENNLY, GAZ, {'from': accounts[0].address})
    LOG.info("Put some loot back on Gaz for Rennly." + str(al.events))

    ## DAEDALUS reesurects GAZ.
    timecube.castRES(DAEDALUS, GAZ, {'from': accounts[0].address})
    LOG.info("Daedalus reesurects Gaz.")

    # transmute(uint256 _hId, int _slot, uint _time, uint _what, uint _amount)
    ## Rennly transmutes the loot off Gaz in the cube
    timecube.transmute(RENNLY, 1, 1, GAZ, 1, {'from': accounts[0].address})
    LOG.info("Rennly transmutes the loot he got off Gaz in the cube.")


