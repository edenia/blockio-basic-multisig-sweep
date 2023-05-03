const n = process.env.N
const bip32 = process.env.PRIVATE_KEY1_BIP32
const privkey2 = process.env.PRIVATE_KEY2
const toAddr = process.env.DESTINATION_ADDR
const network = process.env.NETWORK
const derivationPath = process.env.DERIVATION_PATH
const apiToken = process.env.API_TOKEN

module.exports = {
  n,
  bip32,
  privkey2,
  toAddr,
  network,
  derivationPath,
  apiToken
}
