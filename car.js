var can = require('socketcan');

var channel = can.createRawChannel('vcan0', true);

var msg = {
    'id': 500,
    data: [0,0,0,0,0,0,0,0]
}

var speed = 0;
var revs = 0;
var actuator = 1;
var up = true;

setInterval(() => {
    var out = {};
    var buff = Buffer.alloc(8);
        
    if(speed < 155) {
        speed += 1;
        revs += 240
    } else {
        if(up) {
            revs += 100;
            up = !up;
        }else {
            revs -= 100;
            up = !up;
        }
    }

    if(revs > 7000) {
        revs = 1000;
    }

    buff.writeUIntBE(revs, 0, 4);
    buff.writeUIntBE(speed, 4, 2);
    buff.writeUIntBE(actuator, 6, 2);
    out.id = msg.id;
    out.data = buff;
    console.log(buff);     

    channel.send(out);
}, 100)


channel.start();
