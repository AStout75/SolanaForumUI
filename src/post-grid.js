import {Link} from "react-router-dom";

import PostAbbrev from "./post-abbrev";
import SocketContext from "./socket-context";
import {getRepliesToPost, getLikesForPost, getReportsForPost} from "./data-util/parse";

class PostGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postList: []
        };

        //Update the grid of posts when the server refreshes us
        this.props.socket.on("send-posts", accounts => {
            // ! Later, force the client to process the raw post data
            let parsedPosts = [];
            for(let i = 0; i < accounts.length; i++) {
                for(let j = 0; j < accounts[i].posts.length; j++) {
                    if (accounts[i].posts[j].type != 'P') {
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
                    for (let k = 0; k < newPost.replies.length; k++) {
                        let element = newPost.replies[k];
                        element.likes = getLikesForPost(accounts, element.poster, element.index);
                        element.reports = getReportsForPost(accounts, element.poster, element.index);
                    }
                    console.log(newPost);
                    parsedPosts.push(newPost);
                }
            }
            this.setState({ postList: parsedPosts })
        });

        this.props.socket.emit('request-posts');
    }

    componentWillUnmount() {
        //this.props.socket.off("send-posts");
    }

    render() {
        
        return (
            <div className="post-grid d-flex align-items-center flex-wrap">
                {this.state.postList.map((element, index, arr) => {
                    return (
                        <div className="flex-container" key={index}>
                            <Link to={{
                                pathname: "/post/" + element.poster + "/" + element.index,
                                state: {
                                    selectedPost: element
                                }
                            }}>
                                <PostAbbrev post={element} /></Link>
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