import swarmlog from 'swarmlog'
import sodium from 'chloride/browser'
import crypto from 'crypto-browserify'

// helper functions ----------------------------------

function sign (privkey, keytype, payload) {
  var s = crypto.createSign(keytype)
  s.update(payload)
  return s.sign(privkey, 'hex')
}

function verify (pubkey, keytype, payload, sig) {
  var v = crypto.createVerify(keytype)
  v.update(payload)
  return v.verify(pubkey, sig, 'hex')
}


// data structures -----------------------------------

function keyMessage (pubkey, keytype, payload, sig) {
  return {
    pubkey: pubkey,
    keytype: keytype,
    payload: payload,
    signature: sig,
  }
}

function validate (data) {
  if (data.pubkey && data.keytype && data.payload && data.signature) {
    if (verify(data.pubkey, data.keytype, data.payload, data.signature)) {
      return true
    }
  }
  return false
}

// export -------------------------------------------

const idSwarm = (opts, onNewId) => {

  opts.sodium = sodium
  opts.valueEncoding = 'json'
  let log = swarmlog(opts)

  function add (keypair, keytype, payload, cb) {

    try {

      // sign the payload with the private key
      var sig = sign(keypair.private, keytype, payload)

      // create a log message for the new identity
      var m = keyMessage(keypair.public, keytype, payload, sig)

      // validate the message
      if (validate(m)) {
        // append it to the log
        log.append(m, (err, res) => {
          if (cb) 
           cb(err, res)
        })
      } else {
        if (cb) {
         cb(new Error('Badly formed keypair or payload.')) 
        }
      }

    } catch (e) {
      if (cb) {
        cb(e)
      }
    }
  }

  // set up a listener for new data
  log.createReadStream({ live: true })
    .on('data', (data) => {
      // check that the data is well-formed
      // and that the signature checks out
      if (validate(data.value) && onNewId) 
        onNewId(data.value)
    })

  return {
    log: log,
    add: add,
  }
}

export default idSwarm
