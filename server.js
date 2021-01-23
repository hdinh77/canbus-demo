var can = require('socketcan');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var channel = can.createRawChannel('vcan0', true);

var carInfo = {};
carInfo.speed = 0;
carInfo.revs = 0;
carInfo.actuator = 0;

var actuatorChange = {'status': 0,
			'value': 0
};


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html');
});
app.use(express.static(__dirname + '/html'));



// connection for socket.io
io.on('connection', function(client) {
    console.log('client is connected');

    io.on('actuatorChange', (val) => {
	console.log("actuator on, val: " + val);
	actuatorChange['status'] = 1;
	actuatorChange['value'] = parseInt(val);
    });
});


// sends carInfo that we got from channel listener to frontend..."CANmessage" is keyword
setInterval(() => {
    io.emit('CANmessage', carInfo)
}, 100);


// listens for messages that come in through canbus channel
channel.addListener("onMessage", function(msg) {
    console.log("Message has been received");
    console.log("ID: " + msg.id);

    carInfo.revs = msg.data.readUIntBE(0, 4);
    carInfo.speed = msg.data.readUIntBE(4, 2);
  
    if(actuatorChange['status'] == 1) {
	msg.data.writeUIntBE(actuatorChange['value'], 6, 2);
    }
    carInfo.actuator = msg.data.readUIntBE(6, 2);
    console.log(carInfo);
});

/*
var fs = require('fs');
var network = can.parseNetworkDescription("samples/can_definition_sample.kcd");
var db_instr = new can.DatabaseService(channel, network.buses["Instrumental"]);
*/

channel.start();

/*
db_instr.messages["TankController"].signals["TankTemperature"].update(80);
db_instr.send("TankController");
*/

server.listen(3000);
