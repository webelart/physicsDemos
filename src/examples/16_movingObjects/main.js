;(function () {
    var $container = $('.Squares');
    var $objs;

    var sizeEl = 50;
    var objs = [];
    var animId;
    var allInHome;
    var mouseForceZoomed = 50000;
    var damping = 0.85;
    var inHome = 0;
    var m = 1;
    var acc;
    var dt;

    var displObj;
    var displCursor;
    var homeSin;
    var homeCos;
    var homeForce;
    var homeDistance;
    var homeDistanceReverse;
    var mouseForce;
    var mouseDistance;

    var cursorPos2D = new Vector2D(0, 0);

    var mousePos = new Vector2D(-1, -1);

    var winW = $(window).width();
    var winH = $(window).height();
    var t0 = 0;

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
        stopAnimate();
    }

    function startMove() {
        createEls();

        $.Body
            .on('mousemove', mouseMove)
            .on('mouseleave', mouseEnd);

        animFrame();
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
                newObj.velo2D = new Vector2D(0, 0);
                newObj.changeStyles();
                newObj.force = new Vector2D(0, 0);
                newObj.acc = new Vector2D(0, 0);

                objs.push(newObj);
            }
        }

        $objs = $container.find('.Squires-item');
    }

    function mouseMove(evt) {
        mousePos = new Vector2D(evt.pageX, evt.pageY);
        allInHome = false;
    }

    function mouseEnd() {
        mousePos = new Vector2D(-1, -1);
        allInHome = false;
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function stopAnimate() {
        setTimeout(func, 1000 / fps);
        cancelAnimationFrame(animId);
    }

    function start() {
        if (timer) {
            return;
        }

        animFrame();
    }

    function move() {
        inHome = 0;

        for (var i = objs.length; i--;) {
            var obj = objs[i];

            calcForce(obj);
            updateAccel(obj);
            updateVelo(obj);
            moveObjs(obj);
            checkObj(obj);
        }

        allInHome = inHome == objs.length;
    }

    function onTimer() {
        if (!objs || objs.length == 0) {
            return;
            stopAnimate();
        }
        if (!allInHome) {
            var t1 = new Date().getTime();
            dt = 0.007 * (t1 - t0);
            t0 = t1;

            if (dt > 2) {
                dt = 0;
            }
            move();
        }
    }

    function moveObjs(obj) {
        obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);

        // Обновление стилей
        obj.changeStyles();
    }

    function calcForce(obj) {
        displObj = obj.pos2D.subtract(obj.home2D);

        mouseForce = new Vector2D(0, 0);

        if (mousePos.x >= 0) {
            displCursor = obj.pos2D.subtract(mousePos);
            mouseDistance = displCursor.length();
            if (mouseDistance > 1 && mouseDistance <= mouseForceZoomed) {
                mouseForce = displCursor.multiply(mouseForceZoomed / (mouseDistance * mouseDistance));
            }
        }

        // Обновление скорости
        var objForce = Forces.spring(1, displObj);

        obj.force = Forces.add([objForce, mouseForce]);
    }

    function updateAccel(obj) {
        obj.acc = obj.force.multiply(1 / m);
    }

    function updateVelo(obj) {
        obj.velo2D = obj.velo2D.addScaled(obj.acc, dt);
        obj.velo2D = obj.velo2D.multiply(damping);
    }

    function checkObj(obj) {
        if (Math.abs(obj.x) < 0.5 &&
            Math.abs(obj.y) < 0.5 &&
            Math.abs(obj.vx) < 0.5 &&
            Math.abs(obj.vy) < 0.5) {

            obj.velo2D = new Vector2D(0, 0);
            obj.pos2D = new Vector2D(obj.hx, obj.hy);
            inHome++;
        }
    }
}());
