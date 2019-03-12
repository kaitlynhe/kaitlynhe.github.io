var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem14201' //rename to the name of your port
var dataarray = []; //some data coming in over serial!
var xPos = 0; // keeps track of the position of the graphs


function setup() {
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
 
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
  createCanvas(1400, 1400);
  background(0x100, 0x100, 0x100);
}
 
// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
   print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}
 
function portOpen() {
  print('the serial port opened.')
}
 
function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  print('The serial port closed.');
}

// prints out the readings
function serialEvent() {
  if (serial.available()) {
    var datastring = serial.readLine(); // readin some serial
    console.log(datastring);
    var newarray; 
    try {
      newarray = JSON.parse(datastring); // can we parse the serial
      } catch(err) {
          console.log(err);
    }
    if (typeof(newarray) == 'object') {
      dataarray = newarray;
    }
  } 
}


function draw() {
  graphData(dataarray[0]);
  graphData(dataarray[1]);
}

function graphData(newData) {
  text("temp", 50, 380);
  var yPos = map(newData, 0, 1023, 50, height);
  line(xPos, 400, xPos, height - yPos);
  stroke(255, 0, 30);

  text("humidity", 120, 380);
  var xPos = map(newData, 0, 500, 250, width);
  stroke(255, 0, 30);
  line(yPos, 400, yPos, height - xPos);
  // at the edge of the screen, go back to the beginning:
  if (xPos >= width & yPos >= height) {
    xPos = 0;
    yPos = 0;
  // clear the screen by resetting the background:
    background(0x100, 0x100, 0x100);
  } else {
    xPos++;
    yPos++;
  }

}

