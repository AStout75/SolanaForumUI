
  let socket = io();

  class App extends React.Component {
    constructor(props) {
        super(props);
        
        
    }

    render() {
        return (
        <div>
            <h1>Blockchain forum basic UI</h1>
            <p>Click a button</p>
            <button onClick={() => {socket.emit('posts')}}>See Posts</button>
            <div id="posts">

            </div>
        </div>
        )
    }
}
  
ReactDOM.render(
    <App />,
    document.getElementById('root')
);

socket.emit('connection');
//socket.emit('posts');
socket.on('posts-got', text => {
    document.getElementById("posts").innerHTML = text;
});