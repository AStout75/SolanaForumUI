//Server imports
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = '/dist/views/index.html';

function setUpServer() {
    console.log(PORT);

    //Serve files
    var app = express();


    app.get('/', function(req, res) {
        res.sendFile(path.join(process.cwd() + INDEX), function(err) {
          if (err) {
            res.status(500).send(err)
          }
        })
    });

    app.get('/post/*', function(req, res) {
        res.sendFile(path.join(process.cwd() + INDEX), function(err) {
          if (err) {
            res.status(500).send(err)
          }
        })
    });
      
    app.use(express.static(path.join(process.cwd(), 'dist')));
    
    let server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    const io = socketIO(server);
    return io;
}

exports.setUpServer = setUpServer;
