import os
import inspect
from brownie import *
from dotenv import load_dotenv

load_dotenv()
cCA = os.getenv("cCA")
print("Using cCA: " + cCA)

cultureCoinAddress = os.environ['cultureCoinAddress']
print("Using cultureCoinAddress: " + cultureCoinAddress)
blImplAddress = os.environ['baseLootImplAddress']
print("Using BL Impl address of ", blImplAddress)
baseSpellsAddress = os.environ['baseSpellsAddress']
print("Using baseSpellsAddress: " + baseSpellsAddress)
proxyAdmin = os.environ['proxyAdmin']
print("Using proxyAdmin: " + proxyAdmin)

from scripts.helpful_scripts import encode_function_data

## address _cCA, address _cultureCoin, address _baseSpells, string memory _uri
encoded_initializer_function = encode_function_data(BaseLoot[-1].initialize, cCA, cultureCoinAddress, baseSpellsAddress, "https://greatlinbrary.io/games/TSC/BaseLoot/")

print("Function encoded.")

def main():
    account = accounts.load("Account1")     # This is the deployer account and is used to deploy the proxy but may not be the cCA
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    proxy = TransparentUpgradeableProxy.deploy(
        blImplAddress,
        proxyAdmin,
        encoded_initializer_function,
        {"from": account}
    )

    print("WARNING!!! YOU MAY HAVE TO REDEPLOY THE CLOUD CODE AT THE END OF THE DEPLOYMENT PROCESS: bakerydemo% bash deployCloud.sh")
