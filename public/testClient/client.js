var socket = io();
var square;
var players = [];
socket.on('connected', function(data) {
  data.forEach(function(player) {
    if(player.socketId !== socket.id) {
      addPlayer(player);
    } else {
      square = {gid: player.gid, socketId: player.socketId, x: player.x, y: player.y};
      addPlayer(square);
    }
  });
});
socket.on('playerConnected', function(data) {
  addPlayer(data);
});

var addPlayer = function(data) {
  var dom = document.createElement("DIV");
  dom.className = "square";
  dom.setAttribute("id", data.socketId); 
  dom.style.position = 'absolute';
  dom.style.top = '0';
  dom.style.left = '0';
  document.body.appendChild(dom);
  players.push(data);
};

socket.on('trueWallCollision', function(data) {
  console.log('hit wall');
  console.log(lastTime);
  console.log("Took this much extra time: " + ((new Date().getTime()) - lastTime));
});

socket.on('falseWallCollision', function(data) {
//handle a discrepancy between server and client collision detection
});

socket.on('move', function(data) {
  // if(square.socketId === data.socketId) {
  //   return;
  // }
  players.forEach(function(player) {
    if(player.socketId === data.socketId) {
      player.x = data.x;
      player.y = data.y;
      document.getElementById(data.socketId).style.top = data.y + "px";
      document.getElementById(data.socketId).style.left = data.x + "px";
    }
  });
});

function findPlayer(idToFind) {
  var result;
  players.forEach(function(player) {
    if(player.socketId === idToFind) {
      result = player;
    }
  });
  return result;
}

socket.on('trueCollision', function(data) {
  console.log('true collision!!!');
  //A collision has happened, turn both players red for a bit
  document.getElementById(data.player1.socketId).style.backgroundColor = 'red';
  document.getElementById(data.player2.socketId).style.backgroundColor = 'red';
  setTimeout(function() { 
    document.getElementById(data.player1.socketId).style.backgroundColor = 'green';
    document.getElementById(data.player2.socketId).style.backgroundColor = 'green'; 
  }, 1500);
});

socket.on('falseCollision', function(data) {
//handle a discrepancy between server and client player collision detection
});

function onMove(array) {
  //console.log(players);
  socket.emit("move", {square: square, moveTo: array});
  checkWallCollision([square.x, square.y]);
  players.forEach(function(player) {
    if(square.socketId !== player.socketId) {
      var temp = {};
      temp.y = player.y;
      temp.x = player.x;

      var compare = {};
      compare.y = square.y;
      compare.x = square.x;


      if (temp.x < compare.x + 2 && temp.x + 2 > compare.x &&
       temp.y < compare.y + 2 && 2 + temp.y > compare.y) {
//        console.log("1");
        socket.emit('collision', {player1: player, player2: square});
      }

    }

  });
}

var leftArrowPressed = function() {
  var element = document.getElementById(square.socketId);
  //element.style.left = parseInt(element.style.left) - moveSize + 'px';
  //square.x -= moveSize;

  var array = [-moveSize,0]
  onMove(array);
};

var rightArrowPressed = function() {
  var element = document.getElementById(square.socketId);
  //element.style.left = parseInt(element.style.left) + moveSize + 'px';
 // square.x += moveSize;
  var array = [moveSize,0]
  onMove(array);
};

var upArrowPressed = function() {
  var element = document.getElementById(square.socketId);
  //element.style.top = parseInt(element.style.top) - moveSize + 'px';
  //square.y -= moveSize;
    var array = [0,-moveSize]
  onMove(array);
};

var downArrowPressed = function() {
  var element = document.getElementById(square.socketId);
  //element.style.top = parseInt(element.style.top) + moveSize + 'px';
  //square.y += moveSize;
  var array = [0, moveSize]
  onMove(array);
};

var moveSize = 1;


var keyAction = function(event) {                   
  switch (event.keyCode) {
  case 37:
    leftArrowPressed();

  break;

  case 39:
    rightArrowPressed();
  break;

  case 38:
    upArrowPressed();
    event.preventDefault();
  break;

  case 40:
    downArrowPressed();
    event.preventDefault();
  break;

  case 49:
    moveSize = 1;
  break;  

  case 50:
    moveSize = 5;
  break;  

  case 51:
    moveSize = 10;
  break;  

  case 52:
    moveSize = 20;
  break; 

  }
};

var bitArrayGrid;

//draw the map onscreen, to test if collisions are being detected correctly
socket.on('map loaded', function(data) {
  bitArrayGrid = data.imageGrid;
  console.log(data);
  console.log('map loaded received');
  var pixels = data.imageData;
  console.log(pixels[3]);
  var canvas = document.getElementById('canvas');
  canvasWidth = 100;
  canvasHeight = 100;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.id = 'canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  var context = canvas.getContext('2d');
  var imageData = context.createImageData(100, 100);
  for (var i =0; i < imageData.data.length; i+=4) {
    for (var j = 0; j < 4; j++) {
      imageData.data[j + i] = pixels[j + i];
    }
  }
  context.putImageData(imageData, 0, 0);
});
var lastTime;
var wallCollisionsCount = 1;
var checkWallCollision = function(position) {
  var x = position[0];
  var y = position[1];

  if (bitArrayGrid[y] === undefined || bitArrayGrid[y][x] === undefined) {
    console.log('ERROR: outside course bounds');
    return;
  }  
  if (bitArrayGrid[y][x] === 0) {
    console.log('client says hitting wall!', wallCollisionsCount++);
    socket.emit('possibleWallCollision', square);
  }  
  lastTime = new Date().getTime();
};

var docReady = function() {
  window.addEventListener('keydown', keyAction);
  console.log('added');
};


