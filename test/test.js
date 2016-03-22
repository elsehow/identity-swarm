import idswarm from '..'
import memdb from 'memdb'
// testing libs
import test from 'tape'
import tape_dom from 'tape-dom'
tape_dom.installCSS();
tape_dom.stream(test);

// for testing, make a keyring
function makeKeyring (onId) {
  return idswarm({
    keys: require('./keys.json'),
    db: memdb(),
    hubs: [ 'https://signalhub.mafintosh.com' ]
  }, onId)
}

// and a keypair
import keypair from 'keypair'
var kp = keypair()

// and a small payload for testing
var payload = {name: 'elsehow'}

// tests -------------------------------------------

test('adding a good keypair works', (t) => {

  t.plan(5)

  var keyring = makeKeyring((id) => {
    t.deepEqual(payload, id.payload, 'we received the payload ok')
    t.deepEqual(kp.public, id.pubkey, 'we received the pubkey ok')
    t.deepEqual('RSA-SHA256', id.keytype, 'we received the keytype ok')
  })


  keyring.add(kp, 'RSA-SHA256', payload, (err, res) => {
    t.notOk(err, 'no errors')
    t.ok(res, 'callback fires when we add a keypair')
  })

})


test('keypair.add on a badly formed keypair/payload triggers an error cb', (t) => {

  t.plan(4)

  var keyring = makeKeyring((id) => {
     t.notOk(id, 'we should not see an id come through')
  })

  keyring.add('not a keypair', 'RSA-SHA256', payload, (err, res) => {
    t.notOk(res, 'no result here - nothing got added')
    t.ok(err, 'we see an error! ' + err)
  })

  keyring.add(keypair, 'bad key type', payload, (err, res) => {
    t.notOk(res, 'no result here - nothing got added')
    t.ok(err, 'we see an error! ' + err)
  })

})

test('adding a bad keypair to the log directly should not work', (t) => {

  var keyring = makeKeyring((id) => {
     t.notOk(id, 'we should not see an id come through')
     t.end()
  })

  keyring.log.append({
    pubkey: keypair.public,
    keytype: 'RSA-SHA256',
    payload: payload,
    sig: 'bogus signature',
  })

  setTimeout(() => {
    t.ok(1, 'adding a bogus message to the hyperlog does not trigger the newId callback')
    t.end()
  }, 700)

})
