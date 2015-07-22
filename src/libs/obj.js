;(function (window) {
    var Obj = function (ops) {
        this.$el = (ops.$el) ? ops.$el : undefined;
        this.el = (ops.el) ? ops.el : undefined;
        this.w = this.checkProperty(ops.w, 20);
        this.h = this.checkProperty(ops.h, 20);
        this.mass = this.checkProperty(ops.mass, 1);
        this.radius = this.checkProperty(ops.radius, 0);
        this.diameter = this.checkProperty(ops.radius * 2, 0)
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.hx = 0;
        this.hy = 0;
        this.ex = 0;
        this.ey = 0;
        this.prefix = this.getPrefix();
        this.prefixJs = this.prefix.js;
    };

    Obj.prototype = {
        get home () {
            return new Vector(this.hx, this.hy);
        },

        set home (home) {
            this.hx = home.x;
            this.hy = home.y;
        },

        get pos () {
            return new Vector(this.x, this.y);
        },

        set pos (pos) {
            this.x = pos.x;
            this.y = pos.y;
        },

        get velo () {
            return new Vector(this.vx, this.vy);
        },

        set velo (velo) {
            this.vx = velo.x;
            this.vy = velo.y;
        },

        get end () {
            return new Vector(this.ex, this.ey);
        },

        set end (end) {
            this.ex = end.x;
            this.ey = end.y;
        },

        checkProperty: function (param, val) {
            var newParam = param;
            if (typeof(newParam) === 'undefined') {
                newParam = val;
            }

            return newParam;
        },

        getPrefix: function () {
            var styles = window.getComputedStyle(document.documentElement, '');
            var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) ||
                    (styles.OLink === '' && ['', 'o']))[1];
            var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
            return {
                dom: dom,
                lowercase: pre,
                css: '-' + pre + '-',
                js: pre[0].toUpperCase() + pre.substr(1)
            };
        },

        changeStyles: function () {
            this.$el.css(this.prefixJs + 'Transform', 'translate3d(' + this.x + 'px, ' + this.y + 'px, 0)');
        }
    };

    window.Obj = Obj;

} (window));

