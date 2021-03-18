/**
 * Hello world
 */

//USE THIS PROGRAM ID FOR NOW:
//"programId":"DDC6DdQcLEuP3j2F46jJrE4tW56YDrrDDKApo4qQ4vQc"



//  import {
//     establishConnection,
//     establishPayer,
//     loadProgram,
//     sayHello,
//     reportHellos,
//     reportAccounts,
//     getArrayOfPosts
//   } from './hello_world';

  const hw1 = require('./hello_world');
  /* Web server */
  const server = require("./server-setup");
  const events = require("./socket-events");
const { sleep } = require('./util/sleep');
  
  function getAllPosts() {
    return hw1.reportAccounts();
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

    let accountsString = await hw1.reportAccounts();
    console.log(accountsString);
    console.log("Response from Solana validator:");
    console.log(accountsString);
    io.on('connection', socket => {
      console.log('user connected');
      
      socket.on('request-posts', () => {
          console.log(accountsString);
          socket.emit('send-posts', accountsString);
      });

      socket.on('new-post', body => {
          hw1.sayHello(body, "post");
      });
  })

    console.log('Success');
    while(true) {
      // TODO this is kind of messy but idk how to do it
      // aside from polling like this
      await sleep(500);
      accountsString = await getAllPosts();
    }
  }
  
  main().then(function () { /* do nothing */ }, function (err) {
    console.error(err);
    process.exit(-1);
});
