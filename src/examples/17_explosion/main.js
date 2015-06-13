;(function () {
    var $container = $('.Squares');
    var $objs;

    var sizeEl = 50;
    var objs = [];
    var timer;
    var allInHome;
    var cursorForceZoomed = 150000;
    var damping = 0.85;

    var cursorPos2D = new Vector2D(0, 0);

    var mousePos = new Vector2D(-1, -1);

    var winW = $(window).width();
    var winH = $(window).height();

    window.onload = events();

    function events() {
        $.Window.resize(updateResize);
        startMove();
    }

    function updateResize() {
        winW = $(window).width();
        winH = $(window).height();

        clearAndCreateEls();
        createEls();
    }

    function clearAndCreateEls() {
        $container.empty();
        $.Body.off('mousemove');
        $.Body.off('mouseleave');
        clearInterval(timer);
    }

    function startMove() {
        createEls();

        $.Body
            .on('mousedown', mouseDown);

        start();
    }

    function mouseDown(evt) {
        mousePos = new Vector2D(evt.pageX, evt.pageY);
        allInHome = false;
        start();
    }

    function createEls() {
        objs = [];

        var hEl = sizeEl;
        var wEl = sizeEl;
        var lenW = winW / wEl + 1;
        var lenH = winH / hEl + 1;
        var num = 0;

        for (var i = 0; i < lenW; i++) {
            for (var j = 0; j < lenH; j++) {
                var $obj = $('<div class="Squares-item" style="width: ' + hEl + 'px; height: ' + wEl + 'px;"></div>');

                var x = wEl * i;
                var y = hEl * j;

                $container.append($obj);

                // Задаем объект и рисуем положение объекта
                var newObj = new Obj({$el: $obj});
                newObj.pos2D = new Vector2D(x, y);
                newObj.home2D = new Vector2D(x, y);
                newObj.velo2D = new Vector2D(1, 1);
                newObj.changeStyles();

                objs.push(newObj);
            }
        }

        $objs = $container.find('.Squires-item');
    }

    function start() {
        if (timer) {
            return;
        }
        timer = setInterval(onTimer, 30);
    }

    function onTimer() {
        if (!objs || objs.length == 0) {
            return;
            clearInterval(timer);
        }
        if (!allInHome) {
            moveObjs();
        }
    }

    function moveObjs() {
        var i;
        var obj;
        var deltaObj;
        var deltaCursor;
        var homeSin;
        var homeCos;
        var homeForce;
        var homeDistance;
        var homeDistanceReverse;
        var cursorSin;
        var cursorCos;
        var cursorForce;
        var cursorDistance;
        var cursorDistanceReverse;
        var cursorDistanceSquared;

        var inHome = 0;
        for (i = objs.length; i--;) {
            obj = objs[i];
            deltaObj = obj.home2D.subtract(obj.pos2D);

            homeDistance = deltaObj.length();
            if (homeDistance < 0.00001) {
                homeDistance = 0.00001;
            }
            homeDistanceReverse = 1 / homeDistance;
            homeSin = deltaObj.y * homeDistanceReverse;
            homeCos = deltaObj.x * homeDistanceReverse;

            homeForce = homeDistance * 0.01;
            cursorForce = 0;
            cursorSin = 0;
            cursorCos = 0;

            if (mousePos.x >= 0) {
                deltaCursor = obj.pos2D.subtract(mousePos);
                cursorDistanceSquared = deltaCursor.lengthSquared();
                if (cursorDistanceSquared > 1 && cursorDistanceSquared <= cursorForceZoomed) {
                    cursorForce = cursorForceZoomed / cursorDistanceSquared;

                    if (cursorForce > 15) {
                        cursorForce = 15;
                    }
                    cursorDistance = deltaCursor.length();
                    cursorDistanceReverse = 1 / cursorDistance;
                    cursorSin = deltaCursor.y * cursorDistanceReverse;
                    cursorCos = deltaCursor.x * cursorDistanceReverse;
                }
            }

            // Обновление скорости
            obj.velo2D = obj.velo2D.add(new Vector2D(homeForce * homeCos + cursorForce * cursorCos,
                                                     homeForce * homeSin + cursorForce * cursorSin));
            obj.velo2D = obj.velo2D.multiply(damping);
            obj.pos2D = obj.pos2D.add(obj.velo2D);

            if (Math.abs(obj.x) < 0.5 &&
                Math.abs(obj.y) < 0.5 &&
                Math.abs(obj.vx) < 0.5 &&
                Math.abs(obj.vy) < 0.5) {

                obj.velo2D = new Vector2D(0, 0);
                obj.pos2D = new Vector2D(obj.hx, obj.hy);
                inHome++;
            }

            // Обновление стилей
            obj.changeStyles();
        }
        allInHome = inHome == objs.length;
    }
}());
