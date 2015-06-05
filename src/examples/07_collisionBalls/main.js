;(function () {
    var collisionObject = {
        init: function ($el, ops) {
            this.$el = $el;
            this.ops = ops;

            this.getVars();
            this.startAnimation();
        },

        getVars: function () {
            this.t0 = 0;

            this.winW = $.Window.width();

            this.$firstObj = this.$el.find(this.ops.$firstObj);
            this.$secondObj = this.$el.find(this.ops.$secondObj);

            this.objF = new Obj({
                $el: this.$firstObj,
                m: 1,
                radius: 100
            });

            this.objS = new Obj({
                $el: this.$secondObj,
                m: 1,
                radius: 100
            });

            // Задаем начальную позицию
            this.objF.pos2D = new Vector2D(0, 0);
            this.objS.pos2D = new Vector2D(this.winW - this.objS.radius, 0);

            // Задаем скорость
            this.objF.velo2D = new Vector2D(this.ops.velo, 0);
            this.objS.velo2D = new Vector2D(-this.ops.velo, 0);

            // Рисуем объекты
            this.objF.changeStyles();
            this.objS.changeStyles();
        },

        startAnimation: function () {
            var _this = this;
            this.frameAnim;

            frameStart();
            function frameStart() {
                _this.frameAnim = requestAnimationFrame(frameStart);
                _this.onTimer();
            }
        },

        stopAnimate: function () {
            cancelAnimationFrame(this.frameAnim);
        },

        onTimer: function () {
            var t1 = new Date().getTime();
            this.dt = 0.004 * (t1 - this.t0);
            this.t0 = t1;
            if (this.dt > 0.2) {
                this.dt = 0;
            }
            this.move();
        },

        move: function () {
            this.moveObject();
            this.checkCollision();
        },

        moveObject: function () {
            this.objF.pos2D = this.objF.pos2D.addScaled(this.objF.velo2D, this.dt);
            this.objS.pos2D = this.objS.pos2D.addScaled(this.objS.velo2D, this.dt);

            this.objF.changeStyles();
            this.objS.changeStyles();
        },

        checkCollision: function () {
            var dist = this.objF.pos2D.subtract(this.objS.pos2D);

            // Произошел удар
            if (dist.length() - this.objF.radius <= 0) {
                var temp = this.objF.velo2D;
                this.objF.velo2D = this.objS.velo2D;
                this.objS.velo2D = temp;
            }

            // Остановка
            if(this.objF.x < this.objF.radius / 2 && this.objS.x > this.winW ) {
                this.stopAnimate();
            }
        }
    };

    $.fn.collisionObject = function (ops) {
        var options = $.extend({}, $.fn.collisionObject.options, ops);
        var $this = this.first();

        if ($this.data('init')) {
            return false;
        }

        $this.data('init', true);

        var newCollision = Object.create(collisionObject);
        collisionObject.init($this, options);
    };

    $.fn.collisionObject.options = {
        $firstObj: '.Collision-ball--first',
        $secondObj: '.Collision-ball--second',
        velo: 40
    };

    window.onload = function () {
        var $collisionItem = $('.Collision-item');

        $collisionItem.collisionObject();
    };
}());

