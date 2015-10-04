/* input.js
 *
 * This file will register all listeners for game logic
 * 
 * TODO:  separate out input_functions
 *        move server comm to out also??
 *
 */

// Global object for all inputs
// 1 = triggered
// 0 = untriggered
window.addEventListener('keydown', function(e) {
  //user has pressed Enter and wants to start a race, or enter a new one
  if (e.keyCode === 13) {
    if (!window.readyPressed) {
      socket.emit('readyToRace');
      var infoBox = document.getElementById('info');
      infoBox.innerHTML = 'Ready...or are you?';
      window.readyPressed = true;
    } else if (window.finished) {
      //socket.emit('seeking new game');
      window.location.reload();
    }
    return;
  }
  var obj = {};
  obj['K' + String.fromCharCode(e.keyCode)] = 1;
  socket.emit('movementInput',obj);
});
window.addEventListener('keyup', function(e) {
  //USER_INPUT['K' + String.fromCharCode(e.keyCode)] = 0;
    var obj = {};
  obj['K' + String.fromCharCode(e.keyCode)] = 0;
  socket.emit('movementInput',obj);
});
