import SocketContext from './socket-context';

class InfoPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                panel
            </div>
        )
    }
}

const InfoPanelWithSocket = props => (
    <SocketContext.Consumer>
        {socket => <InfoPanel {...props} socket={socket} />}
    </SocketContext.Consumer>
)

export {InfoPanelWithSocket as default}