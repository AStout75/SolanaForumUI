import SocketContext from "./socket-context";

class PostPetition extends React.Component {
    constructor(props) {
        super(props);
/*
{this.props.petition.signatures.map((element, index, arr) => {
                        return (
                            <div key={index} className="petition-vote-filled"></div>
                        )
                    })}
                    {this.props.petition.signatures.map((element, index, arr) => {
                        return (
                            <div key={index} className="petition-vote-filled"></div>
                        )
                    })}*/
        
    }
    
    render() {
        var voteSquares = [];
        for (var i = 0; i < this.props.petition.signatures.length; i++) {
            voteSquares.push(<div key={i} className="petition-vote-filled"></div>);
        }
        for (var i = 0; i < this.props.petition.signatureCapacity - this.props.petition.signatures.length; i++) {
            voteSquares.push(<div key={i + this.props.petition.signatures.length} className="petition-vote-empty"></div>);
        }

        return(
        <div className="p-2 bg-petition rounded">
            <div className="post-petition">
                <h3>Petition {this.props.index}</h3>
                <p>
                    A user has initiated a petition against this post. Members of the community should vote to either keep or remove the post. Once a majority is reached, <b>users who voted with the majority will receive a reputation reward, regardless of the outcome</b>.
                </p>
                <hr></hr>
                <p><span className="petition-icon"><i className="fas fa-lock fa-md"></i></span>{this.props.petition.reputationRequirement} reputation minimum to vote</p>
                <div><span className="petition-icon"><i className="fas fa-users"></i></span>{this.props.petition.numSignatures}/{this.props.petition.signatureCapacity} votes casted</div>
                <div className="petition-votes-visualizer">
                    {voteSquares}
                </div>

                <div className="petition-buttons d-flex justify-content-between">
                    <button 
                    className="petition-button-remove"
                    onClick={() => {this.props.socket.emit('vote-petition', this.props.petition, 1)}}>
                        Vote to remove</button>
                    <button 
                    className="petition-button-keep"
                    onClick={() => {this.props.socket.emit('vote-petition', this.props.petition, 0)}}>
                        Vote to keep</button>
                </div>
            </div>
        </div>
        
        )
    }
}

const PostPetitionWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <PostPetition {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {PostPetitionWithSocket as default}