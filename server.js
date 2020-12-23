var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var channel = can.createRawChannel('vcan0', true);

var carInfo = {};
carInfo.speed = 0;
carInfo.revs = 0;

app.use(express.static(__dirname + "/html"));
app.use("/scripts", express.static(__dirname + "/node_modules/canvas-gauges/"));

io.on('connection', function(client) {
    console.log('client is connected');
});

setInterval(() => {
    io.emit('CANmessage', carInfo)        // this sends data through the socket to frontend, 'test' is the keyword to listen for
}, 100);

channel.addListener("onMessage", function(msg) {
    console.log("Message has been received");
    console.log("ID: " + msg.id);
    // var data = [...msg.data];
    // console.log("Data: " + data);
    // console.log("Speed: " + speed + " mph");
    // console.log("Revs: " + revs + " rpm");

    carInfo.revs = msg.data.readUIntBE(0, 4);
    carInfo.speed = msg.data.readUIntBE(4, 2);
    console.log(carInfo);
});

channel.start();

server.listen(3000);