/**
 * H5移动端手势缩放
 * author: huxiaongdong
 */
import $ from '../../static/js/zepto.min.js';
import AlloyFinger from '../../static/js/alloy_finger.min.js';
let v_touch = {

    /**
     * 默认参数
     */
    default: {
        min: 1,
        max: 5,
        speed: 2
    },

    $ele: '',
    scaleVal: 1,
    rotateVal: 0,
    left: 0,
    top: 0,

    /**
     * 初始化
     * @param {*} ele DOM
     * @param {*} opt 参数
     */
    init(ele, opt) {
        this.getDomData(ele, opt);
        this.drag();
        this.zoom();
        //this.rotate();
        this.doubleTap();
    },

    /**
     * 获取DOM初始数据
     */
    getDomData(ele, opt) {
        this.$ele = $(ele);
        this.default = Object.assign(this.default, opt);
        this.alloyFinger = new AlloyFinger(this.$ele[0], {});
        this.width = this.$ele.width();
        this.height = this.$ele.height();
    },

    /**
     * 拖拽
     */
    drag() {
        this.alloyFinger.on('touchStart', ev => ev.preventDefault());
        this.alloyFinger.on('pressMove', ev => {
            this.left += ev.deltaX;
            this.top += ev.deltaY;
            this.setStyle();
        });
    },

    /**
     * 缩放
     */
    zoom() {
        let currentScale = this.scaleVal;
        this.alloyFinger.on('pinch', ev => {
            this.isZoom = true;
            currentScale = this.scaleLimit(this.scaleVal * ev.zoom);
            let x = (ev.touches[0].pageX + ev.touches[1].pageX) / 2,
                y = (ev.touches[0].pageY + ev.touches[1].pageY) / 2;
            this.computeLeftTop(x, y, currentScale);
            this.setStyle({ scale: currentScale });
        });

        // 多指触控结束,0个或1个触发
        this.alloyFinger.on('multipointEnd', () => {
            if(this.isZoom) {
                this.isZoom = false;
                this.scaleVal = currentScale;
            }
            /* if(this.isRotate) {
                this.isRotate = false;
                if (this.rotateVal < 0) this.rotateVal = 360 + this.rotateVal;

                let remainder =  this.rotateVal % 180;
                if(remainder <= 90) {
                    this.rotateVal -= remainder;
                }else {
                    this.rotateVal += (180 - remainder);
                }
                log(this.rotateVal);
                this.$ele.css({
                    transform: 'rotate(' + this.rotateVal + 'deg)',
                    transition: 'transform 0.5s'
                })
            } */
        });
    },

    /**
     * 双击
     */
    doubleTap() {
        this.alloyFinger.on('doubleTap', ev => {
            if(this.isAnimated) return;
            this.scaleVal = this.scaleLimit(this.scaleVal * this.default.speed);
            this.computeLeftTop(ev.changedTouches[0].pageX, ev.changedTouches[0].pageY);
            this.setStyle({isAnimate: true});
        });
    },

    /**
     * 旋转
     */
    rotate() {
        this.alloyFinger.on('rotate', ev => {
            this.isRotate = true;
            let x = (ev.touches[0].pageX + ev.touches[1].pageX) / 2 - this.left,
                y = (ev.touches[0].pageY + ev.touches[1].pageY) / 2 - this.top;
            this.rotateVal += ev.angle;
            this.$ele.css({
                'transition': 'initial',
                'transform-origin': x + 'px ' + y + 'px',
                'transform': 'rotate(' + this.rotateVal + 'deg)'
            });
        });
    },

    /**
     * 点击缩放
     * @param {*} flag  true: 放大， fasle:缩小
     */
    clickZoom(flag) {
        if(this.isAnimated) return;
        let scale = flag ? this.scaleVal * this.default.speed : this.scaleVal / this.default.speed,
            x = document.body.clientWidth / 2,
            y = document.body.clientHeight / 2;
        this.scaleVal = this.scaleLimit(scale);
        this.computeLeftTop(x, y);
        this.setStyle({isAnimate: true});
    },

    /**
     * 计算left，top
     */
    computeLeftTop(x, y, scale = this.scaleVal) {
        this.left = x - this.width * scale * (x - this.left) / this.$ele.width();
        this.top = y - this.height * scale * (y - this.top) / this.$ele.height();
    },

    /**
     * 缩放范围限制
     */
    scaleLimit(scale = this.scaleVal) {
        if (this.default.min > scale) {
            scale = this.default.min
        }
        if (this.default.max < scale) {
            scale = this.default.max
        }
        return scale;
    },

    /**
     * 设置样式
     */
    setStyle(opteion = {}) {
        let css = {
            width: this.width * (opteion.scale || this.scaleVal),
            height: this.height * (opteion.scale || this.scaleVal),
			left: this.left + 'px',
            top: this.top + 'px',
        }
        if(opteion.isAnimate) {
            this.isAnimated = true;
            this.$ele.animate(css, 500, this.ease(500), () => this.isAnimated = false);
        }else {
            this.$ele.css(css);
        }
    },

    ease(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    },
};
export default v_touch;