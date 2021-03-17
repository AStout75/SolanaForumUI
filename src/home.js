import NavBar from './nav-bar';
import PostGrid from './post-grid';

import SocketContext from './socket-context';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar />
                <PostGrid />
                <button onClick={() => {this.props.socket.emit('new-post', prompt("Enter post body:"))}}>New Post</button>
            </div>
        )
    }
}

const HomeWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <Home {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {HomeWithSocket as default}