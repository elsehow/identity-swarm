# identity-swarm

a p2p, distributed keyring around a [swarmlog][0]

users can add their public key, and associate it with an arbitrary JSON payload, which is signed and verified on read/write

## usage

first generate some ed25519 keys:

    $ node -pe "JSON.stringify(require('ssb-keys').generate())" > keys.json

now, make a new keyring: 

```javascript
var idswarm = require('identity-swarm')
var keypair = require('keypair')

var keyring = idswarm({
  keys: require('./keys.json'),
  db: requrie('memdb')(),
  hubs: [ 'https://signalhub.mafintosh.com' ]
}, (identity) => {
	console.log('i see a new identity!', identity)
})

keyring.add(keypair(), 'RSA-SHA256', {handle: 'mminsky'})

// > i see a new identity! {pubkey: ..} 

```

## api

### keyring(opts, newIdentityCb)

make a new keyring. available options:

* `opts.keys`: ed25519 keys of the form `{public, private}`. if you are starting a new keyring, you can `npm run generate-keys` to create a new keypair in test/keys.json.

* `opts.hubs` - array of [signalhub][1] hubs to use

* `opts.db` - a [leveldb][2] instance (use [level-browserify][3] in the browser)

`newIdentityCb` will be called whenever a new, *verified* identity comes over the log.

### keyring.add(keypair, keytype, payload, [cb])

posts `keypair.public` to the keyring

`keytype` is a string referring to the algo. for now, only `'RSA-SHA256'` has been tested.

`payload` can be arbitrary json.  `payload` is signed with `keypair.private`. the private key is *NOT* posted to the keyring!

`cb(err, res)` (optional) is called when the keypair is added to the log.

## background

see [hyperchat/#10](https://github.com/elsehow/hyperchat2/issues/10)

there are an [increasing](https://github.com/moose-team/friends/)
[number](https://github.com/haadcode/orbit) 
of p2p conent sharing schemes out there

[scuttlebutt](https://scuttlebot.io) is particularly interesting, as it provides a distributed, unforgeable feed of messages. scuttlebutt allows for identity discovery within social networks, and can help provide an added layer of social proof when you're deciding to trust a new key 

however, one still might want to address a message to someone outside of their social network, and for that we need a global key discovery.

this project works as a distributed, shared keyring, to which anyone can append their public key, and associate it with arbitrary other information, stored as a json payload.

## developing

`test/test.js` contains tests and specs. to develop,

	npm run dev

navigate to localhost:8000 to see the results of the tests 

## license

BSD

[0]: https://github.com/substack/swarmlog
[1]: https://npmjs.com/package/signalhub
[2]: https://npmjs.com/package/levelup
[3]: https://npmjs.com/package/level-browserify
