# socketcan demo using canbus data
- build with the help of this tutorial: https://www.youtube.com/watch?v=h8JVC13S66g 

## Dependencies
- socketcan
- electron
- express

## Creating a virtual canbus
- In order to create a virtual canbus, we need a SocketCAN driver where we can initialize a virtual CAN port driver:
```
    sudo modprobe vcan
    sudo ip link add dev vcan0 type vcan
    sudo ip link set up vcan0
```
- these commands set up a device called ```vcan0``` that can send and receive CAN frames
- to be able to see this virtual canbus, use command ```ifconfig```

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
