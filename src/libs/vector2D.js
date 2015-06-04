;(function (window) {
    var Vector2D = function (x, y) {
        this.x = x;
        this.y = y;
    };

    Vector2D.prototype = {
        lengthSquared: function () {
            return this.x * this.x + this.y * this.y;
        },

        length: function () {
            return Math.sqrt(this.lengthSquared());
        },

        greater: function (vec) {

            if (this.x >= vec.x &&
                this.y >= vec.y) {
                return true;
            }

            return false;
        },

        clone: function () {
            return new Vector2D(this.x, this.y);
        },

        negate: function () {
            this.x = -this.x;
            this.y = -this.y;
        },

        unit: function () {
            var length = this.length();
            if (length > 0) {
                return new Vector2D(this.x / length, this.y / length);
            }else {
                return new Vector2D(0, 0);
            }
        },

        isChangeDirection: function (vec, direction, axis) {
            var newDirection;

            if ((this[axis] < vec[axis] && direction !== 'firstSide') ||
                (this[axis] > vec[axis] && direction !== 'secondSide')) {
                return true;
            } else if (this[axis] >= vec[axis]) {
                return false;
            }
        },

        setBoundaries: function (bonX, bonY, radius) {
            if (this.x < bonX.minX) {
                this.x = bonX.minX;
            }

            if (this.x > bonX.maxX - radius) {
                this.x = bonX.maxX - radius;
            }

            if (this.y < bonY.minY) {
                this.y = bonY.minY;

            }

            if (this.y > bonY.maxY - radius) {
                this.y = bonY.maxY - radius;
            }

            return new Vector2D(this.x, this.y);
        },

        normalize: function () {
            var length = this.length();
            if (length > 0) {
                this.x /= length;
                this.y /= length;
            }
            return this.length();
        },

        add: function (vec) {
            return new Vector2D(this.x + vec.x, this.y + vec.y);
        },

        incrementBy: function (vec) {
            this.x += vec.x;
            this.y += vec.y;
        },

        subtract: function (vec) {
            return new Vector2D(this.x - vec.x, this.y - vec.y);
        },

        decrementBy: function (vec) {
            this.x -= vec.x;
            this.y -= vec.y;
        },

        multiply: function (k) {
            return new Vector2D(k * this.x, k * this.y);
        },

        addScaled: function (vec, k) {
            return new Vector2D(this.x + k * vec.x, this.y + k * vec.y);
        },

        scaleBy: function (k) {
            this.x *= k;
            this.y *= k;
        },

        dotProduct: function (vec) {
            return this.x * vec.x + this.y * vec.y;
        },

        distance: function (vec1, vec2) {
            return (vec1.subtract(vec2)).length();
        },

        angleBetween: function (vec1, vec2) {
            return Math.acos(vec1.dotProduct(vec2) / (vec1.length() * vec2.length()));
        },
        projection: function (vec) {
            var length = this.length();
            var lengthVec = vec.length();
            var proj;
            if ((length == 0) || (lengthVec == 0)) {
                proj = 0;
            } else {
                proj = (this.x * vec.x + this.y * vec.y) / lengthVec;
            }
            return proj;
        },
        project: function (vec) {
            return vec.para(this.projection(vec));
        },

        para: function (u, positive) {
            if (typeof(positive) === 'undefined') {
                positive = true;
            }
            var length = this.length();
            var vec = new Vector2D(this.x, this.y);
            if (positive) {
                vec.scaleBy(u / length);
            }else {
                vec.scaleBy(-u / length);
            }
            return vec;
        },
        perp: function (u, anticlockwise) {
            if (typeof(anticlockwise) === 'undefined') {
                anticlockwise = true;
            }
            var length = this.length();
            var vec = new Vector2D(this.y, -this.x);
            if (length > 0) {
                if (anticlockwise) { // anticlockwise with respect to canvas coordinate system
                    vec.scaleBy(u / length);
                }else {
                    vec.scaleBy(-u / length);
                }
            }else {
                vec = new Vector2D(0, 0);
            }
            return vec;
        }
    };

    // STATIC METHODS
    Vector2D.distance =  function (vec1, vec2) {
        return (vec1.subtract(vec2)).length();
    }
    Vector2D.angleBetween = function (vec1, vec2) {
        return Math.acos(vec1.dotProduct(vec2) / (vec1.length() * vec2.length()));
    }
    Vector2D.scale = function (vec, sca) {
        vec.x *= sca;
        vec.y *= sca;
    }
    Vector2D.vector2D = function (mag, angle, clockwise) {
        if (typeof(clockwise) === 'undefined') {
            clockwise = true;
        }
        var vec = new Vector2D(0, 0);
        vec.x = mag * Math.cos(angle);
        vec.y = mag * Math.sin(angle);
        if (!clockwise) {
            vec.y *= -1;
        }
        return vec;
    }

    window.Vector2D = Vector2D;
} (window));

