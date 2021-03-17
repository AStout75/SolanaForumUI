
import PostAbbrev from "./post-abbrev";
import SocketContext from "./socket-context";

class PostGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [{"title": "t1", "content": "this is post 1"}],
        }

        console.log("post grid const");

        //Update the grid of posts when the server refreshes us
        this.props.socket.on("send-posts", posts => {
            console.log("GOT POSTS", posts);
            // ! Later, force the client to process the raw post data
            this.setState({
                posts: posts
            });
        });

        this.props.socket.emit('request-posts');
    }

    render() {
        
        return (
        <div>
            {this.state.posts.map((element, index, arr) => {
                return (
                    <PostAbbrev title={element.title} content={element.content} />
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