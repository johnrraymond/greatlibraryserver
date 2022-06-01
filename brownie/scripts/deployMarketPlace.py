import os
import inspect
from brownie import *

from dotenv import load_dotenv
load_dotenv()

cultureCoinAddress = os.environ['cultureCoinAddress']
print("cuturecoin: " + cultureCoinAddress)

def main():
    account = accounts.load("Account1")
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    #market = MarketPlace[len(MarketPlace) - 1]

    market = MarketPlace.deploy(account.address, account.address, cultureCoinAddress, {'from': account}) # , "gas_price": gasPrice})
    print("Marketplace contract deployed at:" + market.address)

    print("WARNING!!! YOU HAVE TO REDEPLOY THE CLOUD CODE AT THE END OF THE DEPLOYMENT PROCESS: bakerydemo% bash deployCloud.sh")
