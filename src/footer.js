import SocketContext from "./socket-context";

class Footer extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
        <footer>
            Created by students at Virginia Tech
        </footer>
        )
    }
}

const FooterWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <Footer {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {FooterWithSocket as default}