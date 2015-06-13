;(function () {
    var movingObjects = [];

    var oscillationObject = {
        init: function ($el, ops) {
            this.$el = $el;
            this.ops = ops;

            this.getVars();
            this.createObjs();
        },

        getVars: function () {
            this.centerPosition = new Obj(2, 2);

            this.stretchKSpring = this.ops.stretchKSpring;
            this.stretchCDamping = this.ops.stretchCDamping;
            this.stretchMoving = false;
            this.stretchIsFirst = false;

            this.m = this.ops.mass;
            this.kSpring = this.ops.kSpring;
            this.cDamping = this.ops.cDamping;
            this.isMoving = false;

            this.centerPosition = new Obj(2, 2);
        },

        createObjs: function () {
            this.obj = new Obj(this.$el.width(), this.$el.height(), this.m, 0);
            this.obj.velo2D = new Vector2D(600, 0);

            this.$el.on('mousedown', this.mouseDown.bind(this));
            $.Window.on('mouseMove', this.mouseMove.bind(this));
            $.Window.on('mouseUp', this.mouseUp.bind(this));
        },

        mouseDown: function (evt) {
            this.stretchFirstPosition = new Vector2D(evt.pageX, evt.pageY);
            this.stretchMoving = true;
            this.stretchIsFirstPos = this.obj.pos2D;

            movingObjects.push(this.$el);
            this.changeZIndexes();

            this.changeZIndexes();
            this.stopAnimate();
        },

        mouseMove: function (custom, evt) {
            if (!this.stretchMoving) {
                return false;
            }

            var stretchMovingPosition = new Vector2D(evt.pageX, evt.pageY);
            this.stretchForce = this.stretchFirstPosition.subtract(stretchMovingPosition);
            this.stretchCalcForce();

            if (this.stretchIsFirst) {
                this.stretchIsFirst = false;
            }
        },

        stretchCalcForce: function () {
            var displ = this.stretchForce;
            var restoring = Forces.spring(this.stretchKSpring, displ);
            var damping = Forces.damping(this.stretchCDamping, restoring);

            damping = damping.multiply(-1);
            this.obj.pos2D = damping.add(this.stretchIsFirstPos);

            this.$el.css('transform', 'translate3d(' + this.obj.x + 'px, ' + this.obj.y + 'px, 0)');
        },

        mouseUp: function (evt) {
            if (!this.stretchMoving) {
                return false;
            }
            this.stretchMoving = false;
            this.t0 = new Date().getTime();
            this.animFrame();
        },

        changeZIndexes: function () {
            for (var i = 0, len = movingObjects.length; i < len; i++) {
                movingObjects[i].css('z-index', i + 2);
            }
        },

        removeZIndex: function ($el) {
            $el.css('z-index', 1);
        },

        animFrame: function () {
            var _this = this;

            animFrame();
            function animFrame() {
                _this.animId = requestAnimationFrame(animFrame);
                _this.onTimer();
            }
        },

        stopAnimate: function (evt) {
            this.isMoving = false;
            cancelAnimationFrame(this.animId);
        },

        onTimer: function () {
            var t1 = new Date().getTime();
            this.dt = 0.001 * (t1 - this.t0);
            this.t0 = t1;

            if (this.dt > 0.2) {
                this.dt = 0;
            }

            this.move();
        },

        move: function () {
            this.isMoving = true;
            this.moveObject(this.obj);
            this.calcForce();
            this.updateAccel();
            this.updateVelo(this.obj);
        },

        moveObject: function (obj) {
            this.obj.pos2D = this.obj.pos2D.addScaled(this.obj.velo2D, this.dt);

            if (Math.round(this.obj.x) === 0 && Math.round(this.obj.y) === 0) {
                this.obj.pos2D = new Vector2D(0, 0);

                var index = movingObjects.indexOf(this.$el);
                this.removeZIndex(movingObjects[index]);
                movingObjects.splice(index, 1);

                this.stopAnimate();
            }

            this.$el.css('transform', 'translate3d(' + obj.x + 'px, ' + obj.y + 'px, 0)');
        },

        calcForce: function () {
            var displ = this.obj.pos2D.subtract(this.centerPosition);
            var restoring = Forces.spring(this.kSpring, displ);
            var damping = Forces.damping(this.cDamping, this.obj.velo2D);

            this.force = Forces.add([restoring, damping]);
        },

        updateAccel: function () {
            this.acc = this.force.multiply(1 / this.m);
        },

        updateVelo: function (obj) {
            this.obj.velo2D = this.obj.velo2D.addScaled(this.acc, this.dt);
        }
    };

    $.fn.oscilationObject = function (ops) {
        var options = $.extend({}, $.fn.oscilationObject.options, ops);

        $.Body.on('mousemove', function (evt) {
            $.Window.trigger('mouseMove', [evt]);
        });
        $.Body.on('mouseup', function (evt) {
            $.Window.trigger('mouseUp', [evt]);
        });

        this.each(function () {
            var $this = $(this);

            if ($this.data('init')) {
                return false;
            }

            $this.data('init', true);

            var newOscilation = Object.create(oscillationObject);
            newOscilation.init($this, options);
        });
    };

    $.fn.oscilationObject.options = {
        mass: 1,
        stretchCDamping: 0.6,
        stretchKSpring: 0.8,
        kSpring: 10,
        cDamping: 0.7
    };

    window.onload = function () {
        var $logos = $('.Logos');
        var $covers = $logos.find('.Logos-cover');

        $covers.oscilationObject();
    };
}());
