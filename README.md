# Sweep BTC

- **THIS IS BETA SOFTWARE. BE CAREFUL!**
- Reference sweep script for Basic (2-of-2) MultiSig wallets. NodeJS.
- Uses [Blockcypher's Free API](https://www.blockcypher.com/dev/bitcoin/#introduction) by default for blockchain data and for broadcasting transactions. You can implement your own backends yourself.
- NEVER SHARE YOUR PRIVATE KEYS. NEVER USE PRIVATE KEYS ON INSECURE SYSTEMS.

## Get Block Cypher API Token

- Go to [Blockcypher](https://www.blockcypher.com) and create an account.
- Go to [Tokens](https://accounts.blockcypher.com/tokens) and create a token.
- Copy the token and save it somewhere safe.
- Save it in the environment variable `API_TOKEN`.

> Note: Currently for a low usage demand there is free version to start playing with it.

Command-line Usage:

```
$ <load your variables to system environment>
$ git clone <repository URL>
$ cd <dir> && npm install
$ node src/index.js
```

- N is the number of addresses you've generated on the given network
- PRIVATE_KEY1_BIP32 is the BIP32 extended private key you backed up
- PRIVATE_KEY2 is the second private key you backed up
- DESTINATION_ADDR is where you want the swept coins to go
- NETWORK is the network for which you're sweeping coins
- DERIVATION_PATH is the derivation path shown when you back up your private keys
- API_TOKEN is the token provided by Blockcypher for the usage of some endpoints of their API
