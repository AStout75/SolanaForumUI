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
        else if (this.state.tab.substring(0, "petition".length) == "petition") {
            console.log("petition".length);
            var idx = this.state.tab.substring("petition".length, this.state.tab.length);
            console.log("petitions is", this.props.post.petitions, "and we want the index", idx);
            this.content = <PostAbbrevPetition petition={this.props.post.petitions[parseInt(idx) - 1]} index={idx} />
        }
        return (
        <div>
            <ul className="post-tabs d-flex flex-row">
                <li className={"post-tab-main" + (this.state.tab == "post" ? " selected" : "")}
                    onClick={() => this.setState({tab: "post"})}>
                    Post Content
                </li>
                {this.props.post.petitions.map((element, index, arr) => {
                    return (
                        <li key={index} className={"post-tab-petition" + (this.state.tab == ("petition" + (index + 1)) ? " selected" : "")}
                            onClick={() => this.setState({tab: "petition" + (index + 1)})}>
                            Petition {index + 1}
                        </li>
                    );
                    })
                }
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