;(function () {
    var $cont = $('.container');
    var $ball = $('.ball');
    var contW = $.Window.width();
    var contH = $.Window.height();
    var obj;
    var t0 = 0;

    var animFunc = undefined;
    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $ball
        });

        obj.pos2D = new Vector2D(10, 0);
        obj.velo2D = new Vector2D(60, 0);
        obj.end2D = new Vector2D(contW - 15 - $ball.width(), 0);

        setTimeout(function () {
            startAnimate();
        }, 1500);
    }

    function startAnimate() {
        animFunc = requestAnimationFrame(startAnimate);
        onTimer();
    }

    function stopAnimate() {
        cancelAnimationFrame(animFunc);
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.001 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {
            dt = 0;
        };
        move();
    }

    function move() {
        obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
        obj.changeStyles();

        if (obj.pos2D.greater(obj.end2D)) {
            stopAnimate();
        }
    }
}());

