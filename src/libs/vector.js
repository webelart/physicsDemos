;(function (window) {
    var Vector = function (x, y) {
        this.x = x;
        this.y = y;
    };

    Vector.prototype = {
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

        addScaled: function (vec, k) {
            return new Vector(this.x + k * vec.x, this.y + k * vec.y);
        },

        subtract: function (vec) {
            return new Vector(this.x - vec.x, this.y - vec.y);
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

            return new Vector(this.x, this.y);
        },

        multiply: function (k) {
            return new Vector(k * this.x, k * this.y);
        },

        divide: function (k) {
            return new Vector(this.x / k, this.y / k);
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

        add: function (vec) {
            return new Vector(this.x + vec.x, this.y + vec.y);
        },

        addScalar: function (k) {
            this.x += k;
            this.y += k;
        },

        negate: function () {
            this.x = -this.x;
            this.y = -this.y;
        },

        incrementBy: function (vec) {
            this.x += vec.x;
            this.y += vec.y;
        },
    };

    Vector.add = function (arr) {
        var vectorSum = new Vector(0, 0);
        for (var i = 0; i < arr.length; i++) {
            var vector = arr[i];
            vectorSum.incrementBy(vector);
        }
        return vectorSum;
    };

    window.Vector = Vector;
} (window));

