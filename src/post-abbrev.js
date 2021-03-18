
class PostAbbrev extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
        <div className="post-abbrev">
            <div>
                <h2>{this.props.title}</h2>
            </div>
            <div>
                <p>{this.props.content}</p>
            </div>
            <div className="post-icons rounded d-flex align-items-center justify-content-end">
                <div onClick={() => {
                    let reply = { target: {} };
                    reply.target.pubkey = this.props.posterPubkey;
                    reply.target.index = this.props.postIndex;
                    reply.body = prompt("Enter reply text:");
                    this.props.socket.emit('reply-post', reply);
                }}
                     className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="fas fa-pencil-alt fa-sm"></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="fas fa-info fa-sm"></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="fas fa-eye-slash fa-sm"></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="fas fa-flag fa-sm"></i>
                </div>
            </div>
        </div>
        )
    }
}

export {PostAbbrev as default}