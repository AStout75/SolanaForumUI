class NavBar extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
        <nav className="d-flex align-items-center justify-content-between">
            <span>Solana Forum</span>
            <div className="help-button rounded-circle d-flex align-items-center justify-content-center">
                <i className="fas fa-info fa-sm"></i>
            </div>
        </nav>
        )
    }
}

export {NavBar as default}