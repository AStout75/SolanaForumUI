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
        hw1.reportPost(report.body, pk, report.target.index);
        console.log("body:", report.body);
        console.log("pubkey:", pk.toBuffer().toString("hex"));
        console.log("index:", report.target.index);
    });
  })

    console.log('Success');
    while(true) {
      // TODO this is kind of messy but idk how to do it
      // aside from polling like this
      await sleep(500);
      accountsBundle = await getAllPosts();
    }
  }
  
  main().then(function () { /* do nothing */ }, function (err) {
    console.error(err);
    process.exit(-1);
});
