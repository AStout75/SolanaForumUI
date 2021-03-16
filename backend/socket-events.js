var io;

function setUpSocketEvents(serverIO, response) {
    io = serverIO;
    io.on('connection', socket => {
        console.log('user connected\n\n\n\n');
        
        socket.on('posts', () => {
            console.log('posts requested');
            socket.emit('posts-got', response);
        });
    })
}

exports.setUpSocketEvents = setUpSocketEvents;