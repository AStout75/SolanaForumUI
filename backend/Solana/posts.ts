/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
    Account,
    Connection,
    BpfLoader,
    BPF_LOADER_PROGRAM_ID,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
  } from '@solana/web3.js';

  // @ts-ignore
import BufferLayout from 'buffer-layout';
const lo = BufferLayout;

import {Store} from '../util/store';

/**
 * The public key of the account we are saying hello to
 */
let greetedPubkey: PublicKey;

/**
 * Connection to the network
 */
let connection: Connection;

/**
 * Establish a connection to the cluster
 */
export async function establishConnection(): Promise<void> {
    connection = new Connection(url, 'singleGossip');
    const version = await connection.getVersion();
    console.log('Connection to cluster established:', url, version);
  }

export async function printAccountData(account: PublicKey): Promise<void> {
    const accountInfo = await connection.getAccountInfo(greetedPubkey);
    if (accountInfo === null) {
      throw 'Error: cannot get data for account ' + account.toBase58();
    }
    //const info = accountLayout.decode(Buffer.from(accountInfo.data));
    //console.log("Account has", accountInfo.data.length, "bytes");
    printAccountPosts(accountInfo.data);
  }

function printAccountPosts(d: Buffer) {
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