var v = {
	cacheData: [], // 临时缓存旅客数据
	noNoticeObj: {}, // 不再通知的旅客id
	cloudwalkobj: {}, // 人脸识别插件
	isGetFace: true, // 是否获得人脸

	/**
	 * 初始化
	 */
	init: function () {
		this.intervalGetTime(); // 当前时间
		this.clearLastDayData(); // 清空前一天数据
		this.getLocalstorage() // 获取本地存储的旅客数据
		this.getNoNoticeObj(); // 获取不再通知的旅客数据
		this.initPlugin(); // 初始化人脸识别
		this.getDom(); // 获取DOM
		this.startBoarding(boardingData); // 开始登机
	},

	/**
	 * 获取DOM
	 */
	getDom: function () {
		this.relevantPassName = $('.relevantPass');
		this.midRightName = $('.mid-right');
		this.dialogPassName = $('.dialogPass');
		setTimeout(this.overSlide, 100); // 溢出滚动
	},

	/**
	 * 清空前一天数据
	 */
	clearLastDayData: function () {
		var nowDay = new Date().getDate(),
			day = localStorage.getItem('day');
		if (day != nowDay) {
			localStorage.clear();
		}
		localStorage.setItem('day', nowDay);
	},

	/**
	 * 获取本地旅客数据
	 */
	getLocalstorage: function () {
		var passengerAll = localStorage.getItem('passengerAll');
		if (passengerAll) {
			app.passengerAll = JSON.parse(passengerAll);
		}
	},

	/**
	 * 获取本地不再通知的旅客id
	 */
	getNoNoticeObj: function () {
		var noNoticeObj = localStorage.getItem('noNoticeObj');
		if (noNoticeObj) {
			this.noNoticeObj = JSON.parse(noNoticeObj);
		}
	},

	/**
	 * 打开摄像头
	 */
	startMedia: function () {
		var vendorUrl = window.URL || window.webkitURL,
			video = $('#face-video')[0];
		navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		navigator.getMedia({
			video: true, //使用摄像头对象
			audio: false //不适用音频
		}, function (strem) {
			video.src = vendorUrl.createObjectURL(strem);
			video.play();
		}, function (error) {
			console.log('摄像头打开失败');
		});
	},

	/**
	 * 初始化人脸识别,并打开摄像头
	 */
	initPlugin: function () {
		this.cloudwalkobj = document.createElement("object");
		this.cloudwalkobj.width = '100%';
		this.cloudwalkobj.height = '100%';
		this.cloudwalkobj.type = "application/x-cloudwalkfacecontrol";
		$("#cloudwalkwebobj").html(this.cloudwalkobj); //所有方法、属性的调用必须在插件添加到页面之后

		// 初始化人脸识别插件
		this.cloudwalkobj.cwInit("1", "123");

		// 设置人脸检测参数
		this.cloudwalkobj.cwSetFaceDetectParam("30", "400", "1", "150", "0", "0", "0", "0");

		// 打开摄像头
		this.cloudwalkobj.cwOpenCamera("0", "640", "480", "0");

		// 定时抓拍人脸
		this.initFace();
	},

	/**
	 * 定时抓拍当前所有人脸
	 */
	initFace: function () {
		//清空定时器
		clearInterval(this.getFaceTimer);
		this.getFaceTimer = setInterval(function () {
			v.getAllFace();
		}, config.captureFaceTime * 1000);
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

			if (config.isTest) {
				v.getAllFaceTest(photoArr);
			} else {
				//上传照片
				if (this.isGetFace) this.uploadPhoto(photoArr);
			}
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
					var info = data.data || [];
					_this.cacheData.push(_this.dealFaceData(info[0], item));
					if (--imgLength == 0) {
						_this.isGetFace = true;
						if (!app.isDialogPass) {
							_this.recursivePass();
						}
					}
				}, function () {
					_this.isGetFace = true;
				})
			})
		}
	},

	getAllFaceTest: function (imgArr) {
		var _this = this,
			img = imgArr.slice(0, 5),
			imgLength = img.length;
		img.forEach(function (item) {
			$.get(config.server + '/data.json', function (data) {
				var info = data.data || [];
				_this.cacheData.push(_this.dealFaceData(info[0], item));
				if (--imgLength == 0) {
					_this.isGetFace = true;
					if (!app.isDialogPass) {
						_this.recursivePass();
					}
				}
			})
		})
	},

	/**
	 * 处理返回的人脸数据
	 * 将获取的数据缓存，整体处理，防止数据丢失
	 */
	dealFaceData: function (data, img) {
		var obj = {},
			img = 'data:image/jpeg;base64,' + img;
		if (data) {
			var info = data.name.split('-');
			obj = {
				name_c: info[0],
				flight_no: boardingData.flight_no,
				gates: boardingData.gates,
				IDCard: data.certNo,
				p_time: boardingData.p_time,
				in_time: common.dateFormat(new Date(), 'HH:mm'),
				space: v.randomSpace(),
				position: v.randomPos(),
				seat: info[1],
				img: img,
				score: data.score
			}
		} else {
			obj = {
				img: img,
				score: 0
			}
		}
		return obj;
	},

	/**
	 * 随机生成舱位
	 */
	randomSpace: function () {
		var arr = ['First', 'Economy'];
		return arr[common.randomNum(0, arr.length - 1)];
	},

	/**
	 * 随机生成位置
	 */
	randomPos: function () {
		var arr = ['Left', 'Right'];
		return arr[common.randomNum(0, arr.length - 1)] + ' of ' + common.randomNum(1, 20) + ' seats';
	},

	/**
	 * 提示旅客信息
	 * 递归
	 */
	recursivePass: function () {
		var _this = this,
			time = (config.dialogTime + 1) * 1000;
		clearTimeout(_this.dialogPassTime);
		_this.dialogHide(_this.cacheData.shift());
		_this.dialogPassTime = setTimeout(function () {
			if (_this.cacheData.length > 0) {
				_this.dialogHide(_this.cacheData.shift());
				_this.dialogPassTime = setTimeout(arguments.callee, time);
			}
		}, time);
	},

	/**
	 * 将旅客信息加入页面
	 */
	dialogHide: function (data) {
		if (!data) return;
		this.noticeDialog(data);
		this.fliterRepeatPass(data);

		// 本地存储旅客数据
		app.passengerAll = app.passengerAll.splice(0, config.saveMax);
		localStorage.setItem('passengerAll', JSON.stringify(app.passengerAll));
	},

	/**
	 * 弹框通知
	 */
	noticeDialog: function (data) {
		var flag = this.fliterNotice(data);
		if (!flag) return;

		app.isDialogPass = true;
		clearTimeout(this.dialogHideTime);
		clearInterval(this.getFaceTimer);
		this.dialogHideTime = setTimeout(function () {
			app.isDialogPass = false;
			if (v.cacheData.length == 0) v.initFace();
		}, config.dialogTime * 1000);
		app.dialogPassData = data;

		// 溢出滚动
		this.overSlide();
	},

	/**
	 * 溢出滚动
	 */
	overSlide: function () {
		app.$nextTick(function () {
			v.repeatRolling(v.relevantPassName.find('.isAniamted'));
			v.repeatRolling(v.midRightName.find('.isAniamted'));
			v.repeatRolling(v.dialogPassName.find('.isAniamted'), config.dialogTime);
		})
	},

	/**
	 * 过滤重复旅客信息
	 */
	fliterRepeatPass: function (data) {
		if (data.score < config.faceScore) return;
		var isFind = app.passengerAll.some(function (item, index) {
			if (item.IDCard == data.IDCard) {
				v.swapItem(index, data.img);
				return true;
			}
		});
		if (!isFind) app.passengerAll.unshift(data);
	},

	/**
	 * 将最新旅客数据提前
	 * @param {Object} arr
	 * @param {Object} index
	 */
	swapItem: function (index, img) {
		var arr = app.passengerAll;
		arr[index].in_time = common.dateFormat(new Date(), 'HH:mm');
		arr[index].img = img;
		if (index == 0) return;
		var temp = arr[index];
		arr.splice(index, 1);
		arr.unshift(temp);
	},

	/**
	 * 过滤不再通知的旅客
	 * 有记录，且时间没有过期
	 */
	fliterNotice: function (data) {
		var time = v.noNoticeObj[data.IDCard];
		return time && Date.now() <= time ? false : true;
	},

	/**
	 * 鼠标进入旅客信息弹框，暂停
	 */
	pauseNotice: function () {
		v.pause = true;
		clearTimeout(v.dialogPassTime);
		clearTimeout(v.dialogHideTime);
	},

	/**
	 * 鼠标离开旅客信息弹框，继续
	 */
	startNotice: function () {
		v.pause = false;
		app.isDialogPass = false;
		setTimeout(function () {
			v.recursivePass();
			v.initFace();
		}, 1000);
	},

	/**
	 * 不再通知
	 */
	stopNotice: function (id) {
		v.noNoticeObj[id] = Date.now() + config.noNoticeTime * 60 * 1000;
		// 保存不再通知用户信息
		localStorage.setItem('noNoticeObj', JSON.stringify(v.noNoticeObj));
	},

	/**
	 * 开始登机
	 */
	startBoarding: function (data) {
		app.boarding = data;
		app.flightLogo = config.ftpUrl + '/lib/img/logo/M_' + data.flight_no.substr(0, 2) + '.png';
	},

	/**
	 * 定时获取时间
	 */
	intervalGetTime: function () {
		setInterval(function () {
			var data = common.dateFormat(new Date(), 'yyyy-MM-dd HH mm ss E').split(' ');
			app.indexTop = {
				date: data[0],
				time: data[1] + ':' + data[2],
				week: data[4]
			};
			/*if(data[1] % 6 == 0 && data[2] == '00' && data[3] == '00') {
				console.clear();
			}*/
		}, 1000);
	},

	/**
	 * 判断当天是否为生日
	 */
	isBirthday: function (IDCard) {
		IDCard = IDCard || '';
		var day = common.dateFormat(new Date(), 'MMdd'),
			birthday = IDCard.substring(10, 12) + IDCard.substring(12, 14);
		return day == birthday;
	},

	/**
	 * 钟摆滚动
	 */
	repeatRolling: function (obj, time) {
		time = time || 10;
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

};

/**
 * 实例化vue对象
 */
var app = new Vue({
	el: '#app',
	data: {
		indexTop: {},
		passengerAll: [], // 所有旅客信息
		isDialogPass: false, // 弹框显示
		dialogPassData: {}, // 弹框内的旅客数据
		flightLogo: '', // 航空公司logo
		boarding: {}, // 登机信息
		isRelevantPass: false, // 显示相关vip
	},
	computed: {
		// 右侧框显示的旅客
		passengerData: function () {
			return this.passengerAll.concat().splice(0, config.showMax);
		},

		// 相关旅客
		relevantPass: function () {
			return this.passengerAll.filter(function (item) {
				return item.flight_no == app.boarding.flight_no;
			});
		}
	},
	watch: {
		isRelevantPass: function (val) {
			if (!val) return;
			app.$nextTick(function () {
				v.repeatRolling(v.relevantPassName.find('.isAniamted'));
			})
		}
	}
});

$(function () {
	v.init();
})