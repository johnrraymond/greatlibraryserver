import os
import inspect
from brownie import *

from dotenv import load_dotenv
load_dotenv()

cCA = os.environ['cCA']
print("culturecoin administrator: " + cCA)
cultureCoinAddress = os.environ['cultureCoinAddress']
print("cuturecoin: " + cultureCoinAddress)

def main():
    account = accounts.load("Account1")
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    press = PrintingPress.deploy(cCA, cultureCoinAddress, {'from': account}) # , "gas_price": gasPrice})
    print("Priting Press contract deployed at:" + press.address)

    print("WARNING!!! YOU HAVE TO REDEPLOY THE CLOUD CODE AT THE END OF THE DEPLOYMENT PROCESS: bakerydemo% bash deployCloud.sh")
