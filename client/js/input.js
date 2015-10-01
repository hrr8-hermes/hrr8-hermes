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
window.USER_INPUT = {};

window.addEventListener('keydown', function(e) {
  USER_INPUT['K' + String.fromCharCode(e.keyCode)] = 1;
  socket.emit('movementInput',USER_INPUT);
});
window.addEventListener('keyup', function(e) {
  USER_INPUT['K' + String.fromCharCode(e.keyCode)] = 0;
  socket.emit('movementInput',USER_INPUT);
});
