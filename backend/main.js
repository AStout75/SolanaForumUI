/**
 * Hello world
 */

//USE THIS PROGRAM ID FOR NOW:
//"programId":"HSYvx5HjMMC1xxQ9j5mmPrjRZKmDqRZ8UrRAXBjGJndm"



//  import {
//     establishConnection,
//     establishPayer,
//     loadProgram,
//     sayHello,
//     reportHellos,
//     reportAccounts,
//     getArrayOfPosts
//   } from './hello_world';

  const { PublicKey } = require('@solana/web3.js');
const hw1 = require('./hello_world');
  /* Web server */
  const server = require("./server-setup");
  const events = require("./socket-events");

  
const { sleep } = require('./util/sleep');
  
  function getAllPosts() {
    return hw1.bundleAllPosts();
  }

  async function main() {
    var io;
    io = server.setUpServer();
    
    // Establish connection to the cluster
    await hw1.establishConnection();
  
    // Determine who pays for the fees
    await hw1.establishPayer();
  
    // Load the program if not already loaded
    await hw1.loadProgram();

    let accountsBundle = await hw1.bundleAllPosts();
    console.log("Response from Solana validator:");
    for(let i = 0; i < accountsBundle.length; i++) {
      console.log(accountsBundle[i]);
    }
    io.on('connection', socket => {
      console.log('user connected');
      
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
        //hw1.reportPost(report.body, pk, report.target.index);
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

    socket.on('set-username', username => {
        hw1.setUsername(username);
    })
  })

    console.log('Success');
    while(true) {
      // TODO this is kind of messy but idk how to do it
      // aside from polling like this
      
      accountsBundle = await getAllPosts();
      io.emit('send-posts', accountsBundle);
      await sleep(2500);
    }
  }
  
  main().then(function () { /* do nothing */ }, function (err) {
    console.error(err);
    process.exit(-1);
});
