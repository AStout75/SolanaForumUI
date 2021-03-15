"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.reportAccounts = exports.reportHellos = exports.sayHello = exports.loadProgram = exports.establishPayer = exports.establishConnection = void 0;
var web3_js_1 = require("@solana/web3.js");
var fs_1 = require("mz/fs");
// @ts-ignore
var buffer_layout_1 = require("buffer-layout");
var lo = buffer_layout_1;
var url_1 = require("./util/url");
var store_1 = require("./util/store");
var new_account_with_lamports_1 = require("./util/new-account-with-lamports");
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
 * The public key of the account we are saying hello to
 */
var greetedPubkey;
var pathToProgram = './dist/helloworld.so';
/**
 * Layout of a single post
 */
var postLayout = buffer_layout_1.struct([
    //BufferLayout.u32('numGreets'),
    buffer_layout_1.u8('type'),
    buffer_layout_1.cstr('body'),
]);
/**
 * Layout of account data
 */
var accountLayout = buffer_layout_1.struct([
    buffer_layout_1.u16('numPosts'),
    buffer_layout_1.seq(postLayout, buffer_layout_1.offset(buffer_layout_1.u16(), -1), 'posts'),
]);
/**
 * Layout of the greeted account data
 */
var greetedAccountDataLayout = buffer_layout_1.struct([
    //BufferLayout.seq(BufferLayout.u8(), 1024, 'account_data'),
    buffer_layout_1.seq(buffer_layout_1.u8(), 1024, 'account_data'),
]);
function printAccountPosts(d) {
    var postCount = d.readUInt16LE(0);
    console.log("# of posts on account:", postCount);
    //const accountData = accountLayout.decode(d);
    //console.log(accountData.posts);
    // For now, just print with a for loop
    var readType = false;
    var currentPost = "";
    var i = 2;
    for (; i < d.length; i++) {
        // Stop after reading 2 terminators in a row
        if (d.readUInt8(i) == 0 && d.readUInt8(i - 1) == 0) {
            return;
        }
        if (!readType) {
            process.stdout.write("Type: " + String.fromCharCode(d.readUInt8(i)));
            readType = true;
        }
        else if (d.readUInt8(i) == 0) {
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
/**
 * Establish a connection to the cluster
 */
function establishConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var version;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = new web3_js_1.Connection(url_1.url, 'singleGossip');
                    return [4 /*yield*/, connection.getVersion()];
                case 1:
                    version = _a.sent();
                    console.log('Connection to cluster established:', url_1.url, version);
                    return [2 /*return*/];
            }
        });
    });
}
exports.establishConnection = establishConnection;
/**
 * Establish an account to pay for everything
 */
function establishPayer() {
    return __awaiter(this, void 0, void 0, function () {
        var fees, feeCalculator, data, NUM_RETRIES, _a, _b, _c, lamports;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!!payerAccount) return [3 /*break*/, 6];
                    fees = 0;
                    return [4 /*yield*/, connection.getRecentBlockhash()];
                case 1:
                    feeCalculator = (_d.sent()).feeCalculator;
                    const fs = require('fs');
                    return [4 /*yield*/, fs.readFileSync(pathToProgram)];
                case 2:
                    data = _d.sent();
                    NUM_RETRIES = 500;
                    _a = fees;
                    _b = feeCalculator.lamportsPerSignature *
                        (web3_js_1.BpfLoader.getMinNumSignatures(data.length) + NUM_RETRIES);
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(data.length)];
                case 3:
                    fees = _a + (_b +
                        (_d.sent()));
                    // Calculate the cost to fund the greeter account
                    _c = fees;
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(greetedAccountDataLayout.span)];
                case 4:
                    // Calculate the cost to fund the greeter account
                    fees = _c + _d.sent();
                    // Calculate the cost of sending the transactions
                    fees += feeCalculator.lamportsPerSignature * 100; // wag
                    return [4 /*yield*/, new_account_with_lamports_1.newAccountWithLamports(connection, fees)];
                case 5:
                    // Fund a new payer via airdrop
                    payerAccount = _d.sent();
                    _d.label = 6;
                case 6: return [4 /*yield*/, connection.getBalance(payerAccount.publicKey)];
                case 7:
                    lamports = _d.sent();
                    console.log('Using account', payerAccount.publicKey.toBase58(), 'containing', lamports / web3_js_1.LAMPORTS_PER_SOL, 'Sol to pay for fees');
                    return [2 /*return*/];
            }
        });
    });
}
exports.establishPayer = establishPayer;
/**
 * Load the hello world BPF program if not already loaded
 */
function loadProgram() {
    return __awaiter(this, void 0, void 0, function () {
        var store, config, err_1, data, programAccount, greetedAccount, space, lamports, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = new store_1.Store();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, store.load('config.json')];
                case 2:
                    config = _a.sent();
                    programId = new web3_js_1.PublicKey(config.programId);
                    greetedPubkey = new web3_js_1.PublicKey(config.greetedPubkey);
                    return [4 /*yield*/, connection.getAccountInfo(programId)];
                case 3:
                    _a.sent();
                    console.log('Program already loaded to account', programId.toBase58());
                    return [2 /*return*/];
                case 4:
                    err_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    // Load the program
                    console.log('Loading hello world program...');
                    const fs = require('fs');
                    return [4 /*yield*/, fs.readFileSync(pathToProgram)];
                case 6:
                    data = _a.sent();
                    programAccount = new web3_js_1.Account();
                    return [4 /*yield*/, web3_js_1.BpfLoader.load(connection, payerAccount, programAccount, data, web3_js_1.BPF_LOADER_PROGRAM_ID)];
                case 7:
                    _a.sent();
                    programId = programAccount.publicKey;
                    console.log('Program loaded to account', programId.toBase58());
                    greetedAccount = new web3_js_1.Account();
                    greetedPubkey = greetedAccount.publicKey;
                    console.log('Creating account', greetedPubkey.toBase58(), 'to say hello to');
                    space = greetedAccountDataLayout.span;
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(greetedAccountDataLayout.span)];
                case 8:
                    lamports = _a.sent();
                    transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
                        fromPubkey: payerAccount.publicKey,
                        newAccountPubkey: greetedPubkey,
                        lamports: lamports,
                        space: space,
                        programId: programId
                    }));
                    return [4 /*yield*/, web3_js_1.sendAndConfirmTransaction(connection, transaction, [payerAccount, greetedAccount], {
                            commitment: 'singleGossip',
                            preflightCommitment: 'singleGossip'
                        })];
                case 9:
                    _a.sent();
                    // Save this info for next time
                    return [4 /*yield*/, store.save('config.json', {
                            url: url_1.urlTls,
                            programId: programId.toBase58(),
                            greetedPubkey: greetedPubkey.toBase58()
                        })];
                case 10:
                    // Save this info for next time
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.loadProgram = loadProgram;
/**
 * Say hello
 */
function sayHello(body) {
    return __awaiter(this, void 0, void 0, function () {
        var post, instruction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Saying hello to', greetedPubkey.toBase58());
                    post = Buffer.from('P' + body + '\0');
                    console.log("Length of post:", post.length);
                    instruction = new web3_js_1.TransactionInstruction({
                        keys: [{ pubkey: greetedPubkey, isSigner: false, isWritable: true }],
                        programId: programId,
                        data: post
                    });
                    return [4 /*yield*/, web3_js_1.sendAndConfirmTransaction(connection, new web3_js_1.Transaction().add(instruction), [payerAccount], {
                            commitment: 'singleGossip',
                            preflightCommitment: 'singleGossip'
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sayHello = sayHello;
/**
 * Report the number of times the greeted account has been said hello to
 */
function reportHellos() {
    return __awaiter(this, void 0, void 0, function () {
        var accountInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getAccountInfo(greetedPubkey)];
                case 1:
                    accountInfo = _a.sent();
                    if (accountInfo === null) {
                        throw 'Error: cannot find the greeted account';
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.reportHellos = reportHellos;
/**
 * Print given accounts' data
 */
function printAccountData(account) {
    return __awaiter(this, void 0, void 0, function () {
        var accountInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getAccountInfo(greetedPubkey)];
                case 1:
                    accountInfo = _a.sent();
                    if (accountInfo === null) {
                        throw 'Error: cannot get data for account ' + account.toBase58();
                    }
                    //const info = accountLayout.decode(Buffer.from(accountInfo.data));
                    //console.log("Account has", accountInfo.data.length, "bytes");
                    printAccountPosts(accountInfo.data);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Report the accounts owned by the program
 */
function reportAccounts() {
    return __awaiter(this, void 0, void 0, function () {
        var accounts, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.getProgramAccounts(programId)];
                case 1:
                    accounts = _a.sent();
                    console.log("Accounts owned by program:");
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < accounts.length)) return [3 /*break*/, 5];
                    console.log(accounts[i].pubkey.toBase58());
                    return [4 /*yield*/, printAccountData(accounts[i].pubkey)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.reportAccounts = reportAccounts;
