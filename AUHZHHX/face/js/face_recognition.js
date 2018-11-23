/**
 * 全局参数
 */
var initObject = {

	//设备坐标
	devicePos: {
		x: 72,
		y: 68
	},

	/**
	 * 首页数据
	 */
	homeData: {
		airport_tittle: config.airportCode,
		shortTime: '',
		longTime: '',
		week: '',
		clock: {
			second: '',
			minute: '',
			hour: '',
		},

		//温馨提示
		reminderImg: {
			index: 0,
			imgArr: ['face_card_01.png', 'face_card_02.png', 'face_card_03.png'],
			imgSrc: config.airportCode + '/face_card_01.png',
			isAnimated: false,
		},
	},

	//光标
	moveSignObj: null,

	//自由文本
	freeText: {
		obj: null,
		data: null,
	},

	/**
	 * 人脸弹框数据
	 */
	faceInfoDialog: {
		obj: null,
		cdTime: null,
	},

	/**
	 * 单人数据
	 */
	onePassenger: {
		obj: null,
		flightLogoSrc: '',
		name: '',
		flightTime: '',
		flightNo: '',
		gate: '',
		statusCode: 0, // 0：无   1：正在登机   2： 催促登机
		noVia: false,
		vialist: [],
		statusCh: '',
		statusEn: '',
		mapSrc: 'map',
		time: null
	},

	/**
	 * 多人数据
	 */
	manyPassenger: {
		obj: null,
		twoPassenger: false,
	},

	/**
	 * 初始化
	 */
	init: function () {
		//初始化时钟秒表
		tools.secondClock();

		//缓存DOM对象
		this.saveDom();

		//加载相应机场的地图数据
		this.getJavaScript();

		//自由文本
		tools.controlFreeText();

		//初始化人脸识别
		faceRecognition.initPlugin();

		//定时切换温馨提示
		showFaceInfo.intervalswitchImg();
	},

	/**
	 * 缓存DOM对象
	 */
	saveDom: function () {
		//人脸弹框
		this.faceInfoDialog.obj = $('#face-recognition');

		//单人
		this.onePassenger.obj = this.faceInfoDialog.obj.find('.onePassenger');

		//多人
		this.manyPassenger.obj = this.faceInfoDialog.obj.find('.manyPassenger>div');

		//光标
		this.moveSignObj = $('.moveSign');

		//自由文本
		this.freeText.obj = $('.freeTextData');
	},

	/**
	 * 动态加载js文件
	 */
	getJavaScript: function () {
		//需要加载的js文件
		var js_arr = ['map_data.js', 'map_main.js'],
			js_length = js_arr.length;
		$.each(js_arr, function (i, item) {
			$.getScript(`js/${config.airportCode}/${item}?${new Date()}`, function () {
				if (--js_length == 0) {
					initObject.getAirportData();
				}
			});
		});
	},

	/**
	 * 获取对应机场的数据
	 */
	getAirportData: function () {
		//获取设备位置坐标 
		common.getIp(function (ip) {
			var pos = deviceIp[ip];
			if (pos) initObject.devicePos = pos;
		})
	}
};

/**
 * 人脸识别
 */
var faceRecognition = {
	cloudwalkobj: {}, //人脸识别插件
	cloudwalkCon: null,
	isGetFace: true, //是否获得人脸
	cacheData: [],

	/**
	 * 初始化人脸识别,并打开摄像头
	 */
	initPlugin: function () {
		this.cloudwalkobj = document.createElement("object");
		this.cloudwalkobj.width = '100%';
		this.cloudwalkobj.height = '100%';
		this.cloudwalkobj.type = "application/x-cloudwalkfacecontrol";
		this.cloudwalkCon = $("#cloudwalkwebobj");
		this.cloudwalkCon.html(this.cloudwalkobj); //所有方法、属性的调用必须在插件添加到页面之后

		//初始化人脸识别插件
		this.cloudwalkobj.cwInit("1", "123");

		//设置人脸检测参数
		this.cloudwalkobj.cwSetFaceDetectParam("30", "400", "1", "150", "0", "0", "0", "0");

		//打开摄像头
		this.cloudwalkobj.cwOpenCamera("0", "640", "480", "0");

		//定时抓拍人脸
		this.initFace();
	},

	/**
	 * 定时抓拍当前所有人脸
	 */
	initFace: function () {
		//清空定时器
		clearInterval(this.getFaceTimer);
		this.getFaceTimer = setInterval(function () {
			if (config.isTest) {
				faceRecognition.getAllFaceTest();
			} else {
				faceRecognition.getAllFace();
			}
		}, config.captureFaceTime * 1000);
	},

	getAllFaceTest: function () {
		var _this = this,
			imgLength = 1;
		for (var i = 0; i < imgLength; i++) {
			$.get('../data.json', function (data) {
				if (data.code == 0) {
					var info = data.data[0];
					if (info.score >= config.faceScore) {
						var falg = _this.cacheData.some(function (item) {
							return item.IDCard == info.certNo;
						});
						_this.cacheData.push(_this.dealFaceData(info));
					}
				}
				if (--imgLength == 0 && _this.cacheData.length > 0) {
					showFaceInfo.showDialog(_this.cacheData);
					_this.cacheData = [];
				}
			})
		}
	},

	/**
	 * 抓取人脸
	 */
	getAllFace: function () {
		var info = this.cloudwalkobj.cwGetFacesInFrame(),
			json = $.parseJSON(info);
		if (json.code == 0) {
			var photoArr = [];
			$.each(json.data, function (i, face) {
				//data:image/jpeg;base64, + face.faceString
				photoArr.push(face.faceString);
			});

			//上传照片
			if (this.isGetFace) this.uploadPhoto(photoArr);
		}
	},

	/**
	 * 上传5张照片
	 * @param imgArr base64
	 */
	uploadPhoto: function (imgArr) {
		if (imgArr.length > 0) {
			this.isGetFace = false;
			var _this = this,
				img = imgArr.slice(0, 5),
				imgLength = img.length,
				url = config.server + '/spider/cloudWalkService/passenger/daily/recog';
			img.forEach(function (item) {
				var params = {
					faceImage: item,
					topN: 1
				};
				common.ajax(url, params).then(function (data) {
					console.log('旅客人脸信息：', data);
					if (data.code == 0) {
						var info = data.data[0];
						if (info.score >= config.faceScore) {
							var falg = _this.cacheData.some(function (item) {
								return item.IDCard == info.certNo;
							});
							if (!falg) {
								_this.cacheData.push(_this.dealFaceData(info, item));
							}
						}
					}
					if (--imgLength == 0) {
						if (_this.cacheData.length > 0) {
							showFaceInfo.showDialog(_this.cacheData);
							_this.cacheData = [];
						} else {
							_this.isGetFace = true;
						}
					}
				}, function () {
					_this.isGetFace = true;
				})
			})
		}
	},

	/**
	 * 处理返回的人脸数据
	 * 将获取的数据缓存，整体处理，防止数据丢失
	 */
	dealFaceData: function (data) {
		var info = data.name.split('-'),
			obj = {
				IDCard: data.certNo,
				NAME_C: info[0],
				FLIGHTNO: boardingData.flight_no,
				GATES: boardingData.gates,
				PTIME: boardingData.p_time,
				ARRIVE_TIME: boardingData.arrive_time,
				DEST_C: boardingData.dest_c,
				DEST_E: boardingData.dest_e,
				VIALIST: [],
				STATUS_PRO_C: boardingData.status_ch,
				STATUS_PRO_E: boardingData.status_en
			}
		return obj;
	},
};

/**
 * 显示获取到人脸的信息
 */
var showFaceInfo = {
	faceKey: ['NAME_C', 'PTIME', 'FLIGHTNO', 'GATES', 'VIALIST', 'DEST_C', 'DEST_E', 'STATUS_PRO_C', 'STATUS_PRO_E'],

	/**
	 * 显示智慧航显页面
	 * @param data [{},{}]
	 */
	showDialog: function (data) {
		//清空定时器
		clearInterval(faceRecognition.getFaceTimer);
		clearInterval(this.intervalSwitchImgTimer);

		//隐藏视频
		faceRecognition.cloudwalkCon.css('visibility', 'hidden');

		//判断是否为多人
		if (data.length == 1) {
			initObject.faceInfoDialog.obj.removeClass('isMany').fadeIn();
			this.reOneInfo(data[0]);
		} else {
			//双人样式
			if (data.length == 2) {
				initObject.manyPassenger.twoPassenger = true;
			} else {
				initObject.manyPassenger.twoPassenger = false;
			}
			initObject.faceInfoDialog.obj.addClass('isMany').fadeIn();
			this.reManyInfo(data);
		}

		//光标
		tools.moveSign();

		//关闭页面倒计时 
		this.countdown();
	},

	/**
	 * 渲染单人旅客信息
	 */
	reOneInfo: function (data) {
		var _this = this;
		//航空公司logo
		initObject.onePassenger.flightLogoSrc = config.ftpUrl + '/lib/img/logo/M_' + data.FLIGHTNO.substr(0, 2) + '.png';

		//姓名
		initObject.onePassenger.name = tools.nameFormat(data[_this.faceKey[0]]);

		//时间
		var date = common.dateFormat(new Date(), 'yyyy-MM-dd E').split(' ');
		var passDate = date[0];
		passDate += '<span class="week">' + date[1] + '</span>';
		initObject.onePassenger.flightTime = passDate;

		//航班号
		initObject.onePassenger.flightNo = data[_this.faceKey[2]];

		//登机口
		initObject.onePassenger.gate = data[_this.faceKey[3]];

		//是否有经停站
		var noVia = '',
			viaTemp = '';
		if (data[_this.faceKey[4]] && data[_this.faceKey[4]].length > 0) {
			//遍历经停站
			$.each(data[_this.faceKey[4]], function (i, items) {
				viaTemp += `<div class="via-flight">
								<div class="place-en">${items.EN}</div>
								<div class="place-ch">${items.CH}</div>
								<div class="fvt-time-div">
									<div>经停</div>
								</div>
							</div>
							<div class="via-flight-img">
								<img src="img/index/icon_flight_flying.png"/>
							</div>`;
			});
		} else {
			noVia = 'noVia';
		}
		var fromTOTemp = `<div class="from-via-to isAniamted">
								<!--始发-->
								<div class="from">
									<div class="place-ch">${airportName.EN}</div>
									<div class="fvt-time-div">
										<div>
											<div class="fvt-img">
												<img src="img/index/icon_take_off.png"/>
											</div>
											<div class="fvt-time">
												${data[_this.faceKey[1]] || ''}
											</div>
										</div>
									</div>
								</div>
								
								<!--经停-->
								<div class="via-div ${noVia}">
									<!--有经停-->
									<div class="hasVia">
										<!--飞机图标-->
										<div class="via-flight-img">
											<img src="img/index/icon_flight_flying.png"/>
										</div>
										${viaTemp}
									</div>
									
									<!--无经停-->
									<div class="noHasVia">
										<img src="img/index/icon_flight_flying_big.png"/>
									</div>
								</div>
								
								<!--目的-->
								<div class="to">
									<div class="place-ch">${data[_this.faceKey[6]]}</div>
									<div class="fvt-time-div">
										<div>
											<div class="fvt-img">
												<img src="img/index/icon_to.png"/>
											</div>
											<div class="fvt-time">
												${data.ARRIVE_TIME}
											</div>
										</div>
									</div>
								</div>
							</div>`;
		initObject.onePassenger.obj.find('.from-to-div').html(fromTOTemp);

		//航班状态
		if (data.STATUS_PRO == 'BOR') {
			//登机
			initObject.onePassenger.statusCode = 1;
		} else if (data.STATUS_PRO == 'LBD') {
			//催促登机
			initObject.onePassenger.statusCode = 2;
		} else {
			initObject.onePassenger.statusCode = 0;
		}
		initObject.onePassenger.statusCh = data[_this.faceKey[7]];
		initObject.onePassenger.statusEn = data[_this.faceKey[8]];

		//图片加载完成后，超出滚动  
		_this.loadImg(initObject.onePassenger.obj);

		//导航地图，后台传递
		Map_fun.init(initObject.devicePos, data.GATES);
	},

	/**
	 * 渲染多人旅客信息
	 */
	reManyInfo: function (data) {
		var manyContainer = initObject.manyPassenger.obj,
			fromTOTemp = '',
			_this = this;
		manyContainer.empty();

		//遍历旅客信息
		$.each(data, function (i, items) {
			//只显示3名旅客
			if (i > 2) {
				return false;
			}

			var flightStatus = null;
			//航班状态
			if (items.STATUS_PRO == 'BOR') {
				//登机
				flightStatus = 'boarding';
			} else if (items.STATUS_PRO == 'LBD') {
				//催促登机
				flightStatus = 'lastCall';
			}

			//航空公司logo
			var logoSrc = config.ftpUrl + '/lib/img/logo/M_' + items[_this.faceKey[2]].substr(0, 2) + '.png';

			//是否有经停站
			var noVia = items.VIALIST.length > 0 ? '' : 'noVia',
				viaTemp = '';
			$.each(items.VIALIST, function (j, item) {
				viaTemp += `<div class="via-flight">
								<div class="place-en">${item.EN}</div>
								<div class="place-ch">${item.CH}</div>
							</div>
							
							<div class="via-flight-img">
								<img src="img/index/icon_flight_flying.png"/>
							</div>`;
			});
			//时间
			var flightNoTime = items[_this.faceKey[1]];
			fromTOTemp += `<div class="passenger-flightData ${flightStatus}">
							<div class="passenger-img">
								<img src="${logoSrc}" onerror="this.src='../lib/img/logo/logo_default.png'"/>
							</div>
							
							<div class="passenger-name">
								<div class="passenger-name-span isAniamted">${tools.nameFormat(items[_this.faceKey[0]])}</div>
							</div>
							
							<div class="boarding-info">
								<div class="passenger-flightNo">
									<div class="p-flightNo">${items[_this.faceKey[2]]}</div>
									<div class="p-flightNo-time">${flightNoTime} <span class="week">${common.dateFormat(new Date(), 'E')}</span></div>
								</div>
								
								<div class="from-to-div">
									<div class="from-via-to isAniamted">
										<!--始发-->
										<div class="from">
											<div class="place-ch">${airportName.EN}</div>
										</div>
										
										<!--经停-->
										<div class="via-div ${noVia}">
											<!--有经停-->
											<div class="hasVia">
												<!--飞机图标-->
												<div class="via-flight-img">
													<img src="img/index/icon_flight_flying.png"/>
												</div>
												${viaTemp}
											</div>
											<!--无经停-->
											<div class="noHasVia">
												<img src="img/index/icon_flight_flying_big.png"/>
											</div>
										</div>
										
										<!--目的-->
										<div class="to">
											<div class="place-ch">${items.DEST_E}</div>
										</div>
									</div>
								</div>
							</div>
							
							<!--航班状态与登机口-->
							<div class="flight-status-div">
								<!--航班状态-->
								<div class="flight-status">
									<div class="isAniamted">${items[_this.faceKey[8]] || ''}</div>
								</div>
								
								<!--登机口-->
								<div class="passenger-gates">
									<div class="gates-left">
										<p>Gate</ps>
									</div>
									<div class="gates-right">
										${items[_this.faceKey[3]] || ''}
									</div>
								</div>
							</div>
						</div>`;
		});
		manyContainer.html(fromTOTemp);

		//图片加载完成后，超出滚动  
		_this.loadImg(manyContainer);
	},

	/**
	 * 图片加载完成
	 */
	loadImg: function (obj) {
		var _this = this,
			imgArr = obj.find('.from-to-div img'),
			imgNum = imgArr.length;
		imgArr.load(function () {
			if (--imgNum == 0) {
				tools.repeatRolling(obj.find('.isAniamted'), 10);
			}
		});
	},

	/**
	 * 倒计时关闭页面
	 */
	countdown: function () {
		var _this = this;
		initObject.faceInfoDialog.cdTime = config.faceShowTime;
		var countdownTimer = setInterval(function () {
			if (1 == initObject.faceInfoDialog.cdTime) {
				clearInterval(countdownTimer);
				initObject.faceInfoDialog.obj.fadeOut('normal', function () {
					_this.dialogHide();
				});
				return false;
			}
			initObject.faceInfoDialog.cdTime--;
		}, 1000);
	},

	/**
	 * 弹框关闭后，处理事件
	 */
	dialogHide: function () {
		//停止动画
		initObject.faceInfoDialog.obj.find('.isAniamted').css({
			'animation-duration': 0 + 's'
		});;
		initObject.moveSignObj.removeClass('isAniamted');

		//显示视频
		faceRecognition.cloudwalkCon.css('visibility', 'visible');

		//切换温馨提示图片
		setTimeout(tools.switchImg, 1000);
		this.intervalswitchImg();

		//清空路线定时器
		clearInterval(Map_fun.drawLineTimer);

		//重新上传图片
		faceRecognition.isGetFace = true;

		//重新定时抓拍人脸
		faceRecognition.initFace();
	},

	/**
	 * 定时切换温馨提示
	 */
	intervalswitchImg: function () {
		this.intervalSwitchImgTimer = setInterval(tools.switchImg, (config.reminderImgTime + 1) * 1000);
	}
};

/**
 * vue对象
 */
var vueObj = new Vue({
	el: '#vueObj',
	data: {
		homeData: initObject.homeData, // 首页数据
		dialogData: initObject.faceInfoDialog, // 弹框数据
		onePassenger: initObject.onePassenger, // 单人数据
		manyPassenger: initObject.manyPassenger // 多人数据
	},
});

/**
 * 小工具
 */
var tools = {

	/**
	 * 秒表
	 */
	secondClock: function () {
		setInterval(function () {
			var data = common.dateFormat(new Date(), 'yyyy.MM.dd HH mm ss E').split(' ');
			tools.clockShow(data[1], data[2], data[3]);

			initObject.homeData.longTime = data[0];
			initObject.homeData.shortTime = data[1] + ':' + data[2];
			initObject.homeData.week = data[4];

			/*if(data[1] % 6 == 0 && data[2] == '00' && data[3] == '00') {
	        	console.clear();
	        }*/
		}, 1000);
	},

	/**
	 * 时钟显示
	 */
	clockShow: function (hour, minute, second) {
		if (hour > 12) {
			hour = hour - 12;
		}
		hourAngle = (360 / 12) * hour + (360 / (12 * 60)) * minute;

		initObject.homeData.clock.hour = 'rotate(' + hourAngle + 'deg)';
		initObject.homeData.clock.minute = 'rotate(' + 6 * minute + 'deg)';
		initObject.homeData.clock.second = 'rotate(' + 6 * second + 'deg)';
	},

	/**
	 * 处理姓名
	 * @param name
	 */
	nameFormat: function (name) {
		var n = name.split(' ').slice(1).join(' ');
		//var n = name.replace(name.charAt(1), '*');
		return '* ' + n;
	},

	/**
	 * 切换温馨提示
	 */
	switchImg: function () {
		var that = initObject.homeData.reminderImg,
			imgArrIndex = ++that.index % that.imgArr.length;
		that.index = imgArrIndex == 0 ? 0 : that.index;

		that.imgSrc = config.airportCode + '/' + that.imgArr[imgArrIndex];
		that.isAnimated = true;
		setTimeout(function () {
			that.isAnimated = false;
		}, 1000);
	},

	/**
	 * 光标
	 */
	moveSign: function () {
		initObject.moveSignObj.removeClass('isAniamted');
		setTimeout(function () {
			initObject.moveSignObj.addClass('isAniamted').css({
				'animation-duration': config.faceShowTime + 's'
			});
		}, 100);
	},

	/**
	 * 钟摆滚动
	 */
	repeatRolling: function (obj, time) {
		obj.each(function (i, item) {
			var obj = $(item),
				width = obj.width(),
				lastLi = obj.parent().width(),
				t = width > lastLi ? (width / lastLi > 1.3 ? time : time / 2) : 0;
			obj.css({
				'animation-duration': t + 's'
			});
		});
	},

	/**
	 * 自由文本
	 * @param {Object} data 内容
	 */
	controlFreeText: function () {
		var data = config.freeText;
		setTimeout(function () {
			//判断自由文本内有是否改变
			var _that = initObject.freeText.obj,
				width = _that.html('<span>' + data + '</span>').width(),
				lastLi = _that.parent().width();

			//判断自由文本是否需要滚动
			if (width > lastLi) {
				var time = width / config.freeTextSpeed;
				_that.append('<span>' + data + '</span>').addClass('isAniamted').css({
					'animation-duration': time + 's'
				});
			}
		}, 50);

		//保存自由文本
		//initObject.freeText.data = data;
	},
};

$(function () {
	initObject.init();
});