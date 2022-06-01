import inspect
from brownie import *

OneCC = 1000000000000000000   # This number is equal to 1 Culture Coin
maxint = 115792089237316195423570985008687907853269984665640564039457584007913129639935

  
def main():
    account = accounts.load("Account1")
    print("Account1:", account.address)

   
    # Deploy the contract
    print("Deploying the contract...")

    deployAmount = 2 * 210100027 * OneCC
    print("Deploying with amount:", deployAmount)

    CultureCoin.deploy({'from': account}); #, "gas_price": 900000000000})
