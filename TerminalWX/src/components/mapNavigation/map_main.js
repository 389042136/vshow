/**********************
    地图导航方法
 **********************/
import { line_points } from './map_data.js';

/**
 * 地图配置参数
 */
export let map_config = {
	
	lineArrowStep: 26,	// 箭头之间的距离, 越大越密
	lineArrowTime: 0.1, // 箭头走路时间： 越小越快,  单位:s
	stayTime: 1.5,		// 箭头停留时间： 越小停留时间越短,  单位:s
	twoPointsTime: 80,	// 两个箭头间的时间  单位:s
	
	//地图比例参数
	mapScale: {
		scale: 0.5,
		maxScale: 1.5,
		minScale: 1,
	},
	
	//地图分辨率
	iCol: 160,
	iRow: 90,
	
	isSkew: 0,			// 地图中是否有倾斜路线, 0 ： 否    1： 是 
	isReFence: 0,		// 是否渲染障碍物, 1：是    0：否
};

/**
 * 地图方法
 */
export let Map_fun = {
	line_points,

	/**
	 * 初始化地图数据
	 * @param {*} ele  			// 操作的地图DOM
	 * @param {*} start 		// 当前设备位置
	 * @param {*} facilities 	// 设施，登机口数据数据
	 */
	init(ele, start, facilities) {
		this.mapContainer = ele;		// 地图容器
		this.start = this.parseInt(start);	// 当前设备位置
		this.facilities = facilities;	// 机场设施，登机口坐标

		//获取页面元素
		this.getDOM();

		//定义findPath对象
		this.findPathObj();

		this.scaleMap(null, 1);

		//是否执行鼠标事件
		if(map_config.isReFence) {
			drawFence.init();
		};
	},

	/**
	 * 缓存DOM对象，并获取DOM元素大小
	 */
	getDOM() {
		//地图原始宽高
		this.mapWidth = this.mapContainer.width();
		this.mapHeight = this.mapContainer.height();

		//显示地图线路的div
		this.mapLineCon = this.mapContainer.children('.map-line-con');

		//障碍物的大小
		this.fenceSizeW = this.mapWidth  / map_config.iCol;
		this.fenceSizeH = this.mapHeight / map_config.iRow;
	},

	/**
	 * 定义findPath对象
	 */
	findPathObj() {
		let localFence = localStorage.getItem(drawFence.fence_points);
		if(localFence) {	
			//获取到本地存储的内容
			this.line_points = JSON.parse(localFence);
		}else if(this.line_points.length == 0) {
			//设置障碍物  0：可以走   1: 不可走   
			for(let i = 0; i < map_config.iRow; i++) {
				let arr = [];
				for(let j = 0; j < map_config.iCol; j++) {
					arr[j] = 1;
				} 
				this.line_points[i] = arr;
			}
		}
		//这里的两个参数定义了图的长和宽
		/* this.grid = new PF.Grid(map_config.iCol, map_config.iRow, this.line_points); 
		this.finder = new PF.BiBreadthFirstFinder({
			allowDiagonal: true,
			dontCrossCorners: true
		}); */
	},

	/****************************** 地图导航 ********************************** */
	navigationTo(id, obj) {
		if(!obj) {
			let allFac = this.getTypeAllfac(id);
			obj = this.nearestPoint(allFac);	// 获取最近的设施
		}
		if(obj) {
			let destPos = this.parseInt(obj);
			//缩放地图后, 路线
			this.scaleMap(destPos, null, () => this.repeatDrawLine());
		}else{
			//初始化地图，缩放比例：1
			this.scaleMap(null, 1);
		}
		return obj;
	},

	/**
	 * 获取该类型下的所有设施
	 */
	getTypeAllfac(id) {
		let type = this.facilities.find(item => item.leadPointCategoryId == id);
		return type.leadPoints;
	},
	
	/**
	 * 计算距离当前位置最近的设施点
	 * @param {Object} fc
	 */
    nearestPoint(allFac) {
		let diff_min = 10000, point;
		allFac.forEach(item => {
			let diff = Math.hypot(this.start.x - item.leadPointX, this.start.y - item.leadPointY);
   			if(diff < diff_min) {
   				diff_min = diff;
   				point = item;
   			}
		});
   		return point;
   	},
   	
	/**
	 * 转成百分比
	 */
	tranPer(a, b) {
		return a / b * 100 + '%';
	},
	
	/**
	 * 缩放地图
	 * 通过两点间的距离计算缩放比例
	 * @param {Object} scale 放大倍数
	 * @param {Object} to	 无目的坐标时，目的与起始位置相同
	 * @param {Object} callback
	 */
	scaleMap(to, scale, callback) {
		to = to || this.start;

		//当前位置与登机口距离
		let sx = map_config.iCol / Math.abs(this.start.x - to.x) * map_config.mapScale.scale,
			sy = map_config.iRow / Math.abs(this.start.y - to.y) * map_config.mapScale.scale;

		//计算缩放比例, 默认优先
		this.scale = scale || Math.min(sx, sy);
		
		//最大比例
		if(this.scale > map_config.mapScale.maxScale) {
			this.scale = map_config.mapScale.maxScale;
		}
		//最小比例
		if(this.scale < map_config.mapScale.minScale) {
			this.scale = map_config.mapScale.minScale;
		}

		//计算最佳路径
		//this.findBestPath(to);
		
		//改变地图样式 
		this.changeMapStyle(to, callback);

		//清空地图
		this.clearMap();
	},

	/**
	 * 改变地图样式
	 * @param {Object} start 	起始坐标
	 * @param {Object} to	  	目的坐标
	 * @param {Object} callback	回调函数：加载路线
	 */
	changeMapStyle(to, callback) {
		let mapCenterX = map_config.iCol / 2, //地图容器的中心坐标 
			mapCenterY = map_config.iRow / 2,
			
			//放大后的中心坐标
			largeX = (this.start.x + to.x) / 2 * this.scale, 
			largeY = (this.start.y + to.y) / 2 * this.scale,
			
			//距离
			diffX = (largeX - mapCenterX) * this.fenceSizeW,	
			diffY = (largeY - mapCenterY) * this.fenceSizeH;

		this.mapContainer.animate({
			'width' : this.mapWidth * this.scale,
			'height': this.mapHeight * this.scale,
			'left'	: -diffX + 'px',
			'top'	: -diffY + 'px'
		}, 800, 'ease-in-out', function() {
			if(callback) callback();
		});
	},
	
	/**
	 * 寻找最佳路径
	 */
	findBestPath(to) {
		let gridBackup = this.grid.clone(),
			pointArr = this.finder.findPath(this.start.x, this.start.y, to.x, to.y, gridBackup);
		if(pointArr.length > 0) {
			let bezierPoints = this.createBezierPoints(pointArr, pointArr.length);
			this.bestPathArr = this.linePointArr(bezierPoints);
			let minuter = Math.floor((this.bestPathArr.length - 1) * map_config.twoPointsTime / 60);
			log(`需要${ minuter }分钟`);
		} else {
			console.log('无最佳路径');
			this.bestPathArr = '';
		}
	},

	/**
	 * 贝赛尔曲线
	 * @param {Object} anchorpoints
	 * @param {Object} pointsAmount
	 */
	createBezierPoints(anchorpoints, pointsAmount) {
        let points = [];
        for (let i = 0; i < pointsAmount; i++) {
            let point = this.multiPointBezier(anchorpoints, i / pointsAmount);
            points.push(point);
        }
        return points;
   	},
    multiPointBezier(points, t) {
        let len = points.length;
        let x = 0, y = 0;
        let erxiangshi = function (start, to) {
            let cs = 1, bcs = 1;
            while (to > 0) {
                cs *= start;
                bcs *= to;
                start--;
                to--;
            }
            return (cs / bcs);
        };
        for (let i = 0; i < len; i++) {
            let point = points[i];
            x += point[0] * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
            y += point[1] * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
        }
        return { x: x, y: y };
    },
	
	/**
	 * 返回地图上需要显示的坐标点
	 */
	linePointArr(pointArr) {
		let arr = [];
		pointArr.forEach((item, i) => {
			if(i % Math.floor(1 / (this.scale * 0.5) / map_config.lineArrowStep * 100) == 0 || i == pointArr.length-1) {
				arr.push({
					x: item.x,
					y: item.y
				});
			}
		})
		return arr;
	},

	/**
	 * 清空地图
	 */
	clearMap() {
		this.mapLineCon.empty();
		clearInterval(this.addArrowTimer);
	},
	
	/**
	 * 重复绘画线路
	 */
	repeatDrawLine() {
		if(this.bestPathArr) {
			this.clearMap();
			this.recursive(this.bestPathArr.concat());
		}
	},

	/**
	 * 递归
	 */
	recursive(pointArr) {
		this.addArrowTimer = setTimeout(() => {
			clearInterval(this.addArrowTimer);
			if(pointArr.length > 1) {
				this.drawLine(pointArr.shift(), pointArr[0]);
	            this.recursive(pointArr);
	        }else {
				this.addArrowTimer = setTimeout(() => this.repeatDrawLine(), map_config.stayTime * 1000);
			}
		}, map_config.lineArrowTime * 1000);
	},
	

	/**
	 * 绘画导航线路
	 */
	drawLine(current, next) {
		//计算角度
		let angle = this.lineDeg(next, current);

		//转换坐标
		this.addArrow({
			x: Map_fun.tranPer(current.x, map_config.iCol),
			y: Map_fun.tranPer(current.y, map_config.iRow)
		}, angle);
	},

	/**
	 * 计算箭头角度
	 * @param {Object} a 
	 * @param {Object} b b相对于a是原点
	 */
	lineDeg(a, b) {
		let x = Math.abs(a.x - b.x),
			y = Math.abs(a.y - b.y),
			tan = Math.atan(y / x), //用反三角函数求弧度
			angle = Math.round(180 * tan / Math.PI); //将弧度转换成角度
		
		//无倾斜线路，所有角度都是直角
		/*if( !(a.x == b.x || a.y == b.y) && !map_config.isSkew) {
			angle = angle > 45 ? 90 : 0;
		}*/
		
		if(a.x <= b.x && a.y < b.y) { //在第二象限、y轴上
			angle = 180 - angle;
		}

		if(a.x < b.x && a.y >= b.y) { //在第三象限、x轴左
			angle = 180 + angle;
		}

		if(a.x >= b.x && a.y > b.y) { //在第四象限、y轴下
			angle = 360 - angle;
		}

		return '-' + angle;
	},

	/**
	 * 旋转箭头,并添加到地图区域
	 * @param {Object} arrowObj 转换过的箭头坐标{x:x,y:y}
	 * @param {Object} deg 角度
	 */
	addArrow(arrowObj, deg) {
		let temp = `<div class="lineArrow"></div>`;
		$(temp).css({
			left: arrowObj.x,
			top : arrowObj.y,
			transform: 'translate(-50%, -50%) rotate(' + deg + 'deg)',
		}).appendTo(this.mapLineCon);
	},

	/**
	 * 将字符型转整型
	 */
	parseInt(a) {
		a.x = parseInt(a.lead_point_x);
		a.y = parseInt(a.lead_point_y);
		return a;
	}
};	

/**
 * 障碍物
 */
let drawFence = {
	
	/**
	 * localStorage key
	 */
	fence_points: 'fence_points_' + map_config.iRow,
	
	/**
	 * 渲染障碍物
	 */
	init() {
		this.fenceCon = Map_fun.mapContainer.children(".fence-con"); //障碍物层
		this.fenceCon.on("contextmenu", () => false).show();	//阻止右键默认事件
		this.reFence();	//渲染障碍物
		this.addBtn();	//添加保存，清空按钮
		this.mouseEvent();
		facilitie_fun.init();	//设施
	},

	/**
	 * 鼠标事件
	 */
	mouseEvent() {
		//鼠标按下
		let move = 0;
		this.fenceCon.on('mousedown', 'div', function(e) {
			move = 1;
			drawFence.add_del_line(this, e.which);	//左键为1, 添加线路坐标;  右键为3, 删除线路坐标
		});

		//鼠标移动
		this.fenceCon.on('mousemove', 'div', function(e) {
			if(move) {
				drawFence.add_del_line(this, e.which);	//左键为1, 添加线路坐标;  右键为3, 删除线路坐标
			}
			return false;
		});
		
		//鼠标抬起
		this.fenceCon.on('mouseup mouseleave', () => move = 0);
	},
	
	/**
	 * 渲染障碍物
	 */
	reFence() {
		let aMaps = '', path;
		for(let i = 0; i < map_config.iRow; i++) {
			for(let j = 0; j < map_config.iCol; j++) {
				path = Map_fun.line_points[i][j] == 0 ? 'path' : '';
				aMaps += `<div class="fencePoint ${path}" data-index="${j}_${i}" style="width:${Map_fun.fenceSizeW}px;height:${Map_fun.fenceSizeH}px;left:${j / map_config.iCol * 100}%;top:${i / map_config.iRow * 100}%;"></div>`;;
			}
		}
		this.fenceCon.html(aMaps);
	},
	
	/**
	 * 增加、删除线路
	 * @param {Object} o
	 * @param {Object} sign	 1: 左键,添加线路坐标;   3： 右键,删除线路坐标
	 */
	add_del_line(o, sign) {
		let obj = $(o),
			p = 1,	// 0:可以走   1：不可以走
			index = obj.data('index').split('_');
		if(sign == 1) {
			obj.addClass('path');
			p = 0;
		}else{
			obj.removeClass('path');
			p = 1;
		}
		//将当前坐标点添加到坐标数组中
		Map_fun.line_points[index[1]][index[0]] = p;
		
		//机场设施
		facilitie_fun.show(index[0], index[1]);
		log(index[0], index[1]);
	},
	
	/**
	 * 页面增加保存、清空按钮
	 */
	addBtn() {
		$(`<div class="save-clear-btn map-save">保存</div>`).on('click', () => drawFence.save_point()).appendTo('body');
		$(`<div class="save-clear-btn map-del">清空</div>`).on('click', () => drawFence.clear_point()).appendTo('body');
	},
	
	/**
	 * 保存本地的线路坐标
	 */
	save_point() {
		localStorage.setItem(this.fence_points, JSON.stringify(Map_fun.line_points));
	},
	
	/**
	 * 清空localStorage
	 */
	clear_point() {
		localStorage.removeItem(this.fence_points);
	},
};

/**
 * 机场设施
 */
let facilitie_fun = {
	init() {
		Map_fun.facObj = $('.facilitie-dialog');
		$('.facilitie-dialog .cancel').click(() => Map_fun.facObj.hide());
		Map_fun.mapContainer.on('click', '.action', function() {
			facilitie_fun.delete(this);
		});
	},

	show(x, y) {
		Map_fun.facObj.show();
		Map_fun.leadPointX = x;
		Map_fun.leadPointY = y;
	},

	delete(e) {
		Map_fun.facObj.show();
		Map_fun.facTypeId = $(e).data('id');
	},
};

