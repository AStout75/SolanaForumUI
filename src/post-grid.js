
import PostAbbrev from "./post-abbrev";
import SocketContext from "./socket-context";

class PostGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }

        //Update the grid of posts when the server refreshes us
        this.props.socket.on("send-posts", posts => {
            // ! Later, force the client to process the raw post data
            this.parsePostString(posts);
        });

        this.props.socket.emit('request-posts');
    }

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

    render() {
        
        return (
        <div className="d-flex align-items-center flex-wrap">
            {this.state.posts.map((element, index, arr) => {
                return (
                    <div className="flex-container" key={index}>
                        <PostAbbrev title={element.title} content={element.content} />
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