/**
 * 拖拽、缩放
 */
let dragZoom = {
    $ele: null,
    options: {},
    
    /**
     * 初始化
     */
    init(ele, opt){
        this.setOptions(ele, opt);
        this.dragEvent();   // 拖拽
        this.zoomEvent();   // 缩放
        //ele.contextmenu(() => false); //阻止右键默认事件
        window.onresize = () => this.parentWidth = this.$ele.parent().width();
	},
	
	/**
     * 设置参数
     */
	setOptions(ele, opt){
		let defaults = {
	        min: 1,
	        max: 5,
	        speed: 0.1, // 缩放速率
	    }
        this.options = Object.assign(defaults, opt);
        this.$ele = ele;
    },
    
    /**
     * 拖拽
     */
    dragEvent(){
        let disX, disY, move = 0;

        //按下
        this.$ele.mousedown(e => {
            move = 1;
            disX = e.clientX - this.$ele.offset().left;
            disY = e.clientY - this.$ele.offset().top;
            this.$ele.css("cursor", "-webkit-grab");
        });
        //移动
        this.$ele.mousemove(e => {
            if(move){
                let left = e.clientX - disX,
                    top = e.clientY - disY;
                this.$ele.offset({left, top});
            }
        });
        //抬起
        this.$ele.on('mouseup mouseleave', () => {
            move = 0;
        });
    },

    /**
     * 以鼠标位置为中心缩放
     */
    mouse: {},  //鼠标当前位置
    parentWidth: 0,
	zoomEvent() {
        this.parentWidth = this.$ele.parent().width();
        this.$ele.on('mousewheel', e => {
            this.mouse.x = e.pageX;
            this.mouse.y = e.pageY;
            let delta;
            if(e.originalEvent.wheelDelta > 0) {
                delta = 1;
                this.$ele.css("cursor", "zoom-in");
            }else {
                delta = 0;
                this.$ele.css("cursor", "zoom-out");
            }
            this.setPostion(delta);
			return false;
        })
	},
    
    /**
     * 改变样式 1: 放大  0: 缩小
     */
	setPostion(delta){
        let that = this.$ele,
            w0 = that.width(),
		    h0 = that.height(),
            rate = delta ? 1 + this.options.speed : 1 - this.options.speed,
            scale = w0 / this.parentWidth;
        if(scale < this.options.min && delta == 0) return;
        if(scale > this.options.max && delta == 1) return;
        that.width(w0 * rate).height(h0 * rate).offset({
            left: this.mouse.x - that.width() * (this.mouse.x - that.offset().left) / w0,
            top: this.mouse.y - that.height() * (this.mouse.y - that.offset().top) / h0
        });
	},
};

export default dragZoom;
