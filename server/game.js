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
  this.players = [];
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
Game.prototype.addPlayer = function(id1) {
  this.players.push({input: {}, 
    gid: this.id, 
    socketId: id1,
    x: 0, 
    y: 0, 
    robotModel: new Robot(this.delta, id1, new Vector3(0,2,0))
  });
  this.numPlayers++;
}; 

//Returning the truthy player from socket id
Game.prototype.getPlayer = function(id) {
  var result;
  this.players.forEach(function(player) {
    if(player.socketId === id) {
      result = player; 
    }
  });
  return result;
};

//Removes a player from game with socket id
Game.prototype.removePlayer = function(id) {
  this.players.splice(this.getIndex(id), 1)
};

//Returns the index of player in list
//input can be player object or socket id
Game.prototype.getIndex = function(player) {
  if(typeof player === 'string') {
    player = this.getPlayer(player);
  }
  var result;
  this.players.forEach(function(p1, index) {
    if(p1 === player) {
      result = index;
    }
  });
  return result;
};

Game.prototype.parseInput = function(inputObj, socketId) {
  var p = this.getPlayer(socketId);
  p.input = inputObj;
  
};

Game.prototype.createUpdateLoop = function() {
  //alias for this so we don't lose context inside setInterval
  var self = this;
  var last = new Date().getTime();
  setTimeout(function l00p() {
    var current = new Date().getTime();
    self.delta.deltaValue = current - last;
    last = current;
    self.players.forEach(function(player) {
      player.robotModel.update(player.input);
      if (player.robotModel.hasWallCollision(self.map)) {
        player.robotModel.handleWallCollision();
      }
    });
    self.io.sockets.emit("positions",self.players);
    setTimeout(l00p,self.updatePerSec);
  },this.updatePerSec);

};


module.exports = Game;
