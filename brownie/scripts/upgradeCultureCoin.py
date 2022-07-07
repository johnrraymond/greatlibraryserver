import os
import inspect
from brownie import *
from dotenv import load_dotenv

load_dotenv()
cCA = os.getenv("cCA")
print("Using cCA: " + cCA)

cultureCoinImplAddress = os.getenv("cultureCoinImplAddress")
print("Using cultureCoinImplAddress: " + cultureCoinImplAddress)

proxyAdmin = os.environ['proxyAdmin']
print("Using proxyAdmin: " + proxyAdmin)

from scripts.helpful_scripts import encode_function_data, upgrade
encoded_initializer_function = encode_function_data(CultureCoin[-1].initialize, 0, cCA)

def main():
    account = accounts.load("Account1")     # This is the deployer account and is used to deploy the proxy but may not be the cCA
    print("Account1:", account.address)
    print("Balance:", account.balance())
    print("Nonce:", account.nonce)

    # Deploy the contract
    print("Deploying the contract...")

    cc_v2 = CultureCoin.at(cultureCoinImplAddress)
    proxy = TransparentUpgradeableProxy[-1]
    proxy_admin = ProxyAdmin[-1]
    upgrade(account, proxy, cc_v2, proxy_admin_contract=proxy_admin)
    print("Proxy has been upgraded!")
    cc_proxy = Contract.from_abi("CultureCoin", proxy.address, CultureCoin.abi)
     
    print("If all went well, sit back, relax and enjoy the new version of CultureCoin!")
