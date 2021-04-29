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
            <div>Minimum reputation to vote: {this.props.petition.reputationRequirement}</div>
            <br></br>
            <div>Progress: {this.props.petition.numSignatures}/10</div>
            <button 
            className="petition-button"
            onClick={() => {socket.emit('vote-petition', this.props.petition)}}>Add vote to petition</button>
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