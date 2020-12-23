# socketcan demo using canbus data
- build with the help of this tutorial: https://www.youtube.com/watch?v=h8JVC13S66g 

## Dependencies
- socketcan
- express
- socket.io
- electron

## Creating a virtual canbus
- In order to create a virtual canbus, we need a SocketCAN driver where we can initialize a virtual CAN port driver:
```
    sudo modprobe vcan
    sudo ip link add dev vcan0 type vcan
    sudo ip link set up vcan0
```
- these commands set up a device called ```vcan0``` that can send and receive CAN frames
- to be able to see this virtual canbus, use command ```ifconfig``` (interface configuration), which shows the configuration of network interfaces on the system

## Writing a simulator
- send out canbus signals that we can use in one package (array), here we're going to make a car
- first, need to import the 'socketcan' module
- create a channel, send out a message (object that has id, data)
- data is sent out using 8 bytes here, each item is 8 bits, 2 hex #s (so lowest is 00, highest is FF or 255)
- to send in a constant loop, use ```setInterval()```
- need to send out data into a buffer
- to start sending out signals, ```node car.js``` and to see all the messages that you have created
```candump vcan0```
- set a limit to how much speed there can be, and then stop the revolutions too when reaches limit
- also have the revs 'bounce' when it reaches max speed
- since max speed is set to 155mph, can store in one byte (one entry of array)
- but for rev, since max is 7000, need to store in multiple bytes/entries of data array
- buffer need to allocate how much space using, so ```Buffer.alloc(8)``` allocates 8 bytes (should be same as # entries in array)
- to write to this buffer, we use unsigned integer set as big endian
```buff.writeUIntBE(value_want_to_write_in, start_byte, length_in_bytes);```

## Setting up the server
- get the server backend to talk to the canbus
- use eventListener that automatically tells you when there is a message
```channel.addListener("onMessage", function(msg) {});```
- this runs the function with parameter msg when a message comes in
- ```[...msg.data]``` this syntax means it is copying the buffer msg.data into an array
- reading from a buffer is similar to writing ```msg.data.readUIntBE(start_byte, length_in_bytes);```
- make all these attributes part of an object called "carInfo"
- now require the express dependencies
- since we are using socketcan too, need to create a server for the app (http is built in module)
```var server = require('http').createServer(app);```
- now we need to tell express where to find the html file that it will be serving up to the web
```app.use(express.static(__dirname + "/html"));```, this sets the page as static, and in the current directory's html file
- also using the canvas-gauges package
- ```app.use``` "serves up a file for it to be able to use", in this case we can even import scripts!

## Backend and frontend communication
- create an index.js file that uses socket.io with web sockets to send info back and forth
- when someone connects to the socket they create a client object that is passed into this function
```io.on('connection', function(client){});```
- client can't access files on the backend, so socket.io hosts all those js files need, use script tag from docs
- when DOM content is loaded (HTML), will call a function to console.log the 'test' data send from backend
- after, can pass in the CAN message through the socket
- to see how to mutate gauges based on CAN message, refer to: https://canvas-gauges.com/documentation/user-guide/using-as-component

## Send message back from frontend to backend
- in this one it'll just reset speed and revs to 0
- add a click listener to a button and send command over the socket to server