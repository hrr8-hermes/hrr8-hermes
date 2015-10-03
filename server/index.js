//Modules for server
var express = require("./server");
var Game = require('./game');
var server = require('http').Server(express);
var io = require('socket.io')(server);
var PNG = require('pngjs2').PNG;
var fs = require('fs');

//For now one game; instantiated in loadMap


//The list of games in the server
var games = {};
var nextGameId = 1;
var currentMapName = 'oblong';
var maps = {
  circle: {
    name: 'Circle of Iniquity',
    path: 'server/assets/scaledCircleMap.png',
    width: null,
    height: null,
    grid: null
  },
  star: {
    name: 'Satan\'s Secret Star',
    path: 'server/assets/course_1_star.png',
    width: null,
    height: null,
    grid: null
  },
  oblong: {
    name: 'The Odious Oblong',
    path: 'server/assets/course_2_oblong.png',
    width: null,
    height: null,
    grid: null
  }
};
//Load up a map grid for collision detection and start a game
initialize();

//load the map grid, as soon as that's complete, use it to instantiate a Game
function initialize() {
  loadMapGrid(currentMapName, createGame);
  console.log(games);
}

function loadMapGrid(mapName, callback) {
  var mapObj = maps[mapName]; 
  fs.createReadStream(mapObj.path)
    .pipe(new PNG({
      filterType: 4
    }))
    .on('parsed', function() {
      mapObj.grid = processImageIntoBitArray(this.data, this.width, this.height);
      mapObj.width = this.width;
      mapObj.height = this.height;
      callback();
    }); 
}

function createGame() {
  game = new Game(nextGameId, io, maps[currentMapName]);
  games[nextGameId] = game;
  nextGameId++;
}

//Listen to connections from socket.io
io.on('connection', function(socket) {
  //add this player to the first open game
  var currentGame;
  for (var i = 1; i < nextGameId; i++)  {
    console.log(i);
    if (games[i].numPlayers < games[i].maxPlayers) {
      currentGame = games[i];
      break;
    }
  }
  currentGame.addPlayer(socket.id);
  //Gets the recently added player from game object
  var currentPlayer = currentGame.players[socket.id];
  //Let all the players know about the new player
  socket.broadcast.emit("playerConnected", currentGame.getSendablePlayer(currentPlayer));


  //receive input from players, hand off to the appropriate game object to calculate positions
  socket.on('movementInput', function(inputObj) {
    getGameBySocketId(socket.id).parseInput(inputObj, socket.id);
  }); 

  socket.on('readyToRace', function() {
    getGameBySocketId(socket.id).playerIsReady(socket.id);
  });
  
  //send all player info to recently connected player
  setTimeout(function() {
    var ps = {};
    for(var pid in currentGame.players) {
      var player = currentGame.players[pid];
      ps[player.socketId] = currentGame.getSendablePlayer(player);
    }
    socket.emit("connected", ps);
  }, 500);

  //Handle when a player disconnects from server
  socket.on('disconnect', function() {
    currentGame.removePlayer(socket.id);
    console.log('dc');
    //Tell all other players that he is disconnected
    io.sockets.emit('playerDisconnected', game.getSendablePlayer(currentPlayer));
  });
});

//Finds the game a socket is connected to.
function getGameBySocketId(socketId) {
  for (var gameId in games) {
    for(var playerId in games[gameId].players) {
      if (playerId = socketId) return games[gameId];
    }
  }
}


//Start up express and socket io
var port = process.env.PORT || 3000;
server.listen(port);


//converts data from png of the map into a multidimensional array of 1s and 0s, 
//representing white and black pixels resepectively
function processImageIntoBitArray(imageDataArray, width, height) {
  var bitArrayGrid = [];
  var numRows = height;
  var rowLength = width;
  for (var i = 0; i < numRows; i++) {
    var row = [];
    for (var j = 0; j < rowLength; j++) {
      var currentIndex = (j * 4) + (rowLength * i * 4);
      var startOfPixel = imageDataArray[currentIndex];
      //if imageDataArray[index] is the start of a white pixel, push a 1
      if (startOfPixel === 255) {
        row.push(1);    
      } else {
        //else, it is a black pixel, so push a 0
        row.push(0);
      }
    }
    bitArrayGrid.push(row);  
  }
  findWhiteZone(bitArrayGrid);
  return bitArrayGrid;
}

//used for testing that our bitArrayGrid is correct
//keep this in the file until our track is finalized
function findWhiteZone(grid) {
  var count = 0;
  var breaking = false;
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid.length; j++) {
      if (grid[i][j] === 1) {
        console.log('first white pixel: row: ' + i + 'column: ' + j );
        count++;
        breaking = (count > 0); 
        if (breaking) break;
      }  
    }
    if (breaking) break;
  } 
  return [i, j];
}  
