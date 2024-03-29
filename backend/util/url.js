"use strict";
// To connect to a public cluster, set `export LIVE=1` in your
// environment. By default, `LIVE=1` will connect to the devnet cluster.
exports.__esModule = true;
exports.walletUrl = exports.urlTls = exports.url = exports.cluster = void 0;
var web3_js_1 = require("@solana/web3.js");
require("dotenv").config();
function chooseCluster() {
    if (!process.env.LIVE)
        return;
    switch (process.env.CLUSTER) {
        case 'devnet':
        case 'testnet':
        case 'mainnet-beta': {
            return process.env.CLUSTER;
        }
    }
    if (process.env.CLUSTER) {
        throw "Unknown cluster \"" + process.env.CLUSTER + "\", check the .env file";
    }
    else {
        throw new Error('CLUSTER is not specified, check the .env file');
    }
}
exports.cluster = chooseCluster();
exports.url = process.env.RPC_URL ||
    (process.env.LIVE ? web3_js_1.clusterApiUrl(exports.cluster, false) : 'https://devnet.solana.com');
exports.urlTls = process.env.RPC_URL ||
    (process.env.LIVE ? web3_js_1.clusterApiUrl(exports.cluster, true) : 'https://devnet.solana.com');
exports.walletUrl = process.env.WALLET_URL || 'https://solana-example-webwallet.herokuapp.com/';
