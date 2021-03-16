var io;

// This is currently unused
function setUpSocketEvents(serverIO, response) {
    io = serverIO;
    io.on('connection', socket => {
        console.log('user connected');
        
        socket.on('posts', () => {
            console.log('posts requested');
            socket.emit('posts-got', response);
        });

        socket.on('new-post', body => {
            console.log("new post:", body);
        });
    })
}

exports.setUpSocketEvents = setUpSocketEvents;