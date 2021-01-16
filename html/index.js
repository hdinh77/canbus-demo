var socket = io.connect('localhost:3000');    // this is IP address of device and the port number

document.addEventListener("DOMContentLoaded", onDOMReadyHandler());         // when DOM content loaded

function onDOMReadyHandler(event) {
    socket.on('CANmessage', (data) => {
        var speed = document.getElementsByTagName('canvas')[0];
        var revs = document.getElementsByTagName('canvas')[1];
        speed.setAttribute('data-value', data.speed);
        revs.setAttribute('data-value', data.revs);


        console.log(data);
    });
}
