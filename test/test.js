import idswarm from '..'
import memdb from 'memdb'
//document.write('hi')

var keyring = idswarm({
  keys: require('./keys.json'),
  db: memdb(),
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

//document.write(JSON.stringify(keyring))

function write (thing) {
	document.writeln(JSON.stringify(thing))
}

import keypair from 'keypair'

var kp = keypair()

// sign / verify

import crypto from 'crypto-browserify'

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


var payload = {hey: 'guys', whats: 'up'}
var sig = sign(kp.private, payload)
write(sig)
var verif = verify(kp.public, payload, sig)
write(verif)