/* mkdir.js
 *
 * Because Windows sucks.
 *
 * Seriously, this script makes one directory. That is all.
 */

fs = require('fs');
// ironically still using / here
var dir = __dirname+'/public/js';
fs.mkdirSync(dir);
