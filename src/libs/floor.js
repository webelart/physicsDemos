;(function (window) {
    function Floor(ops) {
        this.$el = ops.$el;
        this.b1 = ops.b1;
        this.b2 = ops.b2;

        this.prefix = this.getPrefix();
        this.prefixJs = this.prefix.js;
    }

    Floor.prototype = {
        draw: function () {
            var dist = this.b2.subtract(this.b1);
            var hypotenuse = dist.length();

            this.$el.width(hypotenuse);

            var angRad = Math.asin(dist.y / hypotenuse);
            var angGrad = angRad * 180 / Math.PI;

            this.$el.css(this.prefixJs + 'Transform', 'translate3d(' + this.b1.x + 'px, ' + this.b1.y + 'px, 0) rotate(' + angGrad + 'deg)');
        },

        get displ (){
            return this.b2.subtract(this.b1);
        },

        get normal (){
            return this.displ.perp(1);
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
        }
    };

    window.Floor = Floor;
} (window));
