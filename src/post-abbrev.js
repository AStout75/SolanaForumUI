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
            <div className="post-icons d-flex align-items-center justify-content-end">
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