import SocketContext from "./socket-context";

import PostContent from "./post-content";
import PostPetition from "./post-petition";
import PostTabs from "./post-tabs";
import {Link} from "react-router-dom";

class PostAbbrev extends React.Component {
    constructor(props) {
        super(props);
        

        //STart here: make easy toggling between petition and content
        //consider making petition or content their own sub react classes with data passed in
        //and the tabs stay here...
        var content = <PostContent post={this.props.post} full={false} />;

        this.state = {
            tab: "post"
        };
    }

    selectTab(state) {
        this.setState({
            tab: state
        })
    }

    render() {
        if (this.state.tab == "post") {
            this.content = <PostContent post={this.props.post} full={false} />
        }
        else if (this.state.tab.substring(0, "petition".length) == "petition") {
            var idx = this.state.tab.substring("petition".length, this.state.tab.length);
            this.content = <PostPetition petition={this.props.post.petitions[parseInt(idx) - 1]} index={idx} />
        }
        return (
        <div>
            <PostTabs select={this.selectTab.bind(this)} selectedTab={this.state.tab} petitions={this.props.post.petitions} />
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