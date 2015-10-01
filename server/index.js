//Modules for server
var express = require("./server");
var Game = require('./game');
var server = require('http').Server(express);
var io = require('socket.io')(server);
var png = require('png-js');
var sizeOf = require('image-size');
var fs = require('fs');

//For now one game
var game; 
//var mapGridFromFile = JSON.parse(fs.readFileSync('server/assets/grid.json', 'utf8'));

game = new Game(0, io, {grid: [1,2,3], width: 512, height: 512});
//The list of games in the server
var games = [];
games.push(game);
//pixelData is for displaying the map client side
var pixelData = [];
//will hold the map collision grid we send to the client
var testingGrid;

//Load a map for the game
//loadMap('server/assets/scaledCircleMap.png');

//Listen to connections from socket.io
io.on('connection', function(socket) {
  // socket.on('correct image data', function(data) {
  //   console.log('receiving correct data');
  //   var mapGrid = processImageIntoBitArray(data, 512, 512);
  //   var mapObj = {grid: mapGrid, width: 512, height: 512};
  //   game.map = mapObj; 
  // });

  //Set the player todwww the first open game.

     for(var i = 0; i < games.length; i++) {
        if(games[i].maxPlayers > games[i].players.length) {
          games[i].addPlayer(socket.id);
          break;
        } 
      }

  //Use this id to get id for player game id
    var gameId = game.id;
    //Gets the recently added player from game object
  var p = game.getPlayer(socket.id);
  //Let all the players know about the new player
  socket.broadcast.emit("playerConnected", p);




 


  socket.on('movementInput', function(inputObj) {
    getGame(gameId).parseInput(inputObj, socket.id);
  }); 
  
  
  setTimeout(function() {
    socket.emit("connected", game.players);
  }, 500);
  //send the map to the client to draw, and send the grid to check collisions against
  var objToEmit = { imageData: pixelData, imageGrid: testingGrid };
  socket.emit('map loaded', objToEmit);

  //When a move happens give it to the game to handle
  socket.on('move', function(data) {
    //Find game with id
    getGame(gameId).move(data);
  });
  //When a client collides with wall confirm with server.
  socket.on('possibleWallCollision', function(data) {
    getGame(gameId).checkWallCollision(data);
  });

  //Handle when a player disconnects from server
  socket.on('disconnect', function() {
    getGame(gameId).removePlayer(socket.id);
    //Tell all other players that he is doconnected
    io.sockets.emit('playerDisconnected', p);
  });
  //When someone colides with a player on client check if it really happened with truthy people
  socket.on('collision', function(data) {
    getGame(gameId).collision(data);

  });


});

//Map loading
function loadMap(imagePath) {
  sizeOf(imagePath, function(err, dimensions) {
    if (err) {
      console.log ('error finding image size:', err);
    } else {  
      png.decode(imagePath, function(pixels) {
        //convert the pixels ArrayBuffer into an actual array to send to the client
        for (var i = 0; i < pixels.length; i++) {
          pixelData[i] = pixels[i];
        }  
        console.log(dimensions);
        var mapGrid = processImageIntoBitArray(pixelData, dimensions.width, dimensions.height);
        //Setup the temp game with mapgrid and id and socket io
        var mapObj = {grid: mapGrid, width: dimensions.width, height: dimensions.height};
        game = new Game(0, io, mapObj);
        //Add it to the list of games..
        games.push(game);

      });
    }  
  });
}

//converts data from png of the map into a multidimensional array of 1s and 0s, 
//representing white and black pixels resepectively
function processImageIntoBitArray(imageDataArray, width, height) {
    //console.log(imageDataArray);
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
    console.log(bitArrayGrid.length);
    console.log(bitArrayGrid[1].length);
    console.log(bitArrayGrid[0].length === bitArrayGrid[3].length);
    //set the map grid the client will check collisions against
    testingGrid = bitArrayGrid;
    var string = JSON.stringify(bitArrayGrid);
    // fs.writeFile('server/assets/grid.json', string, function(err) {
    //   if (err) throw err;
    //   fs.readFile('server/assets/grid.json', 'utf8', function(err, data) {
    //     console.log('same', JSON.parse(data)[5][7] === bitArrayGrid[5][7]);
    //   });
    // });

    return bitArrayGrid;
}

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

//Return a game by id
function getGame(id) {
  var result;
  games.forEach(function(game) {
    if(game.id === id) {
      result = game;
    }
  });
  return result;
}

//Finds a game where a socket is connected to.
function getGameBySocketId(socketId) {
  var result;
  games.forEach(function(game) {
    game.players.forEach(function(player) {
      if(player.socketId === socketId) {
        result = game;
      }
    });
  });
  return result;
}

//Start up express and socket io
var port = process.env.PORT || 3000;
server.listen(port);


