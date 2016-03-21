import swarmlog from 'swarmlog'
import sodium from 'chloride/browser'
import crypto from 'crypto-browserify'

// helper functions ----------------------------------

function sign (privKey, payload) {
  var s = crypto.createSign('RSA-SHA256')
  s.update(payload)
  return s.sign(privKey, 'hex')
}

function verify (pubKey, payload, sig) {
  var v = crypto.createVerify('RSA-SHA256');
  v.update(payload)
  return v.verify(pubKey, sig, 'hex')
}


// data structures -----------------------------------

function keyMessage (pubkey, payload, sig) {
  return {
    pubkey: pubkey,
    payload: payload,
    signature: sig,
  }
}

const idSwarm = (opts) => {

  opts.sodium = sodium
  opts.valueEncoding = 'json'
  let log = swarmlog(opts)

  function add (log, keypair, payload, cb) {

    // sign the payload with the private key
    var sig = sign(keypair.private, payload)

    // create a log message for the new identity
    var m = keyMessage(keypair.public, payload, sig)

    // append it to the log
    log.append(m, (err, res) => {
      if (cb) 
       cb(err, res)
    })
  }

  return {
    log: log,
    add: add,
  }
}

export default idSwarm