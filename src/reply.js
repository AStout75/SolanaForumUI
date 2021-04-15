import SocketContext from './socket-context';
import PostIcons from "./post-icons";

class Reply extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("In reply, the props is ", this.props.post);
        return (
            <div className="post-reply">
                <div>
                    <h2>{this.props.post.likes.toString() + " likes"}</h2>
                </div>
                <div>
                    <p>{this.props.post.body}</p>
                </div>
                <PostIcons post={this.props.post} />
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