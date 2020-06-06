var express = require('express');
var socket = require('socket.io');
const path = require('path');

// App setup
var app = express();
var server = app.listen(process.env.PORT || 4000, function(){
  console.log("listening on port 4000.");
})

// Static files
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
    console.log("made socket connection", socket.id);

    socket.on('chat', function(data){
        io.emit('chat', data);
    });
})