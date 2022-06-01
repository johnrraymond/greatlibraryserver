import os
import inspect
from brownie import *
from dotenv import load_dotenv

load_dotenv()
cCA = os.environ["cCA"]
print("Using cCA: " + cCA)
cultureCoinAddress = os.environ['cultureCoinAddress']
print("Using cultureCoinAddress: " + cultureCoinAddress)

bsImplAddress = os.environ['baseSpellsImplAddress']
print("Using BS Impl address of ", bsImplAddress)

proxyAdmin = os.environ['proxyAdmin']
print("Using proxyAdmin: " + proxyAdmin)

from scripts.helpful_scripts import encode_function_data

## address _cCA, address cultureCoin, string memory _uri
encoded_initializer_function = encode_function_data(BaseSpells[-1].initialize, cCA, cultureCoinAddress, "https://greatlinbrary.io/games/TSC/BaseSpells/")


def main():
    account = accounts.load("Account1")     # This is the deployer account and is used to deploy the proxy but may not be the cCA
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    proxy = TransparentUpgradeableProxy.deploy(
        bsImplAddress,
        proxyAdmin,
        encoded_initializer_function,
        {"from": account}
    )

    print("WARNING!!! YOU MAY HAVE TO REDEPLOY THE CLOUD CODE AT THE END OF THE DEPLOYMENT PROCESS: bakerydemo% bash deployCloud.sh")
