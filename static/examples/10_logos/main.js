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
            this.obj = new Obj({
                $el: this.$el,
                w: this.$el.width(),
                h: this.$el.height(),
                mass: this.m
            });
            this.obj.velo = new Vector(600, 0);

            this.$el.on('mousedown', this.mouseDown.bind(this));
            $.Window.on('mouseMove', this.mouseMove.bind(this));
            $.Window.on('mouseUp', this.mouseUp.bind(this));
        },

        mouseDown: function (evt) {
            this.stretchFirstPosition = new Vector(evt.pageX, evt.pageY);
            this.stretchMoving = true;
            this.stretchIsFirstPos = this.obj.pos;

            movingObjects.push(this.$el);
            this.changeZIndexes();

            this.changeZIndexes();
            this.stopAnimate();
        },

        mouseMove: function (custom, evt) {
            if (!this.stretchMoving) {
                return false;
            }

            var stretchMovingPosition = new Vector(evt.pageX, evt.pageY);
            this.stretchForce = this.stretchFirstPosition.subtract(stretchMovingPosition);
            this.stretchCalcForce();

            if (this.stretchIsFirst) {
                this.stretchIsFirst = false;
            }
        },

        stretchCalcForce: function () {
            var displ = this.stretchForce;

            var restoring = displ.multiply(-this.stretchKSpring);
            var damping = restoring.multiply(this.stretchCDamping);

            this.obj.pos = damping.add(this.stretchIsFirstPos);

            this.obj.changeStyles();
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
            this.dt = 0.017; /* По сути время представляет собой константу,
                      которая при стабильной работе компьютера, без задержек равна примерно 17 = 1000/60 (60 кадров в секунду).
                      Т.е. величина как мы видим постоянная. В примерах взято число, т.к. если вдруг компьютер не стабилен, то при
                      четком расчете времени анимация прыгает, а если число, то она просто задерживается (тоже не хорошо, но выглядет менее заметно). В примере 01_movingBall
                      показан в комментариях также код рассчета времени */
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
            this.obj.pos = this.obj.pos.addScaled(this.obj.velo, this.dt);

            if (Math.round(this.obj.x) === 0 && Math.round(this.obj.y) === 0) {
                this.obj.pos = new Vector(0, 0);

                var index = movingObjects.indexOf(this.$el);
                this.removeZIndex(movingObjects[index]);
                movingObjects.splice(index, 1);

                this.stopAnimate();
            }

            this.obj.changeStyles();
        },

        calcForce: function () {
            var displ = this.obj.pos.subtract(this.centerPosition);
            var restoring = displ.multiply(-this.kSpring);
            var damping = this.obj.velo.multiply(-this.cDamping);

            this.force = new Vector(0, 0);
            this.force.incrementBy(restoring);
            this.force.incrementBy(damping);
        },

        updateAccel: function () {
            this.acc = this.force.multiply(1 / this.m);
        },

        updateVelo: function (obj) {
            this.obj.velo = this.obj.velo.addScaled(this.acc, this.dt);
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
