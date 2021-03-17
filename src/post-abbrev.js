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
        </div>
        )
    }
}

export {PostAbbrev as default}