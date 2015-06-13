;(function () {
    var $obj = $('.ball');
    var $body = $('body');

    var obj;
    var wall;
    var floor;
    var m = 10;
    var g = 10;
    var vfac = 0.7;
    var k = 0;
    var t0;
    var dt;
    var force;
    var acc;
    var animId;
    var winW = $.Window.width();
    var winH = $.Window.height();
    var isDragging = false;
    var floorH = 40;

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $obj,
            m: m,
            radius: 100
        });

        obj.pos2D = new Vector2D(winW / 2 - obj.radius, 0);
        floor = new Vector2D(0, winH - floorH);
        wall = new Wall(new Vector2D(0, winH - floorH), new Vector2D(winW, winH - floorH));

        initAnim();

        $obj.on('mousedown', mouseDown);
        $body.add($obj).on('mouseup', mouseUp);
        $body.add($obj).on('mousemove', mouseMove);
    }

    function initAnim() {
        t0 = new Date().getTime();
        animFrame();
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function stopAnimate() {
        cancelAnimationFrame(animId);
    }

    function mouseDown() {
        isDragging = true;
        stopAnimate();
    }

    function mouseUp() {
        isDragging = false;
        animFrame();
    }

    function mouseMove(evt) {
        if (!isDragging) {
            return;
        }

        obj.pos2D = new Vector2D(evt.pageX - obj.radius / 2, evt.pageY - obj.radius / 2);
        obj.changeStyles();
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.004 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {
            dt = 0;
        }
        move();
    }

    function move() {
        moveObject();
        checkBounce()
        calcForce();
        updateAccel();
        updateVelo();
    }

    function moveObject() {
        if (!isDragging) {
            obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
            obj.changeStyles();
        }
    }

    function checkBounce() {
        var wdir = wall.dir;
        // vectors from ball to endpoints of wall
        var ballp1 = wall.p1.subtract(obj.pos2D);
        var ballp2 = wall.p2.subtract(obj.pos2D);
        // projection of above vectors onto wall vector
        var proj1 = ballp1.projection(wdir);                
        var proj2 = ballp2.projection(wdir);
        // perpendicular distance vector from the object to the wall
        var dist = ballp1.addScaled(wdir.unit(), proj1*(-1));
        // collision detection

        if ((dist.length() < obj.radius)){
            // angle between velocity and wall
            var angle = Vector2D.angleBetween(obj.velo2D, wdir);
            // reposition object
            var normal = wall.normal;

            if (normal.dotProduct(obj.velo2D) > 0){
                normal.scaleBy(-1);
            }
            
            var deltaS = (obj.radius+dist.dotProduct(normal));
            var displ = obj.velo2D.para(deltaS);
            obj.pos2D = obj.pos2D.subtract(displ);
            //obj.y -= 0.1; // fake contact resolution when sliding 
            // velocity correction factor
            var vcor = 1-acc.dotProduct(displ)/obj.velo2D.lengthSquared();
            // corrected velocity vector just before impact 
            var Velo = obj.velo2D.multiply(vcor);
            // velocity vector component perpendicular to wall just before impact
            var normalVelo = dist.para(Velo.projection(dist));
            // velocity vector component parallel to wall; unchanged by impact
            var tangentVelo = Velo.subtract(normalVelo);
            // velocity vector component perpendicular to wall just after impact
            obj.velo2D = tangentVelo.addScaled(normalVelo,-vfac);
        }
    }

    function calcForce() {
        force = new Vector2D(0, m * g - k * obj.vy);
    }

    function updateAccel() {
        acc = force.multiply(1 / m);
    }

    function updateVelo() {
        obj.velo2D = obj.velo2D.addScaled(acc, dt);
        
        obj.vx = 0;
    }

    function stop() {
        cancelAnimationFrame(animId);
    }

}());

