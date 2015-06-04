;(function () {
    var $container = $('.Squares');
    var $objs;

    var innerZoom = 1;
    var radius = 50;
    var pixels = [];
    var timer;
    var allInHome;

    var mx;
    var my;

    var winW = $(window).width();
    var winH = $(window).height();

    window.onload = startMove();

    function startMove() {
        innerZoom = 1;
        pixels = [];

        createEls();

        $.Body
            .on('mousemove', mouseMove)
            .on('mouseleave', mouseEnd);

        start();
    }

    function createEls() {
        var hEl = 50;
        var wEl = 50;
        var lenW = winW / wEl + 1;
        var lenH = winH / hEl + 1;
        var num = 0;

        for (var i = 0; i < lenW; i++) {
            for (var j = 0; j < lenH; j++) {
                var $obj = $('<div class="Squares-item" style="width: ' + hEl + 'px; height: ' + wEl + 'px;"></div>');

                var x = wEl * i;
                var y = hEl * j;

                $container.append($obj);
                changeCss($obj, x, y);
                pixels.push(new Pixel($obj, x, y));
            }
        }

        $objs = $container.find('.Squires-item');
    }

    function mouseMove(evt) {
        mx = evt.pageX;
        my = evt.pageY;
        allInHome = false;
    }

    function mouseEnd() {
        mx = -1;
        my = -1;
        allInHome = false;
    }

    function start() {
        if (timer) {
            return;
        }
        timer = setInterval(onTimer, 30);
    }

    function onTimer() {
        if (!pixels || pixels.length == 0) {
            return;
        }
        if (!allInHome) {
            movePixels();
        }
    }

    function Pixel($el, homeX, homeY) {
        this.$el = $el;
        this.homeX = parseInt(homeX);
        this.homeY = parseInt(homeY);

        this.x = homeX;
        this.y = homeY;
        this.xVelocity = 1;
        this.yVelocity = 1;
    }

    function movePixels() {
        if (!pixels || pixels.length == 0) {
            return;
        }

        var cursorForceZoomed = 300000 * innerZoom * innerZoom;
        var i;
        var p;
        var dx;
        var dy;
        var cx;
        var cy;
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
        for (i = pixels.length; i--;) {
            p = pixels[i];
            dx = p.homeX - p.x;
            dy = p.homeY - p.y;

            homeDistance = Math.sqrt(dx * dx + dy * dy);
            if (homeDistance < 0.00001) {
                homeDistance = 0.00001;
            }
            homeDistanceReverse = 1 / homeDistance;
            homeSin = dy * homeDistanceReverse;
            homeCos = dx * homeDistanceReverse;

            homeForce = homeDistance * 0.01;
            cursorForce = 0;
            cursorSin = 0;
            cursorCos = 0;

            if (mx >= 0) {
                cx = p.x - mx;
                cy = p.y - my;
                cursorDistanceSquared = cx * cx + cy * cy;
                if (cursorDistanceSquared > 1 && cursorDistanceSquared <= cursorForceZoomed) {
                    cursorForce = cursorForceZoomed / cursorDistanceSquared;

                    if (cursorForce > 15) {
                        cursorForce = 15;
                    }
                    cursorDistance = Math.sqrt(cursorDistanceSquared);
                    cursorDistanceReverse = 1 / cursorDistance;
                    cursorSin = cy * cursorDistanceReverse + (i % 10) * 0.01; //some random
                    cursorCos = cx * cursorDistanceReverse + (i % 10) * 0.01;
                }
            }

            p.xVelocity += homeForce * homeCos + cursorForce * cursorCos;
            p.yVelocity += homeForce * homeSin + cursorForce * cursorSin;
            p.xVelocity *= 0.85;
            p.yVelocity *= 0.85;
            p.x += p.xVelocity;
            p.y += p.yVelocity;
            if (Math.abs(dx) < 0.5 &&
                Math.abs(dy) < 0.5 &&
                Math.abs(p.xVelocity) < 0.5 &&
                Math.abs(p.yVelocity) < 0.5) {
                p.xVelocity = 0;
                p.yVelocity = 0;
                p.x = p.homeX + 0.1;
                p.y = p.homeY + 0.1;
                inHome++;
            }

            p.x = p.x;
            p.y = p.y;

            // p.x = (p.x < -100) ? -100 : p.x;
            // p.y = (p.y < -100) ? -100 : p.y;

            changeCss(p.$el, p.x, p.y);
        }
        allInHome = inHome == pixels.length;
    }

    function changeCss($el, x, y) {
        $el.css('transform', 'translate3d(' + x + 'px,'  + y + 'px, 0)');
    }
}());

