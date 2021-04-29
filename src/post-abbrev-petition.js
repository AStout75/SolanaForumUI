import SocketContext from "./socket-context";

class PostAbbrevPetition extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log("Petition: ", this.props.petition);
        return(
        <div className="p-2 bg-petition rounded">
            <div className="post-petition">
                <h3>Petition {this.props.index}</h3>
                <div>Minimum reputation to vote: {this.props.petition.reputationRequirement}</div>
                <br></br>
                <div>Progress: {this.props.petition.numSignatures}/{this.props.petition.signatureCapacity}</div>
                <div className="petition-buttons d-flex justify-content-between">
                    <button 
                    className="petition-button-remove"
                    onClick={() => {this.props.socket.emit('vote-petition', this.props.petition, 1)}}>
                        Vote to <b>remove</b> post</button>
                    <button 
                    className="petition-button-keep"
                    onClick={() => {this.props.socket.emit('vote-petition', this.props.petition, 0)}}>
                        Vote to <b>keep</b> post</button>
                </div>
            </div>
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