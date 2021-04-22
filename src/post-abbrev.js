import SocketContext from "./socket-context";

import PostAbbrevContent from "./post-abbrev-content";
import PostAbbrevPetition from "./post-abbrev-petition";
import {Link} from "react-router-dom";

class PostAbbrev extends React.Component {
    constructor(props) {
        super(props);
        

        //STart here: make easy toggling between petition and content
        //consider making petition or content their own sub react classes with data passed in
        //and the tabs stay here...
        var content = <PostAbbrevContent post={this.props.post} />

        this.state = {
            tab: "post"
        }
    }

    selectTab(state) {
        this.setState({
            tab: state
        })
        /*
        if (state == "post") {
            content = <PostAbbrevContent post={this.props.post} />
        }
        else {
            content = <PostAbbrevPetition post={this.props.post} index={0} />
        }*/
    }

    render() {
        if (this.state.tab == "post") {
            this.content = <PostAbbrevContent post={this.props.post} />
        }
        else {
            this.content = <PostAbbrevPetition post={this.props.post} index={0} />
        }
        return (
        <div>
            <ul className="post-tabs d-flex flex-row">
                <li className={"post-tab-main" + (this.state.tab == "post" ? " selected" : "")}
                    onClick={() => this.setState({tab: "post"})}>
                    Post Content
                </li>
                <li className={"post-tab-petition" + (this.state.tab == "petition1" ? " selected" : "")}
                    onClick={() => this.setState({tab: "petition1"})}>
                    Petition 1
                </li>
                <li className={"post-tab-petition" + (this.state.tab == "petition2" ? " selected" : "")}
                    onClick={() => this.setState({tab: "petition2"})}>
                    Petition 2
                </li>
                <li className={"post-tab-petition" + (this.state.tab == "petition3" ? " selected" : "")}
                    onClick={() => this.setState({tab: "petition3"})}>
                    Petition 3
                </li>
            </ul>

            {this.content}
            
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