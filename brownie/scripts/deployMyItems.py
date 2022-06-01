import os
import inspect
from brownie import *

from dotenv import load_dotenv
load_dotenv()

#gasPrice = 100000000000

cCA = os.environ['cCA']
cultureCoinAddress = os.environ['cultureCoinAddress']
registryAddress = os.environ['marketPlaceAddress']

baseSpellsAddress = os.environ['baseSpellsAddress']
bookmarkAddress = os.environ['bookmarkAddress']

def main():
    account = accounts.load("Account1")
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    #address _cCA, address _cultureCoin, address _registryAddress, address _baseSpells, address _nbt
    MyItems.deploy(cCA, cultureCoinAddress, registryAddress, baseSpellsAddress, bookmarkAddress, {"from": account})

    ### , "gas": gasPrice})
