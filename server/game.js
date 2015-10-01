//Creates a game function
//ID of game
//Io for socket.io
//Map bitmap of game
var Robot = require('./serverRobotModel.js');
var Vector3 = require('./Vector3.js');

function Game(id, io, map) {
  console.log(this);
  this.id = id;
  //this.map is an object with 3 properties: grid (2d array of 1s and 0s),
  // width, and height (map dimensions).
  this.map = map;
  this.players = {};
  this.numPlayers = 0;
  this.io = io;
  this.createUpdateLoop();
  // setInterval(function() {
  //   console.log('console marker...');
  // }, 2000);
  
  this.updatePerSec = 10;
  //Mill Seconds
  this.delta = {deltaValue: 0};
  this.maxPlayers = 8;
};

//Adds a Player to the Game with their socket id.
//Init position is 0,0
Game.prototype.addPlayer = function(socketId) {
  this.players[socketId] = {
    input: {}, 
    gid: this.id, 
    socketId: socketId,
    x: 0, 
    y: 0, 
    robotModel: new Robot(this.delta, socketId, new Vector3(200,2, -66))
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
  p.input = inputObj;
};

Game.prototype.createUpdateLoop = function() {
  //alias for this so we don't lose context inside setInterval
  var self = this;
  var last = new Date().getTime();
  setInterval(function() {
    var current = new Date().getTime();
    self.delta.deltaValue = current - last;
    last = current;
    //loop over all players, check for wall collisions
    for (var playerId in self.players) {
      var player = self.players[playerId];
      player.robotModel.update(player.input);
      if (player.robotModel.hasWallCollision(self.map)) {
        player.robotModel.handleWallCollision();
      }
    }
    self.io.sockets.emit('positions', self.players); 
  },this.updatePerSec);
};

//player/player collision, under construction...
//Check if player is colliding with other players
// Game.prototype.collision = function(data) {
//   var temp = this.getPlayer(data.player1.socketId);
//   var compare = this.getPlayer(data.player2.socketId);
//   if (!(temp.x < compare.x + 1 && temp.x + 1 > compare.x &&
//    temp.y < compare.y + 1 && 1+ temp.y > compare.y)) { 
//     this.io.sockets.emit('falseCollision', data);
//   } else {
//     this.io.sockets.emit('trueCollision', data);
//   }
// };

module.exports = Game;