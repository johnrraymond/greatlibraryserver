### Very critical that CC.sol is not damamged
#echo "defunct";
#exit 1;

#cp contracts/CultureCoin.sol.bak contracts/CultureCoin.sol
cp contracts/CultureCoin.sol Solution.sol
sed -i 's/\/\/.*//g' Solution.sol
# Delete the first line in the file
sed -i '1d' Solution.sol
# Delete the last line in the file
sed -i '$d' Solution.sol

cp contracts/NaturalCoin.sol Solution2.sol
sed -i 's/\/\/.*//g' Solution2.sol
# Delete the first line in the file
sed -i '1d' Solution2.sol
# Delete the last line in the file
sed -i '$d' Solution2.sol


# Copy the file to the correct location
#cp Solution.sol contracts/Solution.sol

#mv contracts/CultureCoin.sol contracts/CultureCoin.sol.bak

# Compile the contract
#solc --abi --bin -o build/contracts/ Solution.sol
#brownie compile

#brownie run scripts/deployCultureCoin.py --network=$1

#cp build/contracts/Solution.json contracts/CultureCoin.json
#This already exists in the build folder

#sed -i 's\n *\\g' build/contracts/CultureCoin.json


