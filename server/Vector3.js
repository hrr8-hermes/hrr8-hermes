//excerpted from Babylon's Vector3 class
var Vector3 = (function () {

  function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  Vector3.Zero = function () {
    return new Vector3(0, 0, 0);
  };

  Vector3.prototype.addInPlace = function (otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
    this.z += otherVector.z;
    return this;
  };

  Vector3.prototype.scale = function (scale) {
    return new Vector3(this.x * scale, this.y * scale, this.z * scale);
  };

  Vector3.prototype.lengthSquared = function () {
    return (this.x * this.x + this.y * this.y + this.z * this.z);
  };

  Vector3.prototype.equals = function (otherVector) {
    return otherVector && this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
  };

  return Vector3;

})();

module.exports = Vector3;