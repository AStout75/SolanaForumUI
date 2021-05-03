const hw1 = require('../backend/hello_world.js');
const server = require("../backend/server-setup");
const assert = require("assert");
const fs = require("fs");
const { PublicKey } = require('@solana/web3.js');


// describe('Test Establishing Connection', function() {

//     context('', function() {
//       it('', async function() {
      
//         // use await to wait until the promise is fulfilled
//         const econn = await hw1.establishConnection();
//       })
      
//     })
// })

// describe('Test Establishing Payer', function() {

//     context('', function() {
//       it('', async function() {
      
//         // use await to wait until the promise is fulfilled
//         const econn = await hw1.establishConnection();
//         const payer = await hw1.establishPayer();
//       })
      
//     })
// })

// describe('Test Loading Program', function() {

//     context('', function() {
//       it('', async function() {
      
//         // use await to wait until the promise is fulfilled
//         const econn = await hw1.establishConnection();
//         const payer = await hw1.establishPayer();
//         const load = await hw1.loadProgram();
//       })
      
//     })
// })

// describe('Test Sending Message', function() {

//   context('', function() {
//     it('', async function() {
    
//       // use await to wait until the promise is fulfilled
//       const econn = await hw1.establishConnection();
//       const payer = await hw1.establishPayer();
//       const load = await hw1.loadProgram();
//       const post = hw1.sayHello("test message from script", "post");
//       assert.notStrictEqual(post, "test message from script");
//     })
    
//   })
// })

   function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }

describe('Test Sending Multiple Messages Using New ID', function() {

  context('', function() {
    it('', async function() {
    
      // use await to wait until the promise is fulfilled
      const serve = server.setUpServer();
      const path = './backend/util/store/config.json'
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      const econn = await hw1.establishConnection();
      const payer = await hw1.establishPayer();
      const l = await hw1.loadProgram();
      // console.log('Program already loaded to account', load.toBase58());
      const post = await hw1.sayHello("Hospitalizations in CA are now at an ALL TIME LOW since the start of the pandemic.", "post");
      const post1 = await hw1.sayHello("COVID Treatment At Home: If < 60 y, pulse ox > 92% and have no chronic diseases, use ibuprofen etc. Isolate for 10-d and expect recovery in 2-3 wks.", "post");
      const post2 = await hw1.sayHello("As vaccination drives beat back Covid-19 in many Western countries, health experts say quicker and smarter testing is the route to keeping the disease under control as restrictions on daily life ease", "post");
      const post3 = await hw1.sayHello("A Dean Koontz novel in 1981 predicted the outbreak of Coronavirus!", "post");
      const post4 = await hw1.sayHello("MORE charges get withdrawn, the fakery of covid measures becomes clearer everyday.", "post");

      // const pk = new PublicKey(load);
      var load = hw1.getGreetedPublicKey();
      const r1 = await hw1.replyToPost("Great news!", load, 0);
      const r12 = await hw1.replyToPost("A huge milestone for CA", load, 0);
      const r2 = await hw1.replyToPost("Thank you for the help!", load, 1);
      const r3 = await hw1.replyToPost("This is fake", load, 3);
      const r4 = await hw1.replyToPost("This is fake news", load, 4);
      const l1 = await hw1.likePost(load, 2);
      const l2 = await hw1.likePost(load, 0);
      const l3 = await hw1.likePost(load, 0);
      var pet1 = await hw1.createPetitionForPost(load, 3);
      var pet2 = await hw1.createPetitionForPost(load, 4);
      const v1 = await hw1.voteOnPetition(pet1, 3)
      const v2 = await hw1.voteOnPetition(pet2, 4)
      // const v3 = await hw1.voteOnPetition(pet2, 4)

      var i = 0;

      let accountsBundle = await hw1.bundleAllPosts();
      for(let i = 0; i < accountsBundle.length; i++) {
        console.log(accountsBundle[i]);
      }

      serve.on('connection', socket => {
        console.log('user connected');
        socket.emit('send-posts', accountsBundle);

        socket.on('request-posts', () => {
            //console.log(accountsBundle);
            socket.emit('send-posts', accountsBundle);
        });
  
        socket.on('new-post', body => {
            hw1.sayHello(body, "post");
        });
  
        socket.on('reply-post', reply => {
            let pk = new PublicKey(reply.target.pubkey);
            hw1.replyToPost(reply.body, pk, reply.target.index);
            console.log("body:", reply.body);
            console.log("pubkey:", pk.toBuffer().toString("hex"));
            console.log("index:", reply.target.index);
        });
  
        socket.on('report-post', report => {
          
          let pk = new PublicKey(report.target.pubkey);
          console.log("Recieved report for post", pk.toBase58(), ":", report.target.index);
          hw1.reportPost(report.body, pk, report.target.index);
          console.log("body:", report.body);
          console.log("pubkey:", pk.toBuffer().toString("hex"));
          console.log("index:", report.target.index);
  
          console.log("also creating a petition");
          hw1.createPetitionForPost(pk, report.target.index);
      });
  
        socket.on('like-post', like => {
          let pk = new PublicKey(like.target.pubkey);
          console.log("Recieved report for post", pk.toBase58(), ":", like.target.index);
          hw1.likePost(pk, like.target.index);
        });
    })

      while(true) {
        accountsBundle = await hw1.bundleAllPosts();
        serve.emit('send-posts', accountsBundle);
        await sleep(2500);
      }
    })
    
  })
})

