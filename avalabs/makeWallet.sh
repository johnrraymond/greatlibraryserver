
YOURUSERNAMEHERE=$1
YOURPASSWORDHERE=$2

echo $YOURUSERNAMEHERE
echo $YOURPASSWORDHERE

curl -X POST --data '{
     "jsonrpc": "2.0",
     "id": 1,
     "method": "keystore.createUser",
     "params": {
         "username": "'$YOURUSERNAMEHERE'",
         "password": "'$YOURPASSWORDHERE'"
     }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
