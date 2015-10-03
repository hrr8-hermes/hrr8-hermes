/* assets.js
 *
 * This should assign a global array of asset info objects
 * and also set a scale
 *
 * Optionally include a scale per-mesh
 *
 * TODO: sounds autoplay, loop, volume?
 *
 */

window.ASSET_SCALE = 0.02;

window.ASSETS = [

  { 'name' : 'Skitter',
    'type' : 'mesh',
    'file' : 'Assets/enemy@idleRun.babylon' },

  { 'name' : 'Robot',
    'type' : 'mesh',
    'scale': 0.03,
    'file' : 'assets/robot.babylon' },

  { 'name' : 'track',
    'type' : 'mesh',
    'file' : 'Assets/course_3_city_track.babylon'},
    
  { 'name' : 'buildings',
    'type' : 'mesh',
    'file' : 'Assets/course_3_city_buildings.babylon'},

  { 'name' : 'bg1',
    'type' : 'sound',
    'file' : 'sounds/bg/first.wav'}

];
