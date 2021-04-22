/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */

  const web3 = require('@solana/web3.js');
  const fs = require('mz/fs');
  
  // @ts-ignore
//   import buffer_layout_1 from 'buffer-layout';
    const buffer_layout_1 = require("buffer-layout");
    var lo = buffer_layout_1;
  
  const url1 = require('./util/url');
  const store1 = require('./util/store');
  const newAccountWithLamp = require('./util/new-account-with-lamports');
  const BaseConverter = require('base-x');
const { sleep } = require('./util/sleep');
//const { relative } = require('path');
//const { create } = require('node:domain');
  const bs58 = BaseConverter("base-58");
  /**
   * Connection to the network
   */
  var connection;
  
  /**
   * Connection to the network
   */
  var payerAccount;
  
  /**
   * Hello world's program id
   */
  var programId;
  
  /**
   * Greeted account
   */
  var greetedAccount;
  
  const pathToProgram = 'backend/dist/program/helloworld.so';
  
  /**
   * Layout of a single post
   */
  const postLayout = buffer_layout_1.struct([
    //buffer_layout_1.u32('numGreets'),
    buffer_layout_1.u8('type'),
    buffer_layout_1.cstr('body'),
  ]);
  
  /**
   * Layout of account data
   */
  const accountLayout = buffer_layout_1.struct([
    buffer_layout_1.u16('numPosts'),
    buffer_layout_1.seq(postLayout, buffer_layout_1.offset(buffer_layout_1.u16(), -1), 'posts'),
  ]);
  
  /**
   * Layout of the greeted account data
   */
  const greetedAccountDataLayout = buffer_layout_1.struct([
    //buffer_layout_1.seq(buffer_layout_1.u8(), 1024, 'account_data'),
    buffer_layout_1.seq(buffer_layout_1.u8(), 1024, 'account_data'),
  ]);
  
  exports.__esModule = true;
  exports.getArrayOfPosts = exports.reportAccounts = exports.reportHellos = exports.sayHello = exports.loadProgram = exports.establishPayer = exports.establishConnection = exports.arrayOfPosts = void 0;

  function printAccountPosts(d) {
    const postCount = d.readUInt16LE(0);
    console.log("# of posts on account:", postCount);
    //const accountData = accountLayout.decode(d);
    //console.log(accountData.posts);
    // For now, just print with a for loop
    let readType = false;
    let currentPost = "";
    let i = 2;
    for(; i < d.length; i++) {
      // Stop after reading 2 terminators in a row
      if(d.readUInt8(i) == 0 && d.readUInt8(i - 1) == 0) {
        return;
      }
      if(!readType) {
        process.stdout.write("Type: " + String.fromCharCode(d.readUInt8(i)));
        readType = true;
      }
      else if(d.readUInt8(i) == 0) {
        console.log("\tBody:", currentPost);
        currentPost = "";
        readType = false;
      }
      else {
        currentPost += String.fromCharCode(d.readUInt8(i));
      }
    }
    console.log("Account has used", i, "out of", d.length, "available bytes");
  }
  
  function readPubkey(d, index) {
    let returned = Buffer.alloc(32);
    for(let i = 0; i < 32; i++) {
      returned[i] = d.readUInt8(i + index);
    }
    return new web3.PublicKey(returned);
  }

  function readPostBody(d, index, length) {
    let returned = "";
    for(let i = 0; i < length; i++) {
      returned += String.fromCharCode(d.readUInt8(i + index));
    }
    console.log("Post body:", returned);
    return returned;
  }

  // Parses account data buffer into an array of post objects
  // Each object at least has a type field and a blank body
  function arrayOfPosts(d) {
    // Check if this accout is a petition account
    console.log("Parsing account data:");
    console.log(d.toString("hex"));
    let result = { type: "uninitialized", posts: [], signatures: [],
                   offendingPost: 0, reputationRequirement: 0, numSignatures: 0 };
    if(d.readUInt8(0) == 2) {
      result.type = "petition";
      let i = 46;
      result.numSignatures = d.readUInt16LE(44);
      result.reputationRequirement = d.readBigUInt64LE(40);
      result.offendingPost = { offender: readPubkey(d, 1), index: d.readUInt16LE(33) };
      for(let currSignature = 0; currSignature < result.numSignatures; currSignature++) {
        signatures.push({ signer: readPubkey(d, i), vote: (d.readUInt8(i + 32) != 0) });
        i += 33;
      }
    }
    else if(d.readUInt8(0) == 1) {
      result.type = "user";
      //console.log(d.toString("hex"));
      let i = 48;
      const postCount = d.readUInt16LE(2);
      console.log("There are", postCount, "posts in this account.");
      // String.fromCharCode(uint8)
      for(let post = 0; post < postCount; post++) {
        let currentPost = { type: "", body: "", target: "" };
        let currentLength = d.readUInt16LE(i);
        if(currentLength == 0)
          throw "Invalid account data";
        // Skip length
        i += 2;
        currentPost.type = String.fromCharCode(d.readUInt8(i));
        // Skip type
        i += 1;
        switch(currentPost.type) {
        case "P":
          // Read body
          currentPost.body = readPostBody(d, i, currentLength - 1);
          break;
        case "R":
        case "X":
          // Read ID
          currentPost.target = { pubkey: readPubkey(d, i).toBase58(), index: 0 };
          currentPost.target.index = d.readUInt16LE(i + 32);
          currentPost.body = readPostBody(d, i + 34, currentLength - 35);
          break;
        case "L":
          // Read ID
          currentPost.target = { pubkey: readPubkey(d, i).toBase58(), index: 0 };
          currentPost.target.index = d.readUInt16LE(i + 32);
          break;
        default:
          console.log("Type: ", currentPost.type, "and  the rest", d.toString("hex"));
          throw "Could not parse post";
        }
        i += currentLength - 1;
        result.posts.push(currentPost);
      }
      // console.log("Account has used", i, "out of", d.length, "available bytes");
    }
    else if (d.readUInt8(0) == 0) {
      // uninitialized account
    }
    else {
      throw "INVALID ACCOUNT DATA";
    }
    return result;
  }
  
  /**
   * Establish a connection to the cluster
   */
 async function establishConnection() {
    connection = new web3.Connection('https://devnet.solana.com', 'singleGossip');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', url1.url, version);
  }
  
  /**
   * Establish an account to pay for everything
   */
   async function establishPayer() {
    if (!payerAccount) {
      let fees = 0;
      const {feeCalculator} = await connection.getRecentBlockhash();
  
      // Calculate the cost to load the program
      const data = await fs.readFile(pathToProgram);
      const NUM_RETRIES = 500; // allow some number of retries
      fees +=
        feeCalculator.lamportsPerSignature *
          (web3.BpfLoader.getMinNumSignatures(data.length) + NUM_RETRIES) +
        (await connection.getMinimumBalanceForRentExemption(data.length));
  
      // Calculate the cost to fund the greeter account
      fees += await connection.getMinimumBalanceForRentExemption(
        greetedAccountDataLayout.span,
      );
  
      // Calculate the cost of sending the transactions
      fees += feeCalculator.lamportsPerSignature * 100; // wag
  
      // Fund a new payer via airdrop
      payerAccount = await newAccountWithLamp.newAccountWithLamports(connection, fees);
    }
  
    const lamports = await connection.getBalance(payerAccount.publicKey);
    console.log(
      'Using account',
      payerAccount.publicKey.toBase58(),
      'containing',
      lamports / web3.LAMPORTS_PER_SOL,
      'Sol to pay for fees',
    );
  }
  
  /**
   * Load the hello world BPF program if not already loaded
   */
   async function loadProgram() {
    const store = new store1.Store();
  
    // Check if the program has already been loaded
    var config;
    try {
      config = await store.load('config.json');
      programId = new web3.PublicKey(config.programId);
      await connection.getAccountInfo(programId);
      console.log('Program already loaded to account', programId.toBase58());
    } catch (err) {
      // try to load the program
      // Load the program
      console.log('Loading hello world program...');
      const data = await fs.readFile(pathToProgram);
      const programAccount = new web3.Account();
      await web3.BpfLoader.load(
        connection,
        payerAccount,
        programAccount,
        data,
        web3.BPF_LOADER_PROGRAM_ID,
      );
      programId = programAccount.publicKey;
      console.log('Program loaded to account', programId.toBase58());
    }
  
    if(config && config.secretKey) {
      console.log("Using existing account with secret key", config.secretKey);
      greetedAccount = new web3.Account(Buffer.from(config.secretKey, 'base64'));
    } else {
      console.log("Creating new account");
      greetedAccount = new web3.Account();
      // Create the greeted account
      console.log('Creating account', greetedAccount.publicKey.toBase58(), 'to say hello to');
      //petitionAccount
      const space = greetedAccountDataLayout.span;
      const lamports = await connection.getMinimumBalanceForRentExemption(
        greetedAccountDataLayout.span,
      );
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
          fromPubkey: payerAccount.publicKey,
          newAccountPubkey: greetedAccount.publicKey,
          lamports: lamports,
          space: space,
          programId: programId,
        }),
      );
      await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payerAccount, greetedAccount],
        {
          commitment: 'singleGossip',
          preflightCommitment: 'singleGossip',
        },
      );
    }
    let t = Buffer.from(greetedAccount.secretKey);
    // Save this info for next time
    await store.save('config.json', {
      url: url1.urlTls,
      programId: programId.toBase58(),
      publicKey: greetedAccount.publicKey.toBase58(),
      secretKey: t.toString('base64'),
    });
  }
  
  /**
   * Say hello
   */
   async function sayHello(body) {
    console.log('Posting on account', greetedAccount.publicKey.toBase58());
  
    /*
    rl.on("close", function() {
        console.log("\nBYE BYE !!!");
        process.exit(0);
    });
    */
    //const post = Buffer.from('Ptest\0');
    let post = Buffer.from('P' + body);
    console.log("Length of post:", post.length);
    const instruction = new web3.TransactionInstruction({
      keys: [{pubkey: greetedAccount.publicKey, isSigner: true, isWritable: true}],
      programId,
      data: post,
    });
    await web3.sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(instruction),
      [payerAccount, greetedAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
      },
    );
  }

  async function replyToPost(body, targetPubkey, targetIndex) {
    let post = Buffer.alloc(1 + 32 + 2 + body.length);
    console.log("Buffer is:", post.toString("hex"));
    post.writeUInt8(82, 0);
    console.log("Buffer is:", post.toString("hex"));
    for(let i = 0; i < 32; i++) {
      post.writeUInt8(targetPubkey.toBuffer()[i], i + 1);
    }
    post.writeUInt16LE(parseInt(targetIndex), 33);
    for(let i = 0; i < body.length; i++) {
      post.writeUInt8(body.charCodeAt(i), 35 + i);
    }
    console.log("Length of post:", post.length);
    console.log("Sent reply with buffer:", post.toString("hex"));
    const instruction = new web3.TransactionInstruction({
      keys: [{pubkey: greetedAccount.publicKey, isSigner: true, isWritable: true}],
      programId,
      data: post,
    });
    await web3.sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(instruction),
      [payerAccount, greetedAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
      },
    );
  }

  /* createPetitionForPost
  Create a new account to store the data
  Bundle the transaction data
  */
  
  async function createPetitionForPost(targetPubkey, targetIndex) {
    const petitionAccount = new web3.Account();
    const accountSize = 100;

    console.log("Creating new account");
      //petitionAccount = new web3.Account();
      // Create the greeted account
      console.log('Creating PETITION ACCOUNT', petitionAccount.publicKey.toBase58(), ', is empty');

      //const space = greetedAccountDataLayout.span;
      const lamports = await connection.getMinimumBalanceForRentExemption(
        accountSize,
      );
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
          fromPubkey: payerAccount.publicKey,
          newAccountPubkey: petitionAccount.publicKey,
          lamports: lamports,
          space: accountSize,
          programId: programId,
        }),
      );
      await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [payerAccount, petitionAccount],
        {
          commitment: 'singleGossip',
          preflightCommitment: 'singleGossip',
        },
      );

    let meta = Buffer.alloc(1 + 2);
    meta.writeUInt8("C".charCodeAt(0), 0);
    meta.writeUInt16LE(parseInt(targetIndex), 1);

    console.log("Length of petition:", meta.length);
    console.log("Sent PETITION create with buffer:", meta.toString("hex"));
    
    const instruction = new web3.TransactionInstruction({
      keys: [
        {pubkey: petitionAccount.publicKey, isSigner: true, isWritable: true},
        {pubkey: targetPubkey, isSigner: false, isWritable: true}],
      programId,
      data: meta,
    });
    await web3.sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(instruction),
      [payerAccount, petitionAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
      },
    );
  }

  /*

  */

  async function voteOnPetition(petitionPubkey, voterPubkey) {
    let meta = Buffer.alloc(1 + 2);
    meta.writeUInt8("V".charCodeAt(0), 0);
    meta.writeUInt16LE(parseInt(targetIndex), 1);

    console.log("Length of petition:", meta.length);
    console.log("Sent PETITION create with buffer:", meta.toString("hex"));
    const instruction = new web3.TransactionInstruction({
      keys: [
        {pubkey: voterPubkey, isSigner: true, isWritable: true},
        {pubkey: petitionPubkey, isSigner: false, isWritable: false}],
      programId,
      data: meta,
    });
    await web3.sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(instruction),
      [payerAccount, petitionAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
      },
    );
  }

  async function reportPost(body, targetPubkey, targetIndex) {
    let post = Buffer.alloc(1 + 32 + 2 + body.length);
    post.writeUInt8("X".charCodeAt(0), 0);
    for(let i = 0; i < 32; i++) {
      post.writeUInt8(targetPubkey.toBuffer()[i], i + 1);
    }
    post.writeUInt16LE(parseInt(targetIndex), 33);
    for(let i = 0; i < body.length; i++) {
      post.writeUInt8(body.charCodeAt(i), 35 + i);
    }
    console.log("Length of post:", post.length);
    console.log("Sent reply with buffer:", post.toString("hex"));
    const instruction = new web3.TransactionInstruction({
      keys: [{pubkey: greetedAccount.publicKey, isSigner: true, isWritable: true}],
      programId,
      data: post,
    });
    await web3.sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(instruction),
      [payerAccount, greetedAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
      },
    );
    console.log("Reported post with buffer:", post.toString("hex"));
  }

  async function likePost(targetPubkey, targetIndex) {
    let post = Buffer.alloc(1 + 32 + 2);
    post.writeUInt8("L".charCodeAt(0), 0);
    for(let i = 0; i < 32; i++) {
      post.writeUInt8(targetPubkey.toBuffer()[i], i + 1);
    }
    post.writeUInt16LE(parseInt(targetIndex), 33);
    
    console.log("Length of post:", post.length);
    console.log("Sent like with buffer:", post.toString("hex"));
    const instruction = new web3.TransactionInstruction({
      keys: [{pubkey: greetedAccount.publicKey, isSigner: true, isWritable: true}],
      programId,
      data: post,
    });
    await web3.sendAndConfirmTransaction(
      connection,
      new web3.Transaction().add(instruction),
      [payerAccount, greetedAccount],
      {
        commitment: 'singleGossip',
        preflightCommitment: 'singleGossip',
      },
    );
    console.log("Liked post with buffer:", post.toString("hex"));
  }
  
  /**
   * Report the number of times the greeted account has been said hello to
   */
   async function reportHellos() {
    const accountInfo = await connection.getAccountInfo(greetedAccount.publicKey);
    if (accountInfo === null) {
      throw 'Error: cannot find the greeted account';
    }
    //const info = greetedAccountDataLayout.decode(Buffer.from(accountInfo.data));
    /*
    console.log(
      greetedAccount.publicKey.toBase58(),
      'has been greeted',
      info.numGreets.toString(),
      'times',
    );
    */
   //console.log(greetedAccount.publicKey.toBase58(), ":");
   //console.log("Account data:", info.account_data.toString());
  }
  
  /**
   * Print given accounts' data
   */
  async function printAccountData(account) {
    const accountInfo = await connection.getAccountInfo(greetedAccount.publicKey);
    if (accountInfo === null) {
      throw 'Error: cannot get data for account ' + account.toBase58();
    }
    //const info = accountLayout.decode(Buffer.from(accountInfo.data));
    //console.log("Account has", accountInfo.data.length, "bytes");
    printAccountPosts(accountInfo.data);
  }
  
  /**
   * Report the accounts owned by the program
   * 
   * Format: 
   * PUBKEY
   *       POST1
   *       POST2
   *       POST3
   * PUBKEY
   */
   async function reportAccounts() {
    const accounts = await connection.getProgramAccounts(programId);
    // console.log("Accounts owned by program:");
    let retStr = [];
    for(let i = 0; i < accounts.length; i++) {
      // console.log(accounts[i].pubkey.toBase58());
      retStr.push(accounts[i].pubkey.toBase58());
      let posts = await getArrayOfPosts(accounts[i].pubkey);
      // console.log(posts);
      for(let j = 0; j < posts.length; j++) {
        retStr.push(posts[j]);
      }
      /*
      if(posts.length == 0) {
        retStr += "\n";
        continue;
      }
      retStr += "\n\t";
      let j = 0;
      for (; j < posts.length; j++) {
        retStr += posts[j];
        if(j == posts.length - 1) {
          retStr += "\n";
          continue;
        }
        retStr += "\n\t"
      }
      */
    }
    return retStr;
  }

  // Return an array of objects, where each element represents the complete data for 1 account
  // Each object in the array contains:
  //  publicKey: The account's public key
  //  posts: An array of all posts on the account
  //    The format of each post object depends on the type, but all will have a type field
  async function bundleAllPosts() {
    let returnedArray = [];
    const accounts = await connection.getProgramAccounts(programId);
    for(let i = 0; i < accounts.length; i++) {
      console.log("Getting posts for", accounts[i].pubkey.toBase58());
      returnedArray.push({ pubkey: accounts[i].pubkey.toBase58(), data: await getArrayOfPosts(accounts[i].pubkey)});
    }
    return returnedArray;
  }
  
   async function getArrayOfPosts(pk) {
    const accountInfo = await connection.getAccountInfo(pk);
    if (accountInfo === null) {
      throw 'Error: cannot get data for account ';
    }
    console.log(accountInfo.executable, accountInfo.lamports, accountInfo.owner.toBase58());
    if(accountInfo.data) {
      console.log("Data in this account!");
    }
    return arrayOfPosts(accountInfo.data);
  }

  exports.arrayOfPosts = arrayOfPosts;
  exports.establishConnection = establishConnection;
  exports.establishPayer = establishPayer;
  exports.loadProgram = loadProgram;
  exports.reportAccounts = reportAccounts;
  exports.sayHello = sayHello;
  exports.reportHellos = reportHellos;
  exports.bundleAllPosts = bundleAllPosts;
  exports.replyToPost = replyToPost;
  exports.createPetitionForPost = createPetitionForPost;
  exports.reportPost = reportPost;
  exports.likePost = likePost;