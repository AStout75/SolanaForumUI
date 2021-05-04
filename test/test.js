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

/*
  Function to aid in keeping the server running
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Test Sending Multiple Messages Using New ID', function() {

  context('', function() {
    it('', async function() {

      const serve = server.setUpServer();
      
      const path = './backend/util/store/config.json'
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      const econn = await hw1.establishConnection();
      const payer = await hw1.establishPayer();
      const l = await hw1.loadProgram();
      var load = hw1.getGreetedPublicKey();

      /*CODE BELOW IS FOR DEBUGGING WITHOUT TIMER

        // const post = await hw1.sayHello("CA Hospitilizations;Hospitalizations in CA are now at an ALL TIME LOW since the start of the pandemic.", "post");
      
        // const newAcct1 = await hw1.setNewAccount(); 
        // const post1 = await hw1.sayHello("COVID Treatment;COVID Treatment At Home: If < 60 y, pulse ox > 92% and have no chronic diseases, use ibuprofen etc. Isolate for 10-d and expect recovery in 2-3 wks.", "post");
        
        // const newAcct2 = await hw1.setNewAccount();
        // const post2 = await hw1.sayHello("Smarter Testing On The Way;As vaccination drives beat back Covid-19 in many Western countries, health experts say quicker and smarter testing is the route to keeping the disease under control as restrictions on daily life ease", "post");
        
        // const newAcct3 = await hw1.setNewAccount();
        // const post3 = await hw1.sayHello("Coronavirus Predicted;A Dean Koontz novel in 1981 predicted the outbreak of Coronavirus!", "post");
        
        // var newAcct4 = await hw1.setNewAccount();
        // const post4 = await hw1.sayHello("Fakery Of Covid;MORE charges get withdrawn, the fakery of covid measures becomes clearer everyday.", "post");

        // const r1 = await hw1.replyToPost("Great news!", load, 0);
        // const r2 = await hw1.replyToPost("Thank you for the help!", newAcct1, 0);
        // const r3 = await hw1.replyToPost("This is fake", newAcct2, 0);
        // const r4 = await hw1.replyToPost("This is fake news", newAcct3, 0);
        
        // const l1 = await hw1.likePost(load, 0);
        // const l2 = await hw1.likePost(newAcct1, 0);
        // const l3 = await hw1.likePost(newAcct2, 0);
      
        // var newAcct5 = await hw1.setNewAccount();

        // const pet1 = await hw1.createPetitionForPost(newAcct3, 0);
        // const pet2 = await hw1.createPetitionForPost(newAcct4, 0);
        // const v1 = await hw1.voteOnPetition(pet1, 1);
        // const v2 = await hw1.voteOnPetition(pet2, 1);

        // var newAcct6 = await hw1.setNewAccount();
        // const v3 = await hw1.voteOnPetition(pet2, 1);
        // var voters = [newAcct5, newAcct6];
        // const fin = await hw1.finalizePetitionOutcomeShowcase(pet2, newAcct4, voters);
        */      

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

        socket.on('vote-petition', (petition, vote) => {
          let pk = new PublicKey(petition.pubkey);
          let pk2 = new PublicKey(petition.offendingPubkey);
          console.log("vote petition func, pk is", pk);
          
          //if done //RACE condition?
          if (petition.numSignatures == petition.signatureCapacity) {
            hw1.finalizePetitionOutcome(pk, pk2, petition.signatures);
          }
          else {
            hw1.voteOnPetition(pk, vote); //test vote yes for now
          }
      });
  
        socket.on('like-post', like => {
          let pk = new PublicKey(like.target.pubkey);
          console.log("Recieved report for post", pk.toBase58(), ":", like.target.index);
          hw1.likePost(pk, like.target.index);
        });
    })

      //This loop runs on a 0.5s timer and sends posts, replies, likes, petitions, and reports 
      //to simulate a community of users
      var postTimer = 0;
      while(true) {
        accountsBundle = await hw1.bundleAllPosts();
        serve.emit('send-posts', accountsBundle);
        await sleep(500);
        postTimer += 1;
      
        var newAcct1;
        var newAcct2;
        var newAcct3;
        var newAcct4;
        var newAcct5;
        var newAcct6;
        var pet1;
        var pet2;

        switch(postTimer) {

          case 1:
            const post = await hw1.sayHello("CA Hospitializations;Hospitalizations in CA are now at an ALL TIME LOW since the start of the pandemic.", "post");
            var newAcct1 = await hw1.setNewAccount();
            break;

          case 5:
            const post1 = await hw1.sayHello("COVID Home Treatment;COVID Treatment At Home: If < 60 y, pulse ox > 92% and have no chronic diseases, use ibuprofen etc. Isolate for 10-d and expect recovery in 2-3 wks.", "post");
            var newAcct2 = await hw1.setNewAccount();
            break;
          
          case 10:
            const post2 = await hw1.sayHello("COVID Vaccinations;As vaccination drives beat back Covid-19 in many Western countries, health experts say quicker and smarter testing is the route to keeping the disease under control as restrictions on daily life ease", "post");
            var newAcct3 = await hw1.setNewAccount();
            break;
          
          case 15:
            const post3 = await hw1.sayHello("COVID was Predicted;A Dean Koontz novel in 1981 predicted the outbreak of Coronavirus!", "post");
            var newAcct4 = await hw1.setNewAccount();
            break;
          
          case 20: 
            const post4 = await hw1.sayHello("Fakery of Covid Laws;MORE charges get withdrawn, the fakery of covid measures becomes clearer everyday.", "post");
            break;

          case 25:
            const r1 = await hw1.replyToPost("Great news!", load, 0);
            const r2 = await hw1.replyToPost("Thank you for the help!", newAcct1, 0);
            const r3 = await hw1.replyToPost("This is fake", newAcct2, 0);
            const r4 = await hw1.replyToPost("This is fake news", newAcct3, 0);
            break;
          
          case 30:
            const l1 = await hw1.likePost(load, 0);
            const l2 = await hw1.likePost(newAcct1, 0);
            const l3 = await hw1.likePost(newAcct2, 0);
            break;
          
          case 35:
            var newAcct5 = await hw1.setNewAccount();
            var pet1 = await hw1.createPetitionForPost(newAcct3, 0);
            var pet2 = await hw1.createPetitionForPost(newAcct4, 0);
            const v1 = await hw1.voteOnPetition(pet1, 1);
            const v2 = await hw1.voteOnPetition(pet2, 1);
            break;

          case 40:
            var newAcct6 = await hw1.setNewAccount();
            const v3 = await hw1.voteOnPetition(pet2, 1);
            var voters = [newAcct5, newAcct6];
            const fin = await hw1.finalizePetitionOutcomeShowcase(pet2, newAcct4, voters);

          default:
            break;
        }

      }
    })
    
  })
})

