import SocketContext from './socket-context';
import PostIcons from "./post-icons";

class Reply extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("In reply, the props is ", this.props.post);
        if (this.props.post == null) {
            return (
                <div className="post-reply-empty rounded">
                    <div className="reply-text">
                        <p>No replies yet.</p>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <div className="post-reply rounded">
                    <div>
                        <div className={(this.props.full ? "" : "reply-text")}>
                            <p>{this.props.post.body}</p>
                        </div>
                    </div>
                    <PostIcons post={this.props.post} />
                </div>
                
            </div>
            
        )
    }
}

const ReplyWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <Reply {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {ReplyWithSocket as default}