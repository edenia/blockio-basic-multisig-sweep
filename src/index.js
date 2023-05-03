const Sweeper = require('./sweeper')
const {
  n,
  bip32,
  privkey2,
  toAddr,
  network,
  derivationPath,
  apiToken
} = require('./config')

if (
  !n ||
  !bip32 ||
  !privkey2 ||
  !toAddr ||
  !network ||
  !derivationPath ||
  !apiToken
) {
  console.log('One or more required arguments are missing')
  process.exit(0)
}

const sweep = new Sweeper(network, bip32, privkey2, toAddr, n, derivationPath, {
  provider: 'blockcypher'
})

Sweep()

async function Sweep() {
  try {
    await sweep.begin()
  } catch (err) {
    console.log(err)
  }
}
