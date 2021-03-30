const hw1 = require('../backend/hello_world.js');
const server = require("../backend/server-setup");

describe('Test Setting Up Server', function() {

  context('', function() {
    it('', async function() {
    
      // use await to wait until the promise is fulfilled
      const serve = server.setUpServer();
    })
    
  })
})

describe('Test Establishing Connection', function() {

    context('', function() {
      it('', async function() {
      
        // use await to wait until the promise is fulfilled
        const econn = await hw1.establishConnection();
      })
      
    })
})

describe('Test Establishing Payer', function() {

    context('', function() {
      it('', async function() {
      
        // use await to wait until the promise is fulfilled
        const econn = await hw1.establishConnection();
        const payer = await hw1.establishPayer();
      })
      
    })
})

describe('Test Loading Program', function() {

    context('', function() {
      it('', async function() {
      
        // use await to wait until the promise is fulfilled
        const econn = await hw1.establishConnection();
        const payer = await hw1.establishPayer();
        const load = await hw1.loadProgram();
      })
      
    })
})