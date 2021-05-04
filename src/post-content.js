import {Link} from "react-router-dom";
import SocketContext from "./socket-context";
import PostIcons from "./post-icons";
import Reply from "./reply";

class PostContent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const title = this.props.post.body.split(';')[0];
        const body = this.props.post.body.split(';')[1];
        return(
        <div className={"p-2 bg-post" + (this.props.full ? "-full" : "") + " rounded"}>
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
                                <h2>{title}</h2>
                            </div>
                            <div className={(this.props.full ? "" : "post-text")}>
                                <p>{body}</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <PostIcons post={this.props.post} />
            </div>
            <div>
                {this.props.post.replies.length == 0 &&
                    <Reply post={null} full={this.props.full} />
                }
                {!this.props.full && this.props.post.replies.length > 0 &&
                    <Reply post={this.props.post.replies[0]} full={this.props.full} />
                }
                {this.props.full && //if full post, show all replies
                    this.props.post.replies.map((element, index, arr) => {
                        return (
                            <Reply key={index} post={element} full={this.props.full} />
                        )
                    })
                }
            </div>
        </div>
        )
    }
}

const PostContentWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostContent {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostContentWithSocket as default}