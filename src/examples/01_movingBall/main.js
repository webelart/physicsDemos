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

        obj.pos = new Vector(10, 0);
        obj.velo = new Vector(60, 0);
        obj.end = new Vector(contW - 10 - $ball.width(), 0);

        startAnimate();
    }

    function startAnimate() {
        animFunc = requestAnimationFrame(startAnimate);
        onTimer();
    }

    function stopAnimate() {
        cancelAnimationFrame(animFunc);
    }

    function onTimer() {
        dt = 0.05; // Для плавной анимации убираем четкую зависимость от времени.
        // var t1 = new Date().getTime();
        // dt = t1 - t0;

        // if (dt > 15) {
        //     dt = 15;
        // }

        // dt *= 0.004;
        // t0 = t1;

        // if (dt > 0.2) {
        //     dt = 0; // Фиксит баг когда переходим в другую вкладку.
        // }
        move();
    }

    function move() {
        if (obj.pos.greater(obj.end)) {
            obj.pos = obj.end;
            stopAnimate();
        } else {
            obj.pos = obj.pos.addScaled(obj.velo, dt);
        }

        obj.changeStyles();
    }
}());

