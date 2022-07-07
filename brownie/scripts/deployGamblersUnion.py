import os
import inspect
from brownie import *
from dotenv import load_dotenv

load_dotenv()
cCA = os.getenv("cCA")
print("Using cCA: " + cCA)
cultureCoinAddress = os.environ['cultureCoinAddress']
print("Using CC address of ", cultureCoinAddress)
daedalusClassBoosterAddress = os.environ['daedalusClassBoosterAddress']
print("Using DCBT address of ", daedalusClassBoosterAddress)

benDeployAddress = os.environ['benDeployAddress']
print("Using benDeployAddress: " + benDeployAddress)


def main():
    account = accounts.load("Account1")     # This is the deployer account and NOT always the cCA so please use: cCA and not account.address
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    GamblersUnionBEN.deploy(cultureCoinAddress,
                                    daedalusClassBoosterAddress, 
                                    cCA, 35, 18, 
                                    benDeployAddress, 
                                    {'from': account}) # , "gas_price": gasPrice})

    print("WARNING!!! YOU MAY HAVE TO REDEPLOY THE CLOUD CODE AT THE END OF THE DEPLOYMENT PROCESS: bakerydemo% bash deployCloud.sh")
