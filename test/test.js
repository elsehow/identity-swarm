import idswarm from '..'
import memdb from 'memdb'
// testing libs
import test from 'tape'
import tape_dom from 'tape-dom'
tape_dom.installCSS();
tape_dom.stream(test);

// for testing, make a keyring
function makeKeyring (goodIdCb, badIdCb) {
  return idswarm({
    keys: require('./keys.json'),
    db: memdb(),
    hubs: [ 'https://signalhub.mafintosh.com' ]
  }, goodIdCb)
}

// and a keypair
import keypair from 'keypair'
var kp = keypair()


// tests -------------------------------------------

test('adding a good keypair works', (t) => {

  t.plan(4)

  var payload = {name: 'elsehow'}

  var keyring = makeKeyring((id) => {
    t.deepEqual(payload, id.payload, 'we received the payload ok')
    t.deepEqual(kp.public, id.pubkey, 'we received the pubkey ok')
  })


  keyring.add(kp, payload, (err, res) => {
    t.notOk(err, 'no errors')
    t.ok(res, 'callback fires when we add a keypair')
  })

})


test('keypair.add on a badly formed keypair/payload triggers an error cb', (t) => {

  t.plan(2)

  var payload = {name: 'elsehow'}

  var keyring = makeKeyring()
  // (id) => {
  //   t.notOk(id, 'we should not see an id come through')
  // })

  keyring.add('not a keypair', payload, (err, res) => {
    t.notOk(res, 'no result here - nothing got added')
    t.ok(err, 'we see an error! ' + err)
  })

})

// TODO test adding an incorrect keypair to the log directly

// TODO maybe move memdb into core deps ? unclear