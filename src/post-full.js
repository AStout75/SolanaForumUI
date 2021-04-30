import SocketContext from "./socket-context";
import {getRepliesToPost, getLikesForPost, getReportsForPost, getPetitionsForPost} from "./data-util/parse";
import NavBar from "./nav-bar";
import Footer from "./footer";
import PostTabs from "./post-tabs";
import PostContent from "./post-content";
import PostPetition from "./post-petition";


class PostFull extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thisPost: {},
            loaded: false
        }

        this.state = {
            tab: "post"
        };
        

        //if (!this.props.location.state) { //navigated here from a URL, rather than grid
            //Update the grid of posts when the server refreshes us
            this.props.socket.on("send-posts", accounts => {
                // ! Later, force the client to process the raw post data
                let selectedPubkey = this.props.match.params.pubkey;
                let selectedIndex = this.props.match.params.id
                for(let i = 0; i < accounts.length; i++) {
                    for(let j = 0; j < accounts[i].data.posts.length; j++) {
                        if (accounts[i].data.posts[j].type != 'P' || accounts[i].pubkey != selectedPubkey || j != selectedIndex) {
                            continue;
                        }
                        var newPost = {
                            poster: accounts[i].pubkey, 
                            body: accounts[i].data.posts[j].body, 
                            index: j, type: accounts[i].data.posts[j].type, 
                            target: accounts[i].data.posts[j].target,
                            replies: getRepliesToPost(accounts, accounts[i].pubkey, j),
                            likes: getLikesForPost(accounts, accounts[i].pubkey, j),
                            reports: getReportsForPost(accounts, accounts[i].pubkey, j),
                            petitions: getPetitionsForPost(accounts, accounts[i].pubkey, j)
                        };
                        //console.log(newPost);
                        //parsedPosts.push(newPost);
                        for (let k = 0; k < newPost.replies.length; k++) {
                            let element = newPost.replies[k];
                            element.likes = getLikesForPost(accounts, element.poster, element.index);
                            element.reports = getReportsForPost(accounts, element.poster, element.index);
                        }
                        this.setState({ thisPost: newPost, loaded: true });
                        }
                    }
                });
                this.props.socket.emit('request-posts');
            }
        //}

    selectTab(state) {
        this.setState({
            tab: state
        })
    }

    componentDidMount() {
        if (this.props.location.state) {
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
            if (this.state.tab == "post") {
                this.content = <PostContent post={this.state.thisPost} full={true} />
            }
            else if (this.state.tab.substring(0, "petition".length) == "petition") {
                console.log("petition".length);
                var idx = this.state.tab.substring("petition".length, this.state.tab.length);
                console.log("petitions is", this.state.thisPost.petitions, "and we want the index", idx);
                this.content = <PostPetition petition={this.state.thisPost.petitions[parseInt(idx) - 1]} index={idx} />
            }
            return (
                <div>
                    <NavBar />
                    <div className="post-full-container container">
                        <PostTabs select={this.selectTab.bind(this)} selectedTab={this.state.tab} petitions={this.state.thisPost.petitions} />
                        {this.content}
                    </div>
                    <Footer />
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