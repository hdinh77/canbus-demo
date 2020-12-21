var can = require('socketcan');

var channel = can.createRawChannel('vcan0', true);

var msg = {
    'id': 500,
    data: [0,0,0,0,0,0,0,0]
}












channel.start()