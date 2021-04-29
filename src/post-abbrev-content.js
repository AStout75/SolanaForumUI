import {Link} from "react-router-dom";
import SocketContext from "./socket-context";
import PostIcons from "./post-icons";

class PostAbbrevContent extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
        <div className="p-2 bg-post rounded">
            <div className={"post-abbrev rounded"}>
            <Link to={{
                pathname: "/post/" + this.props.post.poster + "/" + this.props.post.index,
                state: {
                    selectedPost: this.props.post
                }
            }}>
            <div className="box-link">
                <div>
                    <div>
                        <h2>{this.props.post.likes.toString() + " likes"}</h2>
                    </div>
                    <div>
                        <p>{this.props.post.body}</p>
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
            </Link>
            <PostIcons post={this.props.post} />
            </div>
        </div>
        
        )
    }
}

const PostAbbrevContentWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostAbbrevContent {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostAbbrevContentWithSocket as default}