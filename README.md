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
- data is sent out using 8 bytes here (8 items in an array)
- to send in a constant loop, use ```setInterval()```