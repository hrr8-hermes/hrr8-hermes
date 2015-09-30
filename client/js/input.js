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
window.USER_INPUT = {
  
  FORWARD : 0,
  BACK    : 0,
  RIGHT   : 0,
  LEFT    : 0

};

/*
USER_INPUT['FORWARD'] = 0;
USER_INPUT['BACK'] = 0;
USER_INPUT['RIGHT'] = 0;
USER_INPUT['LEFT'] = 0;
*/

window.addEventListener('keydown', function(e) {
  switch (e.keyCode) {
    case 87:
      USER_INPUT['FORWARD'] = 1;
      break;
    case 65:
      USER_INPUT['LEFT'] = 1;
      break;
    case 68:
      USER_INPUT['RIGHT'] = 1;
      break;
    case 83:
      USER_INPUT['BACK'] = 1;
      break;
    }
  //socket.emit('move',USER_INPUT);
});
window.addEventListener('keyup', function(e) {
  switch (e.keyCode) {
    case 87:
      USER_INPUT['FORWARD'] = 0;
      break;
    case 65:
      USER_INPUT['LEFT'] = 0;
      break;
    case 68:
      USER_INPUT['RIGHT'] = 0;
      break;
    case 83:
      USER_INPUT['BACK'] = 0;
      break;
    }
  //socket.emit('move',USER_INPUT);
});
