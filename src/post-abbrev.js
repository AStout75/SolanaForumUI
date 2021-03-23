import SocketContext from "./socket-context";

class PostAbbrev extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
        <div className="post-abbrev">
            <div>
                <div>
                    <h2>{this.props.post.index}</h2>
                </div>
                <div>
                    <p>{this.props.post.body}</p>
                </div>
                <div className="post-icons rounded d-flex align-items-center justify-content-end">
                    <div onClick={() => {
                        let reply = { target: {} };
                        reply.target.pubkey = this.props.post.poster;
                        reply.target.index = this.props.post.index;
                        reply.body = prompt("Enter reply text:");
                        this.props.socket.emit('reply-post', reply);
                    }}
                        className="icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="fas fa-pencil-alt fa-sm"></i>
                    </div>
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <a href={'https://explorer.solana.com/address/' + this.props.post.poster + '?cluster=devnet'} target="_blank" ><i className="fas fa-info fa-sm"></i></a>
                    </div>
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="fas fa-eye-slash fa-sm"></i>
                    </div>
                    <div onClick={() => {
                        let reply = { target: {} };
                        reply.target.pubkey = this.props.post.poster;
                        reply.target.index = this.props.post.index;
                        reply.body = prompt("Enter report reason");
                        this.props.socket.emit('report-post', reply);
                    }}
                        className="icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className="fas fa-flag fa-sm"></i>
                    </div>
                </div>
            </div>
            <div>
                {this.props.post.replies.length == 0 &&
                    <p>
                        No replies
                    </p>
                    }
                {this.props.post.replies.length > 0 &&
                    <p>{this.props.post.replies[0].body}</p>
                }
            </div>
            
        </div>
        )
    }
}

const PostAbbrevWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostAbbrev {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostAbbrevWithSocket as default}