import SocketContext from "./socket-context";
import {useLocation} from "react-router-dom";
import {getRepliesToPost, getLikesForPost, getReportsForPost} from "./data-util/parse";
import NavBar from "./nav-bar";
import PostIcons from "./post-icons";
import Reply from "./reply";

class PostFull extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thisPost: {},
            loaded: false
        }
        if (!this.props.location.state) { //navigated here from a URL, rather than grid
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
                        for (let k = 0; k < newPost.replies.length; k++) {
                            let element = newPost.replies[k];
                            element.likes = getLikesForPost(accounts, element.poster, element.index);
                            element.reports = getReportsForPost(accounts, element.poster, element.index);
                        }
                        console.log(newPost);
                        this.setState({ thisPost: newPost, loaded: true });
                        }
                    }
                });
                this.props.socket.emit('request-posts');
            }
    }

    componentDidMount() {
        //START HERE. Need to figure out how to give this function access to accounts
        if (this.props.location.state) {

            /*
            console.log("comp did mount, with state", this.props.location);
            for (let k = 0; k < this.props.location.state.selectedPost.replies.length; k++) {
                let element = this.props.location.state.selectedPost.replies[k];
                element.likes = getLikesForPost(accounts, element.poster, element.index);
                element.reports = getReportsForPost(accounts, element.poster, element.index);
            }*/
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
        console.log("render.");
        if (this.state.loaded) {
            return (
                <div>
                    <NavBar />
                    <div className="post-full-container">
                        <div className={"post-full" + (this.state.thisPost.reports >= 2 ? "post-reported" : "")}>
                            <div>
                                <div>
                                    <h2>{this.state.thisPost.likes.toString() + " likes"}</h2>
                                </div>
                                <div>
                                    <p>{this.state.thisPost.body}</p>
                                </div>
                                <PostIcons post={this.state.thisPost} />
                            </div>
                        </div>
                        <div>
                            {this.state.thisPost.replies.map((element, index, arr) => {
                                //element.likes = getLikesForPost(accounts, accounts[i].pubkey, j),
                                //element.reports = getReportsForPost(accounts, accounts[i].pubkey, j)
                                    return (
                                        <Reply key={index} post={element} />
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