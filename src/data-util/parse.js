
/* Input the account data, output a list of "posts" (replies) to the specified
    post, identified by input params pubkey and index */

export function getRepliesToPost(accounts, pubkey, index) {
    //console.log("Looking for replies to", pubkey, ":", index);
    var res = [];
    for(let i = 0; i < accounts.length; i++) {
        for(let j = 0; j < accounts[i].data.posts.length; j++) {
            if (accounts[i].data.posts[j].type == 'R') {
                //console.log("here");
                //target acquired.
                //console.log("\t", accounts[i].posts[j].target.pubkey, ":", accounts[i].posts[j].target.index);
                if (accounts[i].data.posts[j].target.index == index && accounts[i].data.posts[j].target.pubkey == pubkey) {
                    //Match
                    //console.log("Found reply:", accounts[i].posts[j].body);
                    res.push({
                        poster: accounts[i].pubkey, 
                        body: accounts[i].data.posts[j].body, 
                        index: j, type: accounts[i].data.posts[j].type, 
                        target: accounts[i].data.posts[j].target,
                    });
                }
            }
        }
    }
    return res;
}

export function getLikesForPost(accounts, pubkey, index) {
    var res = 0;
    for(let i = 0; i < accounts.length; i++) {
        for(let j = 0; j < accounts[i].data.posts.length; j++) {
            if (accounts[i].data.posts[j].type == 'L') {
                //console.log("here");
                //target acquired.
                //console.log("\t", accounts[i].posts[j].target.pubkey, ":", accounts[i].posts[j].target.index);
                if (accounts[i].data.posts[j].target.index == index && accounts[i].data.posts[j].target.pubkey == pubkey) {
                    //Match
                    //console.log("Found reply:", accounts[i].posts[j].body);
                    res++;
                }
            }
        }
    }
    return res;
}

export function getReportsForPost(accounts, pubkey, index) {
    var res = 0;
    for(let i = 0; i < accounts.length; i++) {
        for(let j = 0; j < accounts[i].data.posts.length; j++) {
            if (accounts[i].data.posts[j].type == 'X') {
                //console.log("here");
                //target acquired.
                //console.log("\t", accounts[i].posts[j].target.pubkey, ":", accounts[i].posts[j].target.index);
                if (accounts[i].data.posts[j].target.index == index && accounts[i].data.posts[j].target.pubkey == pubkey) {
                    //Match
                    //console.log("Found reply:", accounts[i].posts[j].body);
                    res++;
                }
            }
        }
    }
    //console.log("reports is ", res);
    return res;
}

/*
[
    {
        reputationRequirement: 7,
        signatures: 6,
        index: 0,
        target: PubKey...

        (max # of signatures)
        (reason?)
        (category?)
        (natural ordering?)

    }
]

*/

export function getPetitionsForPost(accounts, pubkey, index) {
    var res = [];
    for(let i = 0; i < accounts.length; i++) {
        if (accounts[i].data.type == 'petition') {
            if (accounts[i].data.offendingPost.index == index && accounts[i].data.offendingPost.offender == pubkey) {
                console.log(accounts[i].data.signatures);
                res.push({
                    pubkey: accounts[i].pubkey,
                    reputationRequirement: accounts[i].data.reputationRequirement,
                    numSignatures: accounts[i].data.numSignatures,
                    signatureCapacity: accounts[i].data.signatureCapacity,
                    signatures: accounts[i].data.signatures,
                    offendingPubkey: accounts[i].data.offendingPost.offender,
                })
            }
        }

        /* unneeded (?)
        for(let j = 0; j < accounts[i].data.posts.length; j++) {
            if (accounts[i].data.posts[j].type == 'C') {
                if (accounts[i].data.posts[j].target.index == index && accounts[i].data.posts[j].target.pubkey == pubkey) {
                    //Match
                    res.push({
                        poster: accounts[i].pubkey, 
                        body: accounts[i].data.posts[j].body, 
                        index: j, type: accounts[i].data.posts[j].type, 
                        target: accounts[i].data.posts[j].target,
                    });
                }
            }
        } */
    }
    return res;
}