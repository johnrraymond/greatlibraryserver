import inspect
from brownie import *

gasPrice = 100000000000
cultureCoinAddress = "0x29e5eeBABC13Ea61bf36A90dcB668817FcB976Db"

def main():
    account = accounts.load("Account1")
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    #market = MarketPlace[len(MarketPlace) - 1]

    market = MarketPlace.deploy(account.address, account.address, cultureCoinAddress, {'from': account, "gas_price": gasPrice})
    print("Marketplace contract deployed at:", market.address)

