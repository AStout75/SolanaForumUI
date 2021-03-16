var io;

function setUpSocketEvents(serverIO) {
    io = serverIO;
    io.on('connect', socket => {
        console.log('user connected\n\n\n\n');
        
        socket.on('posts', () => {
            console.log('posts requested');
            socket.emit('posts-got', "HEY HEY HEYYYYYYY");
        });
    })
}

exports.setUpSocketEvents = setUpSocketEvents;