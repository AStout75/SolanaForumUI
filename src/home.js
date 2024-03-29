import NavBar from './nav-bar';
import PostGrid from './post-grid';
import Footer from './footer';
import InfoPanel from "./info-panel";

import SocketContext from './socket-context';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar />
                <div className="container">
                    
                    <PostGrid />
                </div>
                
                <Footer />
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