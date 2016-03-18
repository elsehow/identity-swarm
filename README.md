# identity-swarm

a p2p, distributed keyring

anyone can append their public key, and associate it with arbitrary information, stored as a json payload

## usage

first generate some ed25519 keys:

    $ node -pe "JSON.stringify(require('ssb-keys').generate())" > keys.json

now, make a new keyring: 

```javascript
var idswarm = require('identity-swarm')

var keyring = idswarm({
  keys: require('./keys.json'),
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

there are an [increasing](https://github.com/moose-team/friends/)
[number](https://github.com/haadcode/orbit) 
of p2p conent sharing schemes out there

[scuttlebutt](https://scuttlebot.io) is particularly interesting, as it provides a distributed, unforgeable feed of messages. scuttlebutt allows for identity discovery within social networks, and can help provide an added layer of social proof when you're deciding to trust a new key 

however, one still might want to address a message to someone outside of their social network, and for that we need a global key discovery.

this project works as a distributed, shared keyring, to which anyone can append their public key, and associate it with arbitrary other information, stored as a json payload.


## license

BSD
