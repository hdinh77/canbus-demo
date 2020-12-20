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