/**
 * Hello world
 */

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
    console.log("Response from Solana validator:");
    console.log(accountsString);
    events.setUpSocketEvents(io, accountsString);

    console.log('Success');
  }
  
  main().then(function () { /*return process.exit();*/ }, function (err) {
    console.error(err);
    process.exit(-1);
});
