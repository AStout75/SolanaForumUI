
//import { parse } from "../node_modules/dotenv/types/index";
import PostAbbrev from "./post-abbrev";
import SocketContext from "./socket-context";

class PostGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postList: []
        }

        //Update the grid of posts when the server refreshes us
        this.props.socket.on("send-posts", accounts => {
            // ! Later, force the client to process the raw post data
            let parsedPosts = [];
            console.log(accounts);
            for(let i = 0; i < accounts.length; i++) {
                for(let j = 0; j < accounts[i].posts.length; j++) {
                    console.log(accounts[i].posts[j].target);
                    var newPost = {
                        poster: accounts[i].pubkey, 
                        body: accounts[i].posts[j].body, 
                        index: j, type: accounts[i].posts[j].type, 
                        target: accounts[i].posts[j].target,
                        replies: this.getRepliesToPost(accounts, accounts[i].pubkey, j)
                    };
                    console.log(newPost);
                    parsedPosts.push(newPost);
                }
            }
            this.setState({ postList: parsedPosts })
        });

        this.props.socket.emit('request-posts');
    }

    /* Input the account data, output a list of "posts" (replies) to the specified
    post, identified by input params pubkey and index */

    getRepliesToPost(accounts, pubkey, index) {
        console.log("Looking for replies to", pubkey, ":", index);
        var res = [];
        for(let i = 0; i < accounts.length; i++) {
            for(let j = 0; j < accounts[i].posts.length; j++) {
                if (accounts[i].posts[j].type == 'R') {
                    //console.log("here");
                    //target acquired.
                    console.log("\t", accounts[i].posts[j].target.pubkey, ":", accounts[i].posts[j].target.index);
                    if (accounts[i].posts[j].target.index == index && accounts[i].posts[j].target.pubkey == pubkey) {
                        //Match
                        console.log("Found reply:", accounts[i].posts[j].body);
                        res.push({
                            poster: accounts[i].pubkey, 
                            body: accounts[i].posts[j].body, 
                            index: j, type: accounts[i].posts[j].type, 
                            target: accounts[i].posts[j].target,
                        });
                    }
                }
            }
        }
        return res;
    }

    render() {
        
        return (
        <div className="post-grid d-flex align-items-center flex-wrap">
            {this.state.postList.map((element, index, arr) => {
                return (
                    <div className="flex-container" key={index}>
                        <PostAbbrev post={element} />
                    </div>
                );
            })}
        </div>
        )
    }
}

const PostGridWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostGrid {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostGridWithSocket as default}