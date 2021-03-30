import SocketContext from "./socket-context";
import {useLocation} from "react-router-dom";
import {getRepliesToPost, getLikesForPost, getReportsForPost} from "./data-util/parse";
import NavBar from "./nav-bar";

class PostFull extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thisPost: {},
            loaded: false
        }

        if (!this.props.location.state) { //navigated here from the grid, rather than direct URL
            console.log("AAAAAAAAAAAH no location found");
        
        //Update the grid of posts when the server refreshes us
        this.props.socket.on("send-posts", accounts => {
            // ! Later, force the client to process the raw post data
            let selectedPubkey = this.props.match.params.pubkey;
            let selectedIndex = this.props.match.params.id
            //let parsedPosts = [];
            for(let i = 0; i < accounts.length; i++) {
                for(let j = 0; j < accounts[i].posts.length; j++) {
                    if (accounts[i].posts[j].type != 'P' || accounts[i].pubkey != selectedPubkey || j != selectedIndex) {
                        continue;
                    }
                    console.log(accounts[i].posts[j].target);
                    var newPost = {
                        poster: accounts[i].pubkey, 
                        body: accounts[i].posts[j].body, 
                        index: j, type: accounts[i].posts[j].type, 
                        target: accounts[i].posts[j].target,
                        replies: getRepliesToPost(accounts, accounts[i].pubkey, j),
                        likes: getLikesForPost(accounts, accounts[i].pubkey, j),
                        reports: getReportsForPost(accounts, accounts[i].pubkey, j)
                    };
                    //console.log(newPost);
                    //parsedPosts.push(newPost);
                    this.setState({ thisPost: newPost, loaded: true });
                    }
                }
    
    
            });

            this.props.socket.emit('request-posts');
        }
        
    }

    componentDidMount() {
        if (this.props.location.state) {
            console.log(this.props.location);
            this.setState({
                thisPost: this.props.location.state.selectedPost,
                loaded: true
            })
        }
        
    }

    componentWillUnmount() {
        //this.props.socket.off("send-posts");
    }

    render() {
        if (this.state.loaded) {
            return (
                <div><NavBar />
                <div className={"post-abbrev " + (this.state.thisPost.reports >= 2 ? "post-reported" : "")}>
                    <div>
                        <div>
                            <h2>{this.state.thisPost.likes.toString() + " likes"}</h2>
                        </div>
                        <div>
                            <p>{this.state.thisPost.body}</p>
                        </div>
                        <div className="post-icons rounded d-flex align-items-center justify-content-end">
                            <div onClick={() => {
                                let reply = { target: {} };
                                reply.target.pubkey = this.state.thisPost.poster;
                                reply.target.index = this.state.thisPost.index;
                                reply.body = "";
                                this.props.socket.emit('like-post', reply);
                            }}
                                className="icon rounded-circle d-flex align-items-center justify-content-center">
                                <i className="fas fa-heart fa-sm"></i>
                            </div>
                            <div onClick={() => {
                                let reply = { target: {} };
                                reply.target.pubkey = this.state.thisPost.poster;
                                reply.target.index = this.state.thisPost.index;
                                reply.body = prompt("Enter reply text:");
                                this.props.socket.emit('reply-post', reply);
                            }}
                                className="icon rounded-circle d-flex align-items-center justify-content-center">
                                <i className="fas fa-pencil-alt fa-sm"></i>
                            </div>
                            <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                            <a href={'https://explorer.solana.com/address/' + this.state.thisPost.poster + '?cluster=devnet'} target="_blank" ><i className="fas fa-info fa-sm"></i></a>
                            </div>
                            <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                                <i className="fas fa-eye-slash fa-sm"></i>
                            </div>
                            <div onClick={() => {
                                let reply = { target: {} };
                                reply.target.pubkey = this.state.thisPost.poster;
                                reply.target.index = this.state.thisPost.index;
                                reply.body = prompt("Enter report reason");
                                this.props.socket.emit('report-post', reply);
                            }}
                                className="icon rounded-circle d-flex align-items-center justify-content-center">
                                <i className="fas fa-flag fa-sm"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        {this.state.thisPost.replies.map((element, index, arr) => {
                                return (
                                    <div key={index}>{element.body}<br/></div>
                                )
                            })
                        }
                    </div>
                    
                </div>
                </div>
                )
        }
        else {
            return <div>Loading...</div>
        }
        
        }
    
}



const PostFullWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostFull {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostFullWithSocket as default}