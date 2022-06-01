import os
import inspect
from brownie import *
from dotenv import load_dotenv

load_dotenv()
cCA = os.getenv("cCA")
print("Using cCA: " + cCA)

timeCubeImplAddress = os.environ['timeCubeImplAddress']
print("Using TimeCube Impl address of ", timeCubeImplAddress)
cultureCoinAddress = os.environ['cultureCoinAddress']
print("Using CultureCoin address of ", cultureCoinAddress)
baseSpellsAddress = os.environ['baseSpellsAddress']
print("Using BaseSpells address of ", baseSpellsAddress)
baseLootAddress = os.environ['baseLootAddress']
print("Using BaseLoot address of ", baseLootAddress)
myItemsAddress = os.environ['myItemsAddress']
print("Using MyItems address of ", myItemsAddress)
heroAddress = os.environ['heroAddress']
print("Using Hero address of ", heroAddress)

proxyAdmin = os.environ['proxyAdmin']
print("Using proxyAdmin: " + proxyAdmin)

from scripts.helpful_scripts import encode_function_data

# address _cCA, address _cultureCoin, address _hero, address _spells, address _loot, address _items, string memory _uri
encoded_initializer_function = encode_function_data(TimeCube[-1].initialize, cCA, cultureCoinAddress, heroAddress, baseSpellsAddress, baseLootAddress, myItemsAddress, "TimeCube")


def main():
    account = accounts.load("Account1")     # This is the deployer account and is used to deploy the proxy but may not be the cCA
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    proxy = TransparentUpgradeableProxy.deploy(
        timeCubeImplAddress,
        proxyAdmin,
        encoded_initializer_function,
        {"from": account}
    )

    print("WARNING!!! YOU MAY HAVE TO REDEPLOY THE CLOUD CODE AT THE END OF THE DEPLOYMENT PROCESS: bakerydemo% bash deployCloud.sh")
