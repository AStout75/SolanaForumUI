import SocketContext from "./socket-context";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
        <nav className="d-flex align-items-center justify-content-between">
            <span>Solana Forum</span>
            <div className="d-flex align-items-center">
                <div 
                onClick={() => {this.props.socket.emit('new-post', prompt("Enter post body:"))}}
                className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="fas fa-pencil-alt fa-sm"></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="fas fa-wallet fa-sm"></i>
                </div>
                <div className="icon rounded-circle d-flex align-items-center justify-content-center">
                    <i className="fas fa-info fa-sm"></i>
                </div>
            </div>
        </nav>
        )
    }
}

const NavBarWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <NavBar {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {NavBarWithSocket as default}