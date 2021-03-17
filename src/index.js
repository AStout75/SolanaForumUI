
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
            <button onClick={() => {socket.emit('posts')}}>Refresh Posts</button>
            <div id="posts">

            </div>
            <button onClick={() => {socket.emit('new-post', prompt("Enter post body:"))}}>New Post</button>
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
    document.getElementById("posts").innerHTML = "";
    for(let i = 0; i < text.length; i++) {
        document.getElementById("posts").innerHTML += "<p>";
        document.getElementById("posts").innerHTML += text[i];
        document.getElementById("posts").innerHTML += "</p>";
    }
    
});