const constants = require('../constants')
const fetch = require('node-fetch')

const { apiToken } = require('../config')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const ProviderService = function (provider, network) {
  const providerIndex = Object.values(constants.PROVIDERS).indexOf(provider)
  if (providerIndex < 0) {
    throw new Error('Blockchain provider not supported')
  }
  const providerKey = Object.keys(constants.PROVIDER_URLS)[providerIndex]
  if (constants.PROVIDER_URLS[providerKey].SUPPORT.indexOf(network) < 0) {
    throw new Error('Network not supported by provider')
  }
  this.network = network
  this.provider = provider
}

ProviderService.prototype.getTxHex = async function (txId) {
  try {
    switch (this.provider) {
      case constants.PROVIDERS.BLOCKCYPHER: {
        const apiUrl = [
          constants.PROVIDER_URLS.BLOCKCYPHER.URL,
          constants.PROVIDER_URLS.BLOCKCYPHER.EXTRA_URL[this.network],
          `txs/${txId}`,
          '?includeHex=true'
        ].join('/')
        const res = await fetchUrl(apiUrl)
        const json = await res.json()
        if (res.status !== 200) {
          throw new Error(json)
        }
        return json.hex
      }
      case constants.PROVIDERS.MEMPOOLSPACE: {
        const networkType =
          this.network === constants.NETWORKS.BTC ? 'api' : 'testnet/api'
        const apiUrl = [
          constants.PROVIDER_URLS.MEMPOOLSPACE.URL,
          networkType,
          'tx',
          txId,
          'hex'
        ].join('/')
        const res = await fetchUrl(apiUrl)
        const hex = await res.text()
        if (res.status !== 200) {
          throw new Error(hex)
        }
        return hex
      }
      case constants.PROVIDERS.BLOCKCHAINCOM: {
        const apiUrl = [
          constants.PROVIDER_URLS.BLOCKCHAINCOM.URL,
          'rawtx',
          txId,
          '?format=hex'
        ].join('/')
        const res = await fetchUrl(apiUrl)
        const hex = await res.text()
        if (res.status !== 200) {
          throw new Error(hex)
        }
        return hex
      }
      default: {
        throw new Error('Could not get hex with provider: ' + this.provider)
      }
    }
  } catch (err) {
    throw new Error(err)
  }
}

ProviderService.prototype.getUtxo = async function (addr) {
  try {
    switch (this.provider) {
      case constants.PROVIDERS.BLOCKCYPHER: {
        const apiUrl = [
          constants.PROVIDER_URLS.BLOCKCYPHER.URL,
          constants.PROVIDER_URLS.BLOCKCYPHER.EXTRA_URL[this.network],
          `addrs/${addr}?includeScript=true&unspentOnly=true`
        ].join('/')
        const res = await fetchUrl(apiUrl)
        const json = await res.json()
        if (json.error) {
          throw new Error(json.message)
        }

        if (!json.txrefs) return []

        return json.txrefs.map(tx => ({
          txid: tx.tx_hash,
          output_no: tx.tx_output_n,
          value: tx.value,
          script_hex: tx.script
        }))
      }
      case constants.PROVIDERS.BLOCKCHAINCOM: {
        const apiUrl = [
          constants.PROVIDER_URLS.BLOCKCHAINCOM.URL,
          'unspent?active=' + addr
        ].join('/')
        const res = await fetchUrl(apiUrl)
        const json = await res.json()
        if (json.error) {
          throw new Error(json.message)
        }
        return json.unspent_outputs
      }
      default: {
        throw new Error('Could not get utxo with provider: ' + this.provider)
      }
    }
  } catch (err) {
    throw new Error(err)
  }
}

ProviderService.prototype.sendTx = async function (txHex) {
  try {
    switch (this.provider) {
      case constants.PROVIDERS.BLOCKCYPHER: {
        const apiUrl = [
          constants.PROVIDER_URLS.BLOCKCYPHER.URL,
          constants.PROVIDER_URLS.BLOCKCYPHER.EXTRA_URL[this.network],
          `txs/push?token=${apiToken}`
        ].join('/')
        await broadcastTx(apiUrl, txHex)
        return
      }
      default: {
        throw new Error('Could not send tx with provider: ' + this.provider)
      }
    }
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = ProviderService

async function fetchUrl(url) {
  try {
    let response = await fetch(url)
    if (response.ok) {
      return response
    } else {
      console.log(
        ' -- retrying in 10 seconds due to status = ' + response.status
      )
      await delay(10000)
      return await fetchUrl(url)
    }
  } catch (err) {
    throw new Error(err)
  }
}

async function broadcastTx(apiUrl, txHex) {
  try {
    let res = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ tx: txHex }),
      headers: { 'Content-Type': 'application/json' }
    })
    res = await res.json()
    console.log('Sweep Success!')
    console.log(res)
  } catch (err) {
    console.log('Sweep Failed:')
    throw new Error(err)
  }
}
