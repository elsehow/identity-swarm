import swarmlog from 'swarmlog'
import sodium from 'chloride/browser'
import crypto from 'crypto-browserify'

// helper functions ----------------------------------

function sign (privkey, payload) {
  var s = crypto.createSign('RSA-SHA256')
  s.update(payload)
  return s.sign(privkey, 'hex')
}

function verify (pubkey, payload, sig) {
  var v = crypto.createVerify('RSA-SHA256');
  v.update(payload)
  return v.verify(pubkey, sig, 'hex')
}


// data structures -----------------------------------

function keyMessage (pubkey, payload, sig) {
  return {
    pubkey: pubkey,
    payload: payload,
    signature: sig,
  }
}

function validate (data) {
  if (data.pubkey && data.payload && data.signature) {
    if (verify(data.pubkey, data.payload, data.signature)) {
      return true
    }
  }
  return false
}

// export -------------------------------------------

const idSwarm = (opts, newIdCb) => {

  opts.sodium = sodium
  opts.valueEncoding = 'json'
  let log = swarmlog(opts)

  function add (keypair, payload, cb) {

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

  // set up a listener for new data
  log.createReadStream({ live: true })
    .on('data', (data) => {
      // check that the data is well-formed
      // and that the signature checks out
      if (validate(data.value)) 
        newIdCb(data.value)
    })

  return {
    log: log,
    add: add,
  }
}

export default idSwarm