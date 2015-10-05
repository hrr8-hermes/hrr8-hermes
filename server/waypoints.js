/* waypoints.js
 *
 * This module takes an object in the form:
 * { line : {x1,y1,x2,y2},
 *   half : {...},
 *   lap : [ 'line', 'half' ] }
 *
 * Where the waypoint lines can be named anything and the lap
 * value contains an array representing a lap -- this example
 * has the start/finish line and a halfway point.
 * 
 * And also the number of laps, then returns a function which will check
 * and update an object passed to it.
 *
 * The created function expects to receive an object with a position
 * and distance. It will update the object's distance (representing
 *  the current waypoint & lap).
 *
 * The function assumes the first waypoint serves as the finish line
 * and will increment distance to LAPS * WAYCOUNT, then no longer
 * check/update the object's distance. Distance should begin the race
 * at 0.
 *
 * Returns finished if finished, true if incrementing distance, false otherwise
 *
 * Don't forget to make slope=1 for integer grid
 */

module.exports = function makeWayCounter(waypoints, laps, map) {

  var lap = waypoints.lap;
  var lap_dist = lap.length;
  var max_dist = (laps * lap_dist);
  var center_correct = (map.width/2)|0;

  // Determine if colinear (line seg has x1/x2/y1/y2)
  var colinear = function(line,pt) {
    return ((line.x2-line.x1)*(pt.y-line.y1))===((pt.x-line.x1)*(line.y2-line.y1));
  };

  // Check b between a and c inclusive
  var within = function(a,b,c) {
    return ((a<=b) && (b<=c)) || ((c<=b) && (b<=a));
  };

  // If colinear and on defined segment
  var on_line_seg = function(line,pt) {
    return colinear(line,pt) &&
           ((line.x1!==line.x2)?within(line.x1,pt.x,line.x2):
                                within(line.y1,pt.y,line.y2));
  };

  return function(racer) {
    if (racer.distance===max_dist) return 'finished';
    // current waypoint is current dist+1 modulo lap dist in lap array
    var waypoint = waypoints[lap[(racer.distance+1) % lap_dist]];

    // TODO: refactor server model to keep separate x,y and convert once (setter?)
    var pt = {};
    pt.x = center_correct + Math.floor(racer.position.x);
    pt.y = center_correct - Math.floor(racer.position.z);
    // uncomment this log to run around and find coords for waypoints easily
    //console.log('AT : ('+pt.x+','+pt.y+')');

    // hacky but workable, check X-shape w/ player in center
    if (on_line_seg(waypoint,pt) ||
        on_line_seg(waypoint,{x:pt.x-1,y:pt.y-1}) || 
        on_line_seg(waypoint,{x:pt.x-1,y:pt.y+1}) ||
        on_line_seg(waypoint,{x:pt.x+1,y:pt.y-1}) ||
        on_line_seg(waypoint,{x:pt.x+1,y:pt.y+1})) {
      racer.distance++;
    console.log(lap[racer.distance%lap_dist]);
      return true;
    }
    return false;
  };
};
