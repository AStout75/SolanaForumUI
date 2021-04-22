import SocketContext from "./socket-context";

class PostAbbrevPetition extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log("Petition: ", this.props.petition);
        return(
        <div className="post-petition">
            <h3>Petition {this.props.index}</h3>
            <div>Category: Illegal content</div>
            <div>Minimum reputation to vote: 7 (checkmark)</div>
            <br></br>
            <div>Progress: 6/10</div>
            <button className="petition-button">Add vote to petition</button>
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