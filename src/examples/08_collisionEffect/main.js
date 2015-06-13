;(function () {
    var collisionObject = {
        init: function ($el, ops) {
            var _this = this;

            this.$el = $el;
            this.ops = ops;
            this.$items = $el.find('.Collision-item');
            this.items = [];
            this.activeItems = [];

            this.winW = $.Window.width();
            this.wEl = Math.ceil(this.winW / 2);

            this.$items.each(function () {
                _this.getVars($(this));
            });

            _this.activeItems.push(_this.items[0]);

            this.startAnimation();

            for (var i = 1, len = this.$items.length; i < len; i++) {
                (function (i) {

                    setTimeout(function () {
                        _this.activeItems.push(_this.items[i]);
                    }, i * 300);
                } (i));
            }
        },

        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getVars: function ($el) {
            var $el = $el;
            var thisProperties = {};
            this.t0 = 0;

            thisProperties.$firstObj = $el.find(this.ops.$firstObj);
            thisProperties.$secondObj = $el.find(this.ops.$secondObj);
            thisProperties.$lineHide = $el.find(this.ops.$hideLine);

            thisProperties.objF = new Obj({
                $el: thisProperties.$firstObj
            });

            thisProperties.objS = new Obj({
                $el: thisProperties.$secondObj
            });

            // Задаем начальную позицию
            thisProperties.objF.pos2D = new Vector2D(0, 0);
            thisProperties.objS.pos2D = new Vector2D(this.wEl * 3 + 10, 0);

            thisProperties.objF.end2D = new Vector2D(this.wEl - 10, 0);
            thisProperties.objS.end2D = new Vector2D(this.wEl * 2 + 10, 0);

            // Задаем скорость
            thisProperties.objF.velo2D = new Vector2D(this.ops.velo, 0);
            thisProperties.objS.velo2D = new Vector2D(-this.ops.velo, 0);

            // Рисуем объекты
            thisProperties.objF.changeStyles();
            thisProperties.objS.changeStyles();

            this.items.push(thisProperties);
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
            var len = this.activeItems.length;

            for (var i = 0; i < len; i++) {
                var objEl = this.activeItems[i];
                objEl.objF.pos2D = objEl.objF.pos2D.addScaled(objEl.objF.velo2D, this.dt);
                objEl.objS.pos2D = objEl.objS.pos2D.addScaled(objEl.objS.velo2D, this.dt);

                objEl.objF.changeStyles();
                objEl.objS.changeStyles();
            }
        },

        checkCollision: function () {
            var len = this.activeItems.length;

            for (var i = 0; i < len; i++) {
                var objEl = this.activeItems[i];

                if (objEl) {
                    var dist = objEl.objF.pos2D.subtract(objEl.objS.pos2D);

                    // Произошел удар
                    if (objEl.objF.x >= objEl.objF.end2D.x) {
                        objEl.$lineHide.hide();
                        var temp = objEl.objF.velo2D;
                        objEl.objF.velo2D = objEl.objS.velo2D;
                        objEl.objS.velo2D = temp;
                    }

                    // Остановка
                    if (objEl.objF.x < -this.wEl - 10) {
                        this.activeItems.splice(i, 1);
                    }
                }
            }

            if (len === 0) {
                this.stopAnimate();
            }
        }
    };

    $.fn.collisionObject = function (ops) {
        var options = $.extend({}, $.fn.collisionObject.options, ops);
        var $container = this.first();

        if ($container.data('init')) {
            return false;
        }
        $container.data('init', true);

        var newCollision = Object.create(collisionObject);
        collisionObject.init($container, options);
    };

    $.fn.collisionObject.options = {
        $firstObj: '.Collision-line--first',
        $secondObj: '.Collision-line--second',
        $hideLine: '.Collision-hideLine',
        velo: 80
    };

    window.onload = function () {
        var winH = $.Window.height();
        var countLine = 40;
        var hLine = Math.ceil(winH / countLine);
        var $container = $('.Collision');

        for (var i = 0; i < countLine; i++) {

            var $el = $('<div class="Collision-item">' +
                            '<div class="Collision-line Collision-line--first"></div>' +
                            '<div class="Collision-line Collision-line--second"></div>' +
                            '<div class="Collision-hideLine"></div>' +
                        '</div>');
            $container.append($el);
            $el.css({
                height: hLine + 'px'
            });
        }

        var $items = $container.find('.Collision-item');

        $container.collisionObject();
    };
}());

