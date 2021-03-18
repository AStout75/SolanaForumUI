
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
            for(let i = 0; i < accounts.length; i++) {
                for(let j = 0; j < accounts[i].posts.length; j++) {
                    parsedPosts.push({ poster: accounts[i].pubkey, 
                                       body: accounts[i].posts[j].body, 
                                       index: j, type: accounts[i].posts[j].type, 
                                       target: accounts[i].posts[j].target });
                }
            }
            this.setState({ postList: parsedPosts })
        });

        this.props.socket.emit('request-posts');
    }
    /*
    parsePostString(posts) {
        var parsedPosts = [];
        posts.forEach(element => {
            var splitted = element.split("-");
            if (splitted.length == 3) {
                var newPost = {};
                newPost.title = splitted[0];
                newPost.content = splitted[2];
                parsedPosts.push(newPost);
            }
        });
        this.setState({
            posts: parsedPosts
        });
    }
    */
    render() {
        
        return (
        <div className="post-grid d-flex align-items-center flex-wrap">
            {this.state.postList.map((element, index, arr) => {
                return (
                    <div className="flex-container" key={index}>
                        <PostAbbrev socket={this.props.socket} title={element.poster} content={element.body} posterPubkey={element.poster} postIndex={element.index} />
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