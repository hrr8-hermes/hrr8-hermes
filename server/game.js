//Creates a game function
//ID of game
//Io for socket.io
//Map bitmap of game
function Game(id, io, map) {
  this.id = id;
  this.map = map;
  this.players = [];
  this.io = io;
};

//Adds a Player to the Game with there socket id.
//Init position is 0,0
Game.prototype.addPlayer = function(id1) {
  this.players.push({gid: this.id, socketId: id1,x: 0, y: 0});
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
  })
  return result;
};

//A move happened in this game
//Updated there truthy player
Game.prototype.move = function(data) {
  var p1 = this.getPlayer(data.square.socketId);
  p1.x += data.moveTo[0];
  p1.y += data.moveTo[1];
  this.io.sockets.emit('move', p1);
  //this.checkWallCollision([data.x, data.y, p1.socketId]); 
  
};

//Check if player is colliding with other players
Game.prototype.collision = function(data) {
  var temp = this.getPlayer(data.player1.socketId);
  var compare = this.getPlayer(data.player2.socketId);
  if (!(temp.x < compare.x + 1 && temp.x + 1 > compare.x &&
   temp.y < compare.y + 1 && 1+ temp.y > compare.y)) { 
    this.io.sockets.emit('falseCollision', data);
  } else {
    this.io.sockets.emit('trueCollision', data);
  }
};

//Check if player is coliding with a wall of the map
Game.prototype.checkWallCollision = function(player) {
  var serverPlayerData = this.getPlayer(player.socketId);
  var x = serverPlayerData.x;
  var y = serverPlayerData.y;
  var socketId = player.socketId;
  //console.log(bitArray);
  //var index = position[0] + (4 * position[1]);
  if (this.map[y] === undefined || this.map[y][x] === undefined) {
    console.log('ERROR: outside course bounds');
    return;
  }
  var wallHit = (this.map[y][x] === 0)  
  //if (this.map[y][x] === 0) console.log('hitting wall!', wallCollisionsCount++);
  if(wallHit) {
    this.io.to(socketId).emit("trueWallCollision", serverPlayerData);   
  } else {
    this.io.to(socketId).emit("falseWallCollision", serverPlayerData);
  }
};
module.exports = Game;