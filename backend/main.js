/**
 * Hello world
 */

// import {
//     establishConnection,
//     establishPayer,
//     loadProgram,
//     sayHello,
//     reportHellos,
//     reportAccounts,
//   } from './Solana/hello_world.js'; 

  var hw1 = require("./hello_world");
  

  require('./hello_world.js');

  async function main() {
    console.log("--------------------Solana forum demo--------------------");
    const readlineSync = require('readline-sync');
    let options = ["View posts", "New post"];
    let response = readlineSync.keyInSelect(options, "Choose one (New post assumes you have a valid store)")
    
    // Establish connection to the cluster
    await hw1.establishConnection();
  
    // Determine who pays for the fees
    await hw1.establishPayer();
  
    // Load the program if not already loaded
    await hw1.loadProgram();
  
    // Get accounts owned by the program
    await hw1.reportAccounts(); 
  
    
  
    switch(response) {
      case 0:
        // Get accounts owned by the program
        await hw1.reportAccounts();
        break;
      case 1:
        // Enter post text
        let postBody = readlineSync.question('Enter your post: ', { hideEchoBack: false });
  
        // Say hello to an account
        await hw1.sayHello(postBody);
  
        // Find out how many times that account has been greeted
        await hww1.reportHellos();
  
        // Get accounts owned by the program
        await hw1.reportAccounts();
        break;
      default:
        break;
    } 
    //console.log('Success');
  }

  
  
  main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  ); 

const server = require('./server-setup');

server.setUpServer();