import SocketContext from "./socket-context";

class PostAbbrevPetition extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
        <div className="post-petition">
            Petition {this.props.index}
        </div>
        )
        
    }
}

const PostAbbrevPetitionWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostAbbrevPetition {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostAbbrevPetitionWithSocket as default}