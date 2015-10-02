/* assets.js
 *
 * This should assign a global array of asset info objects
 * and also set a scale
 *
 */

window.ASSET_SCALE = 0.02;

window.ASSETS = [

  { 'name' : 'Skitter',
    'type' : 'mesh',
    'file' : 'Assets/enemy@idleRun.babylon' },

  { 'name' : 'bg1',
    'type' : 'sound',
    'file' : 'sounds/bg/first.wav'},

  // { 'name' : 'Plane001',
    // 'type' : 'mesh',
  //   'file' : "Assets/testEnv.babylon" },

  // { 'name' : 'Cylinder014',
    // 'type' : 'mesh',
  //   'file' : 'Assets/testEnv.babylon' }

//circle 
  // { 'name' : 'ground',
    // 'type' : 'mesh',
  //   'file' : 'Assets/scaledCircleMap.babylon'}

//star course
  // { 'name' : 'track',
    // 'type' : 'mesh',
  //   'file' : 'Assets/course_1_star.babylon'}

//oblong course
  { 'name' : 'track',
    'type' : 'mesh',
    'file' : 'Assets/course_2_oblong.babylon'}

];
