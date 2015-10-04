//Creates a game function
//ID of game
//Io for socket.io
//Map bitmap of game
var Robot = require('./serverRobotModel.js');
var Vector3 = require('./Vector3.js');


// Temp map load for waypoint checker
var mapJSON = require('./assets/course_2_oblong.json');
var waypointCheck = require('./waypoints.js')(mapJSON,2);

function Game(id, io, map) {
  this.id = id;
  //this.map is an object with 3 properties: grid (2d array of 1s and 0s),
  // width, and height (map dimensions).


  this.map = map;
  //this.startPos = {x: 190, y: 2.7, z : -66};
  this.startPos = this.getStartingPosition();
  console.log(this.startPos);
  console.log(mapJSON.line);

  //HERE
  //this.waypointCounter = makeWaypointCounter(map.)
  this.players = {};
  this.numPlayers = 0;
  this.numReadyPlayers = 0;
  this.raceInProgress = false;
  this.raceFinished = false;
  this.io = io;
  this.timeBetweenUpdates = 10;
  //Mill Seconds
  this.delta = {deltaValue: 0};
  this.maxPlayers = 8;
  this.createUpdateLoop();
};

Game.prototype.getStartingPosition = function() {
  var startLineOnGrid = mapJSON.line;
  // var startingX = startLineOnGrid.x1;
  // var startingZ = startLineOnGrid.y1;
  var startingX = startLineOnGrid.x1 - this.map.width / 2;
  var startingZ = this.map.height / 2 - startLineOnGrid.y1;
   //startPos.y never changes, vertical elevation above the track
  return {x: startingX, y: 2.7, z: startingZ + 3};
};

Game.prototype.lineUpRacers = function() {
  var count = 1;
  for (var playerId in this.players) {
    var playerModel = this.players[playerId].robotModel;
    playerModel.position.x = this.startPos.x;
    count++;
    playerModel.position.z = this.startPos.z + 3.5 * count;
    playerModel.stopMoving();
    playerModel.facing = -.249999;
    playerModel.setState('waiting');
    var gameContext = this;
  
    this.io.sockets.emit('countdown');
    setTimeout(function() {
      gameContext.io.sockets.emit('raceStarting');
      gameContext.raceInProgress = true;
      if (this.distance === -1) {
        console.log('setting distance to 0');
        this.distance = 0;
      }
      this.setState('running');
      console.log('running again!');
      console.log('this.distance: ', this.distance);

    }.bind(playerModel), 3000);
  }
};
//when a player has pressed enter, set their isReady to true.  if all players are
//ready, start a race.
Game.prototype.playerIsReady = function(socketId) {
  var readyPlayer = this.players[socketId];
  if (!readyPlayer.isReady) {
    readyPlayer.isReady = true;
    console.log('set player to ready');
    console.log(this.numReadyPlayers);
    this.numReadyPlayers++;
    if (this.numReadyPlayers === this.numPlayers) {
      console.log('about to start');
      this.startRace();
    }
  }  
};

Game.prototype.startRace = function() {
  this.lineUpRacers();
};

//Adds a Player to the Game with their socket id.
//Init position is 0,0
Game.prototype.addPlayer = function(socketId) {
  this.players[socketId] = {
    isReady: false,
    input: {}, 
    gid: this.id, 
    socketId: socketId,
    x: 0, 
    y: 0, 
    robotModel: new Robot(this, this.delta, socketId, new Vector3(this.startPos.x, this.startPos.y, this.startPos.z + 3.5 * this.numPlayers))
  };
  this.numPlayers++;
}; 

//Removes a player from game with socket id
Game.prototype.removePlayer = function(id) {
  delete this.players[id];
  this.numPlayers--;
};

Game.prototype.parseInput = function(inputObj, socketId) {
  var p = this.players[socketId];
  //Techinally O(1) I think
  for(var key in inputObj) {
    p.input[key] = inputObj[key]
  }
  //p.input = inputObj;
};

Game.prototype.createUpdateLoop = function() {
  //alias for this so we don't lose context inside setInterval
  var self = this;
  var last = new Date().getTime();
  var updatesCount = 0;
  setTimeout(function updateLoop() {
    var current = new Date().getTime();
    self.delta.deltaValue = current - last;
    last = current;
    var objectsToSend = {};
    //loop over all players, check for wall collisions
    for (var playerId in self.players) {
      
      var player = self.players[playerId];
      player.robotModel.update(player.input);
      if (player.robotModel.hasWallCollision(self.map)) {
        player.robotModel.handleWallCollision();
      }
      if (self.hasPlayerCollision(player)) {
        player.robotModel.handlePlayerCollision();
      }
      
      if (self.raceInProgress) {
        //console.log('race in progress');
        waypointCheck(player.robotModel);
      } 

      objectsToSend[player.socketId] = self.getSendablePlayer(player);
    }

    if (updatesCount === 1) {
      self.sendToClients("positions", objectsToSend);
      
      updatesCount = 0;

     }
     updatesCount++;
    setTimeout(updateLoop,self.timeBetweenUpdates);
  },this.timeBetweenUpdates);


};

//player/player collision, under construction...
//currently only checks if occupying same pixel on 2d map

Game.prototype.hasPlayerCollision = function(player) {
  for (var playerId in this.players) {
    if (player.socketId === playerId) continue;
    if (this.playersAreColliding(player, this.players[playerId])) return true;
  }
  return false;
};

Game.prototype.playersAreColliding = function(player1, player2) {
  var player1x = player1.robotModel.getXOnGrid(this.map);
  var player2x = player2.robotModel.getXOnGrid(this.map);
  var player1y = player1.robotModel.getYOnGrid(this.map);
  var player2y = player2.robotModel.getYOnGrid(this.map);
  return (player1x === player2x && player1y === player2y);
//old bounding box algorithm, saving for later  
//   var temp = this.getPlayer(data.player1.socketId);
//   var compare = this.getPlayer(data.player2.socketId);
//   if (!(temp.x < compare.x + 1 && temp.x + 1 > compare.x &&
//    temp.y < compare.y + 1 && 1+ temp.y > compare.y)) { 
//     this.io.sockets.emit('falseCollision', data);
//   } else {
//     this.io.sockets.emit('trueCollision', data);
//   }
// };
};

Game.prototype.playersInRadiusOfLocation = function(location, radius) {
  var players = [];
  for(var pid in this.players) {
    var player = this.players[pid];
    var pos = player.robotModel.position;
    var dis = Math.sqrt(Math.pow(location.x - pos.x, 2) + Math.pow(location.z - pos.z, 2));
    if(dis <= radius) {
      players.push({player: player, distance: dis});
    }
  }
  return players;
}

Game.prototype.getSendablePlayer = function(player) {
  return {
      socketId: player.socketId,
      robotModel: {
        velocity: player.robotModel.velocity,
        state: player.robotModel.state,
        facing: player.robotModel.facing,
        position: player.robotModel.position,
        energy: player.robotModel.energy,
        distance: player.robotModel.distance,
      }
    };
}

//Sends to all connected players in this game the object argument
//if the third argument exsits it will skip that socket to send too. 
Game.prototype.sendToClients = function(event, obj,socket) {
  if(socket) {
    for(var playerId in this.players) {
      if(socket.id !== playerId) {
        this.io.to(playerId).emit(event, obj); 

      }
    }
  } else {
    for(var playerId in this.players) {
      this.io.to(playerId).emit(event, obj); 
    }
  }
}

module.exports = Game;
