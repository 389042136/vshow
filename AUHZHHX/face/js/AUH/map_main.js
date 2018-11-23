/**
 * 地图配置参数
 */
var map_config = {

	lineArrowStep: 24, // 箭头之间的距离, 越大越密
	lineArrowTime: 0.1, // 箭头走路时间： 越小越快,  单位:s
	stayTime: 1.5, // 箭头停留时间： 越小停留时间越短,  单位:s
	twoPointsTime: 80, // 两个箭头间的时间  单位:s

	//地图比例参数
	mapScale: {
		scale: 0.5,
		maxScale: 1.5,
		minScale: 1,
	},

	//地图分辨率   150*88
	iCol: 150,
	iRow: 88,

	isSkew: 0, // 地图中是否有倾斜路线, 0 ： 否    1： 是 
	isReFence: 0, // 是否渲染障碍物, 1：是    0：否
};

var mapContainer, // 需要拖动放大的div
	mapNowGate, // 显示当前位置, 登机口的div
	mapLineCon, // 显示地图线路的div
	mapWidth, // 地图容器, 初始宽度, 高度
	mapHeight, // 地图容器, 初始高度
	fenceSize = {}; // 障碍物大小

/**
 * 地图方法
 */
var Map_fun = {

	//地图缩放比例
	scale: 1,

	//定义findPath对象
	grid: null,
	finder: null,

	//循环画线路的定时器
	drawLineTimer: null,

	//标记是否已经设置过参数
	isSetMapParams: 0,

	/**
	 * 初始化参数
	 */
	init: function (nowPos, gate) {
		//第一次设置参数
		this.firstSetParams();

		//清空路线
		mapLineCon.empty();

		//计算放大比例
		// gate = 10 < gate && gate < 15 ? 'escalator' : gate;
		this.calcScale(nowPos, this.filterGate(gate));

		//是否执行鼠标事件
		if (map_config.isReFence) {
			mouseEvent.init();
		};
	},

	/**
	 * 处理不符合的登机口
	 */
	filterGate: function (gate) {
		switch (gate) {
			case '50A':
			case '50B':
				gate = 50;
				break;
			case '61A':
			case '61B':
				gate = 61;
				break;
			case '62A':
			case 'H60':
				gate = 60;
				break;
		}
		return gate;
	},

	/**
	 * 第一次设置参数
	 */
	firstSetParams: function () {
		if (!Map_fun.isSetMapParams) {

			// 获取页面元素大小
			this.getSize();

			// 定义findPath对象
			this.findPathObj();

			//渲染机场设施
			this.renderFacilities();

			Map_fun.isSetMapParams = 1;
		};
	},

	/**
	 * 缓存DOM对象，并获取DOM元素大小
	 */
	getSize: function () {
		//地图容器
		mapContainer = $('.mapContainer');

		//显示当前位置，登机口的div
		mapNowGate = mapContainer.find('.map-spot-con');

		//显示地图线路的div
		mapLineCon = mapContainer.find('.map-line-con');

		//地图原始宽高
		mapWidth = $('.mapCon').width();
		mapHeight = $('.mapCon').height();

		//障碍物的大小
		fenceSize.w = mapWidth / map_config.iCol;
		fenceSize.h = mapHeight / map_config.iRow;
	},

	/**
	 * 定义findPath对象
	 */
	findPathObj: function () {
		if (localStorage.getItem(mouseEvent.fence_points)) {
			//获取到本地存储的内容
			line_points = JSON.parse(localStorage.getItem(mouseEvent.fence_points));
		} else if (line_points.length == 0) {
			//设置障碍物  0：可以走    1: 不可走   
			for (var i = 0; i < map_config.iRow; i++) {
				var arr = [];
				for (var j = 0; j < map_config.iCol; j++) {
					arr[j] = 1;
				}
				line_points[i] = arr;
			}
		}
		//这里的两个参数定义了图的长和宽
		this.grid = new PF.Grid(map_config.iCol, map_config.iRow, line_points);
		this.finder = new PF.AStarFinder({
			allowDiagonal: true,
			dontCrossCorners: true
		});
	},

	/**
	 * 渲染机场设施
	 */
	renderFacilities: function () {
		var fcTemp = '';
		for (i in facilitiesData) {
			facilitiesData[i].forEach(function (facilities_item, j) {
				fcTemp += `<div class="action ${i}" sign="${i}-${facilities_item.x}-${facilities_item.y}" style="left:${Map_fun.tranPer(facilities_item.x, map_config.iCol)};top:${Map_fun.tranPer(facilities_item.y, map_config.iRow)};"></div>`;
			});
		}
		$('.airport-facilities').html(fcTemp);
	},

	/**
	 * 绘画坐标点
	 */
	calcScale: function (nowPos, gate) {
		var nowPos = Map_fun.parseInt(nowPos),
			destPos;
		//渲染当前坐标
		Map_fun.drawStartPoint(nowPos);

		//更换地图, 63-78登机口
		var nowGate = gate;
		if (63 <= gate && gate <= 78) {
			initObject.onePassenger.mapSrc = 'map_63';
			gate = 63;
		} else {
			initObject.onePassenger.mapSrc = 'map';
		}

		//登机口
		if (gate > 0) {
			destPos = mapGateData[gate]; //登机口
		} else if (typeof gate == 'string') {
			destPos = Map_fun.nearestPoint(nowPos, gate); //设施点
		}

		//通过距离计算放大比例
		if (destPos) {
			destPos = Map_fun.parseInt(destPos);

			//渲染目的坐标
			Map_fun.drawEndPoint(destPos, nowGate);

			//缩放地图后，计算最佳路径
			var scale;
			if (nowPos.floor == 'F4') scale = 1;
			Map_fun.scaleMap(nowPos, destPos, 1, function () {
				Map_fun.crossFloor(nowPos, destPos);
			});
		} else {
			//初始化地图，缩放比例：1
			Map_fun.scaleMap(nowPos, 0, 1);
		}
	},

	/**
	 * 渲染当前位置
	 * @param {Object} start
	 */
	drawStartPoint: function (start) {
		//添加当前地坐标点
		var spot = `<div class="map-spot now-spot" style="left:${Map_fun.tranPer(start.x, map_config.iCol)};top:${Map_fun.tranPer(start.y, map_config.iRow)};">
						<img src="img/index/location_without_range_big.png">
					</div>`;
		mapNowGate.html(spot);
	},

	/**
	 * 渲染目的地
	 * @param {Object} end
	 * @param {Object} gate
	 */
	drawEndPoint: function (end, gate) {
		if (gate > 0) {
			var spot = `<div class="map-spot gate-spot" style="left:${Map_fun.tranPer(end.x, map_config.iCol)};top:${Map_fun.tranPer(end.y, map_config.iRow)};">
							${gate}
						</div>`;
			mapNowGate.append(spot);
		}
	},

	/**
	 * 计算距离当前位置最近的设施点
	 * @param {Object} start
	 * @param {Object} fc
	 */
	nearestPoint: function (start, fc) {
		var diff_min = 10000,
			point;
		$.each(facilitiesData[fc], function (i, item) {
			var diff = Math.hypot(start.x - item.x, start.y - item.y);
			if (diff < diff_min) {
				diff_min = diff;
				point = item;
			}
		});
		return point;
	},

	/**
	 * 转成百分比
	 */
	tranPer: function (a, b) {
		return a / b * 100 + '%';
	},

	/**
	 * 缩放地图
	 * 通过两点间的距离计算缩放比例
	 * @param {Object} start
	 * @param {Object} end
	 * @param {Object} scale
	 * @param {Object} callback
	 */
	scaleMap: function (start, end, scale, callback) {
		//无目的坐标时，目的与起始位置相同
		end = end || start;

		//当前位置与登机口距离
		var sx = map_config.iCol / Math.abs(start.x - end.x) * map_config.mapScale.scale,
			sy = map_config.iRow / Math.abs(start.y - end.y) * map_config.mapScale.scale;
		//计算缩放比例, 默认优先
		Map_fun.scale = scale || Math.min(sx, sy);

		//最大比例
		if (Map_fun.scale > map_config.mapScale.maxScale) {
			Map_fun.scale = map_config.mapScale.maxScale;
		}
		//最小比例
		if (Map_fun.scale < map_config.mapScale.minScale) {
			Map_fun.scale = map_config.mapScale.minScale;
		}

		//改变地图样式 
		Map_fun.changeMapStyle(start, end, Map_fun.scale, callback);
	},

	/**
	 * 改变地图样式
	 * @param {Object} start 	起始坐标
	 * @param {Object} end	  	目的坐标
	 * @param {Object} scale 	缩放比例	
	 * @param {Object} callback	回调函数：加载路线
	 */
	changeMapStyle: function (start, end, scale, callback) {
		var mapCenterX = map_config.iCol / 2, //地图容器的中心坐标 
			mapCenterY = map_config.iRow / 2,

			//放大后的中心坐标
			largeX = (start.x + end.x) / 2 * scale,
			largeY = (start.y + end.y) / 2 * scale,

			//距离
			diffX = (largeX - mapCenterX) * fenceSize.w,
			diffY = (largeY - mapCenterY) * fenceSize.h;

		//左边不能超出
		if (diffX < 0) {
			diffX = 0;
		}
		//右边不能超出
		if (diffX > mapWidth * scale - mapWidth) {
			diffX = mapWidth * scale - mapWidth;
		}
		//上边不能超出
		if (diffY < 0) {
			diffY = 0;
		}
		//下边不能超出
		if (diffY > mapHeight * scale - mapHeight) {
			diffY = mapHeight * scale - mapHeight;
		}
		if (!mapContainer.hasClass('velocity-animating')) {
			mapContainer.velocity({
				'width': mapWidth * scale,
				'height': mapHeight * scale,
				'left': -diffX + 'px',
				'top': -diffY + 'px'
			}, 1000, function () {
				if (callback) callback();
			});
		}
	},

	/**
	 * 判断是否跨层
	 */
	crossFloor(nowPos, destPos) {
		var arr = [];
		if (nowPos.floor == 'F4') {
			nowPos = F3_F4_connection.F3;
		}
		var path = Map_fun.findBestPath(nowPos, destPos);
		if (path) {
			//arr.push(...path);
			Map_fun.repeatDrawLine(path);
		}
	},

	/**
	 * 寻找最佳路径
	 */
	findBestPath: function (start, end) {
		var gridBackup = Map_fun.grid.clone(),
			pointArr = Map_fun.finder.findPath(start.x, start.y, end.x, end.y, gridBackup);
		if (pointArr.length > 0) {
			var bezierPoints = Map_fun.createBezierPoints(pointArr, pointArr.length);
			return Map_fun.linePointArr(bezierPoints);
		} else {
			console.log('无最佳路径');
			return false;
		}
	},

	/**
	 * 返回地图上需要显示的坐标点
	 */
	linePointArr: function (pointArr) {
		var arr = [];
		for (var i = 0; i < pointArr.length; i++) {
			if (i % Math.floor(1 / (Map_fun.scale * 0.5) / map_config.lineArrowStep * 100) == 0 || i == pointArr.length - 1) {
				arr.push([pointArr[i].x, pointArr[i].y]);
			}
		}
		return arr;
	},

	/**
	 * 贝赛尔曲线
	 * @param {Object} anchorpoints
	 * @param {Object} pointsAmount
	 */
	createBezierPoints: function (anchorpoints, pointsAmount) {
		var points = [];
		for (var i = 0; i < pointsAmount; i++) {
			var point = this.multiPointBezier(anchorpoints, i / pointsAmount);
			points.push(point);
		}
		return points;
	},
	multiPointBezier: function (points, t) {
		var len = points.length;
		var x = 0,
			y = 0;
		var erxiangshi = function (start, end) {
			var cs = 1,
				bcs = 1;
			while (end > 0) {
				cs *= start;
				bcs *= end;
				start--;
				end--;
			}
			return (cs / bcs);
		};
		for (var i = 0; i < len; i++) {
			var point = points[i];
			x += point[0] * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
			y += point[1] * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));
		}
		return {
			x: x,
			y: y
		};
	},

	/**
	 * 重复绘画线路
	 */
	repeatDrawLine: function (pointArr) {
		if (map_config.isSkew) {
			//有倾斜路线
			Map_fun.drawLine_skew(pointArr);
			Map_fun.drawLineTimer = setInterval(function () {
				Map_fun.drawLine_skew(pointArr);
			}, (pointArr.length * map_config.lineArrowTime + map_config.stayTime) * 1000);
		} else {
			var minuter = Math.floor((pointArr.length - 1) * map_config.twoPointsTime / 60);
			initObject.onePassenger.time = minuter < 1 ? 1 : minuter;
			Map_fun.drawLine(pointArr);
			Map_fun.drawLineTimer = setInterval(function () {
				Map_fun.drawLine(pointArr);
			}, (pointArr.length * map_config.lineArrowTime + map_config.stayTime) * 1000);
		}
	},

	/**
	 * 绘画导航线路
	 */
	drawLine: function (pointArr) {
		mapLineCon.empty();
		for (var i = 0; i < pointArr.length - 1; i++) {
			~ function (i) {
				var timer = setTimeout(function () {
					//计算角度
					var angle = Map_fun.lineDeg(pointArr[i + 1], pointArr[i]);

					//转换坐标
					Map_fun.addArrow({
						x: Map_fun.tranPer(pointArr[i][0], map_config.iCol),
						y: Map_fun.tranPer(pointArr[i][1], map_config.iRow)
					}, angle);

					clearTimeout(timer);
				}, i * map_config.lineArrowTime * 1000);
			}(i);
		}
	},

	/**
	 * 绘画导航线路(地图中有倾斜的路线)
	 */
	drawLine_skew: function (pointArr) {
		mapLineCon.empty();
		var last = pointArr[0],
			angle;
		for (var i = 1; i < pointArr.length; i++) {
			~ function (i) {
				var timer = setTimeout(function () {
					//计算角度
					angle = Map_fun.lineDeg(pointArr[i], last);

					//转换坐标
					Map_fun.addArrow({
						x: Map_fun.tranPer(pointArr[i][0], map_config.iCol),
						y: Map_fun.tranPer(pointArr[i][1], map_config.iRow)
					}, angle);

					//保存上次坐标
					last = pointArr[i];
					clearTimeout(timer);
				}, i * map_config.lineArrowTime * 1000);
			}(i);
		}
	},

	/**
	 * 计算箭头角度
	 * @param {Object} a 
	 * @param {Object} b b相对于a是原点
	 */
	lineDeg: function (a, b) {
		var x = Math.abs(a[0] - b[0]),
			y = Math.abs(a[1] - b[1]),
			tan = Math.atan(y / x); //用反三角函数求弧度
		angle = Math.round(180 * tan / Math.PI); //将弧度转换成角度

		//无倾斜线路，所有角度都是直角
		// if( !(a[0] == b[0] || a[1] == b[1]) && !map_config.isSkew){
		// 	angle = angle > 45 ? 90 : 0;
		// }

		if (a[0] <= b[0] && a[1] < b[1]) { //在第二象限、y轴上
			angle = 180 - angle;
		}

		if (a[0] < b[0] && a[1] >= b[1]) { //在第三象限、x轴左
			angle = 180 + angle;
		}

		if (a[0] >= b[0] && a[1] > b[1]) { //在第四象限、y轴下
			angle = 360 - angle;
		}

		return '-' + angle;
	},

	/**
	 * 旋转箭头,并添加到地图区域
	 * @param {Object} arrowObj 转换过的箭头坐标{x:x,y:y}
	 * @param {Object} deg 角度
	 */
	addArrow: function (arrowObj, deg) {
		var temp = `<div class="lineArrow"></div>`;
		$(temp).css({
			left: arrowObj.x,
			top: arrowObj.y,
			transform: 'translate(-50%, -50%) rotate(' + deg + 'deg)',
		}).appendTo(mapLineCon);
	},

	/**
	 * 将字符型转整型
	 */
	parseInt: function (a) {
		a.x = parseInt(a.x);
		a.y = parseInt(a.y);
		return a;
	}
};

/**
 * 鼠标事件
 */
var mouseEvent = {

	/**
	 * 鼠标按下开关
	 */
	move: 0,
	fenceCon: null,

	/**
	 * localStorage key
	 */
	fence_points: 'fence_points_' + map_config.iRow,

	/**
	 * 渲染障碍物
	 */
	init: function () {
		mouseEvent.fenceCon = mapContainer.find(".fence-con"); //障碍物层

		//阻止右键默认事件
		mouseEvent.fenceCon.on("contextmenu", function () {
			return false;
		});

		mouseEvent.reFence(); //渲染障碍物
		mouseEvent.addBtn(); //添加保存，清空按钮

		//鼠标按下
		mouseEvent.fenceCon.mousedown(function (e) {
			mouseEvent.move = 1;
		});
		//鼠标移动
		mouseEvent.fenceCon.on('mousemove', 'div', function (e) {
			if (mouseEvent.move) {
				mouseEvent.add_del_line(this, e.which); //左键为1, 添加线路坐标;  右键为3, 删除线路坐标
			}
		});
		//鼠标抬起
		mouseEvent.fenceCon.mouseup(function () {
			mouseEvent.move = 0;
		});

		// mouseEvent.fenceCon.on('mouseup', 'div', function(e) {
		// 	mouseEvent.add_del_line(this, e.which);	//左键为1, 添加线路坐标;  右键为3, 删除线路坐标
		// });
	},

	/**
	 * 渲染障碍物
	 */
	reFence: function () {
		var aMaps = '',
			path;
		for (var i = 0; i < map_config.iRow; i++) {
			for (var j = 0; j < map_config.iCol; j++) {
				path = line_points[i][j] == 0 ? 'path' : '';
				aMaps += `<div class="fencePoint ${path}" data-index="${j}_${i}" style="width:${fenceSize.w}px;height:${fenceSize.h}px;left:${j / map_config.iCol * 100}%;top:${i / map_config.iRow * 100}%;"></div>`;;
			}
		}
		mouseEvent.fenceCon.html(aMaps);
		$('.map-line').css('z-index', 999);
	},

	/**
	 * 增加、删除线路
	 * @param {Object} obj
	 * @param {Object} sign	 1: 左键,添加线路坐标;   3： 右键,删除线路坐标
	 */
	add_del_line: function (obj, sign) {
		var index = $(obj).data('index').split('_'),
			p = 1; // 0:可以走   1：不可以走
		if (sign == 1) {
			$(obj).addClass('path');
			p = 0;
		} else {
			$(obj).removeClass('path');
			p = 1;
		}
		//将当前坐标点添加到坐标数组中
		line_points[index[1]][index[0]] = p;

		//机场设施
		fc_linshi.push({
			x: index[0],
			y: index[1]
		});
		console.log(index[0], index[1]);
	},

	/**
	 * 页面增加保存、清空按钮
	 */
	addBtn: function () {
		var html = `<div class="save-clear-btn map-save" onclick="mouseEvent.save_point()">保存</div>
					<div class="save-clear-btn map-del" onclick="mouseEvent.clear_point()">清空</div>`;
		$('body').append(html);
	},

	/**
	 * 保存本地的线路坐标
	 */
	save_point: function () {
		localStorage.setItem(mouseEvent.fence_points, JSON.stringify(line_points));
	},

	/**
	 * 清空localStorage
	 */
	clear_point: function () {
		localStorage.removeItem(mouseEvent.fence_points);
	},
};