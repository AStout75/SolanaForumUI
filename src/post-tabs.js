import SocketContext from "./socket-context";

class PostTabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <ul className="post-tabs d-flex flex-row">
                <li className={"post-tab-main" + (this.props.selectedTab == "post" ? " selected" : "")}
                    onClick={() => this.props.select("post")}>
                    Post Content
                </li>
                {this.props.petitions.map((element, index, arr) => {
                    return (
                        <li key={index} className={"post-tab-petition" + (this.props.selectedTab == ("petition" + (index + 1)) ? " selected" : "")}
                            onClick={() => this.props.select("petition" + (index + 1))}>
                            Petition {index + 1}
                        </li>
                    );
                    })
                }
            </ul>
        )
    }
}

const PostTabsWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostTabs {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostTabsWithSocket as default}


