//Server imports
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = '/dist/views/index.html';

function setUpServer() {
    console.log(PORT);

    //Serve files
    var app = express();
    app.get('/', function(req, res) {
        res.sendFile(path.join(process.cwd() + INDEX));
    });
    app.use(express.static(path.join(process.cwd(), 'dist')));
    
    let server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

exports.setUpServer = setUpServer;