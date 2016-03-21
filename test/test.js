import idswarm from '..'
import memdb from 'memdb'
//document.write('hi')

var keyring = idswarm({
  keys: require('./keys.json'),
  db: memdb(),
  hubs: [ 'https://signalhub.mafintosh.com' ]
}, (identity) => {
  console.log('i see a new identity!!!', identity)
})

//document.write(JSON.stringify(keyring))

function write (thing) {
	document.writeln(JSON.stringify(thing))
}

import keypair from 'keypair'

var kp = keypair()

keyring.add(kp, {name: 'elsehow'}, (err, res) => {
  console.log('added your keypair', err, res)
})
// sign / verify



var payload = {hey: 'guys', whats: 'up'}
var sig = sign(kp.private, payload)
write(sig)
var verif = verify(kp.public, payload, sig)
write(verif)