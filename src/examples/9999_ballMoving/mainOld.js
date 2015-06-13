;(function () {
    var $ball = $('.Ball');
    var obj;
    var winW = $.Window.width();
    var winH = $.Window.height();
    var forceZoom = 500;
    var objs = [];
    var m = 1;

    var mousePos = new Vector2D(0, 0);
    var hForce;
    var mForce;
    var kForce = 0.8;

    firstPositioned();
    function firstPositioned() {
        obj = new Obj(50, 50, 1, 0, $ball);
        var homeX = (winW - obj.w) / 2;
        var homeY = (winH - obj.h) / 2;
        obj.home2D = new Vector2D(homeX, homeY);
        obj.pos2D = new Vector2D(homeX, homeY);
        obj.velo2D = new Vector2D(1, 1);

        changeCss(obj);
    }

    function Pixels($el, x, y) {
        this.$el = $el;
        this.home = new Vector2D(x, y);
        this.velo = new Vector2D(1, 1);
    }

    function changeCss(obj) {
        obj.$el.css('transform', 'translate3d(' + obj.x + 'px,'  + obj.y + 'px, 0)');
    }

    window.onload = init;

    function init() {
        $.Body.on('mouseenter', mouseStart);
        $.Body.on('mousemove', mouseMove);
        $.Body.on('mouseleave', mouseEnd);

        animFrame();
    }

    function mouseStart() {

    }

    function mouseMove(evt) {
        mousePos = new Vector2D(evt.pageX, evt.pageY);
    }

    function mouseEnd() {

    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        moveObj();
    }

    function moveObj() {
        var homeDistanceReverse;
        var homeSin;
        var homeCos;

        // Дистанция от элемента от дома
        var hSub = obj.home2D.subtract(obj.pos2D);
        var hDist = hSub.length();
        hForce = hDist * 0.01;
        hDistRev = 1 / hDist;
        hSin = hSub.y * hDistRev;
        hCos = hSub.x * hDistRev;

        if (mousePos.x > 0) {
            // Дистанция от мышки от дома
            var mSub = obj.pos2D.subtract(mousePos);
            var mDist = mSub.length();
            mDistRev = 1 / mDist;
            mSin = mSub.y * mDistRev;
            mCos = mSub.x * mDistRev;

            if (mDist > 1 && mDist <= forceZoom) {
                mForce = forceZoom / mDist;
                if (mForce >= 15) {
                    mForce = 15;
                }

                p.xVelocity += homeForce * homeCos + cursorForce * cursorCos;
                p.yVelocity += homeForce * homeSin + cursorForce * cursorSin;
            }
        }

        calcForce(hForce, mForce);
    }

    function calcForce() {
        force = Forces.add([restoring, damping]);
    }

    function updateAccel() {
        acc = force.multiply(1 / m);
    }

    function updateVelo(obj) {
        obj.velo2D = obj.velo2D.addScaled(acc, dt);
    }
}());

