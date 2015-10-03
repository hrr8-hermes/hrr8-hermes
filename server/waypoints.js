/* waypoints.js
 *
 * This module takes an object in the form:
 * { line : {x1,y1,x2,y2},
 *   half : {...},
 *   lap : [ line, way2 ] }
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
 * Returns undefined if finished, true if incrementing distance, false otherwise
 *
 * Currently dependent on map global and point conversion
 */

module.exports = function makeWayCounter(waypoints, laps) {

  var lap = waypoints.lap;
  var lap_dist = lap.length;
  var max_dist = (laps * lap_dist);

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
    if (racer.distance===max_dist) return;
    // current waypoint is current dist+1 modulo lap dist in lap array
    var waypoint = waypoints[lap[(racer.distance+1) % lap_dist]];

    // TODO: refactor server model to keep separate x,y and convert once (setter?)
    /*
    var pt = {};
    pt.x = Math.round(racer.position.x + map.width / 2);
    pt.y = Math.round(map.height / 2 - racer.position.z);
    */
    var pt = racer.position;

    if (on_line_seg(waypoint,pt)) {
      racer.distance++;
      return true;
    }
    return false;
  };
};
