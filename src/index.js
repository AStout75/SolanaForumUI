import SocketContext from './socket-context';
import Home from './home';

let socket = io();

const App = props => (
    <SocketContext.Provider value={socket}>
        <Home />
    </SocketContext.Provider>
);
  
ReactDOM.render(
    <App />,
    document.getElementById('root')
);

socket.emit('connection');



//socket.emit('posts');
/*socket.on('send-posts', text => {
    document.getElementById("posts").innerHTML = "";
    for(let i = 0; i < text.length; i++) {
        document.getElementById("posts").innerHTML += "<p>";
        document.getElementById("posts").innerHTML += text[i];
        document.getElementById("posts").innerHTML += "</p>";
    }
}); */