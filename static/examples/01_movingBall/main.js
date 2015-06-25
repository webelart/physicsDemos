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
        dt = 0.05; /* По сути время представляет собой константу,
                      которая при стабильной работе компьютера, без задержек равна примерно 17 = 1000/60 (60 кадров в секунду).
                      Т.е. величина как мы видим постоянная. В примерах взято число, т.к. если вдруг компьютер не стабилен, то при
                      четком расчете времени анимация прыгает, а если число, то она просто задерживается (тоже не хорошо, но выглядет менее заметно).
                      Еще хочется отметить, что в наших примерах не нужна супер четкая зависимость от времени, но время нам нужно для формул. */

        // var t1 = new Date().getTime();
        // dt = t1 - t0;

        // dt *= 0.004; // Сглаживающая величина, чтобы объект не перемещался сразу на много пикселей.
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

