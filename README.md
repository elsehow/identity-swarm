# identity-swarm
a p2p, distributed keyserver/keyring

## usage

first generate some ed25519 keys:

    $ node -pe "JSON.stringify(require('ssb-keys').generate())" > keys.json

now, make a new keyring: 

```javascript
var idswarm = require('identity-swarm')

var keyring = idswarm({
  keys: require('./keys.json'),
  sodium: require('chloride/browser'),
  db: requrie('memdb')(),
  hubs: [ 'https://signalhub.mafintosh.com' ]
})

// TODO show newIdentity, udpateIdentity + lookup
```

## api

### keyring.newIdentity(keypair, payload)

posts `keypair.public` to the keyring

`payload` can be arbitrary json

`payload` is signed with `keypair.private`. the private key is *NOT* posted to the keyring!

### keyring.updateIdentity(oldIdentity, keypair, payload)

### keyring.lookup({[pubkey='pubkey'], [prop='prop-name']....})

will search for a given pubkey, or other property name, in the keyring.

## background

see [hyperchat/#10](https://github.com/elsehow/hyperchat2/issues/10)

## license

BSD
