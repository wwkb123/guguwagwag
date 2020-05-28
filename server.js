var express = require('express');
var socket = require('socket.io');


// App setup
var app = express();
var server = app.listen(4000, function(){
  console.log("listening on port 4000.");
})

// Static files
// app.use(express.static('test'))

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
    console.log("made socket connection", socket.id);

    socket.on('chat', function(data){
        io.emit('chat', data);
    });
})