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
    events.setUpSocketEvents(io);
    
    // Establish connection to the cluster
    await hw1.establishConnection();
  
    // Determine who pays for the fees
    await hw1.establishPayer();
  
    // Load the program if not already loaded
    await hw1.loadProgram();
  
    console.log('Success');
  }
  
  main().then(function () { /*return process.exit();*/ }, function (err) {
    console.error(err);
    process.exit(-1);
});
