;(function () {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var bouncingGallery = {
        init: function ($el, ops) {
            this.$el = $el;
            this.ops = ops;

            this.objs = [];
            this.t0 = 0;
            this.g = 80;
            this.k = 0;

            this.vfac = 0.4;

            this.winH = $.Window.height();
            this.winW = $.Window.height();

            this.$slides = $el.find(this.ops.$slide);
            this.createObjs();
        },

        createObjs: function () {
            var _this = this;
            var len = this.$slides.length;
            var j = 0;
            var j2 = 0;

            this.animFrame();

            for (var i = len; i; i--) {
                (function (i) {
                    setTimeout(function () {
                        var params = {};

                        params.$el = _this.$slides.eq(i - 1);
                        params.$el.data('index', j);
                        params.mass = 10;

                        _this.objs.push(new Obj(params));
                        _this.objs[j].pos = new Vector(0, -_this.winH);
                        _this.objs[j].floor = new Vector(0, 0);
                        _this.objs[j].isDragging = false;
                        _this.objs[j].changeStyles();

                        _this.objs[j].$el.on('mousedown', function (evt) {
                            _this.mouseDown(evt, _this.objs[parseInt($(this).data('index'))]);
                        });
                        _this.objs[j].$el.on('mouseup', function (evt) {
                            _this.mouseUp(evt, _this.objs[parseInt($(this).data('index'))]);
                        });
                        _this.objs[j].$el.on('mousemove', function (evt) {
                            _this.mouseMove(evt, _this.objs[parseInt($(this).data('index'))]);
                        });

                        j += 1;

                    }, (len - i)  * 2000);
                } (i));
            }
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

        mouseDown: function (evt, obj) {
            obj.isDragging = true;
            obj.lastCoord = evt.clientY;
        },

        mouseUp: function (evt, obj) {
            obj.isDragging = false;

            if (Math.abs(obj.y) < this.winH / 2) {
                obj.slideToUp = false;
            } else {
                obj.slideToUp = true;
            }

            obj.vy = 0;
        },

        mouseMove: function (evt, obj) {
            if (!obj.isDragging) {
                return;
            }

            var y = evt.clientY;

            if (y < obj.lastCoord) {
                obj.y -= (obj.lastCoord - y);
            } else {
                obj.y += (y - obj.lastCoord);
            }

            obj.changeStyles();

            obj.lastCoord = y;
        },

        move: function () {
            for (var i = 0, len = this.objs.length; i < len; i++) {
                var obj = this.objs[i];

                if (obj && !obj.isDragging) {
                    this.moveObject(obj);
                    this.calcForce(obj);
                    this.updateAccel(obj);
                    this.updateVelo(obj);
                    this.checkBounce(obj);
                }
            }
        },

        moveObject: function (obj) {
            if (!obj.isDragging) {
                obj.pos = obj.pos.addScaled(obj.velo, this.dt);
                obj.changeStyles();
            }
        },

        checkBounce: function (obj) {
            var displ = obj.floor.subtract(obj.pos);
            if (displ.y <= 0) {
                obj.y = obj.floor.y;
                obj.vy *= -this.vfac;
            }
        },

        calcForce: function (obj) {
            obj.force = new Vector(0, obj.mass * this.g - this.k * obj.vy);
            if (obj.slideToUp) {
                obj.force.negate();
            }
        },

        updateAccel: function (obj) {
            obj.acc = obj.force.multiply(1 / obj.mass);
        },

        updateVelo: function (obj) {
            obj.velo = obj.velo.addScaled(obj.acc, this.dt);
        }
    };

    $.fn.bouncingGallery = function (ops) {
        var options = $.extend({}, $.fn.bouncingGallery.options, ops);

        this.each(function () {
            var $this = $(this);

            if ($this.data('init')) {
                return false;
            }

            $this.data('init', true);

            var newGallery = Object.create(bouncingGallery);
            newGallery.init($this, options);
        });
    };

    $.fn.bouncingGallery.options = {
        $slide: '.Story-slide'
    };

    window.onload = function () {
        var $container = $('.Story');

        $container.bouncingGallery();
    };
}());

