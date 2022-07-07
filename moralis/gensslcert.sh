#openssl genrsa -out key.pem
#openssl req -new -key key.pem -out csr.pem
#openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
#rm csr.pem

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
openssl pkcs12 -export -inkey key.pem -in cert.pem -out cert.pfx
#openssl x509 -noout -fingerprint -sha256 -inform pem -in cert.pem >> fingerprint.txt
