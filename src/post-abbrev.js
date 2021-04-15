import SocketContext from "./socket-context";
import PostIcons from "./post-icons"

class PostAbbrev extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        
        return (
        <div className={"post-abbrev " + (this.props.post.reports >= 2 ? "post-reported" : "")}>
            <div>
                <div>
                    <h2>{this.props.post.likes.toString() + " likes"}</h2>
                </div>
                <div>
                    <p>{this.props.post.body}</p>
                </div>
                <PostIcons post={this.props.post} />
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