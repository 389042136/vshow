/**
 * 配置参数
 */
var config = {
	server: 'http://178.10.12.21:8081',		// 请求1:N接口地址
	// server: '',		// 请求1:N接口地址
	ftpUrl: '/AUHZHHX',						// FTP服务器地址
	captureFaceTime: 1, 					// 抓拍人脸间隔时间, 单位：秒
	faceScore: 0.9,							// 人脸阈值

	// 智慧航显
	faceShowTime: 10,						// 显示时间，单位：秒
	reminderImgTime: 3,						// 温馨提示切换时间
	freeTextSpeed: 50,						// 自由文本滚动的速度，单位px/s，越大越快
	freeText: "Welcome to Abu Dhabi International Airport！ Welcome to Abu Dhabi International Airport！",		// 自由文本
	airportCode: 'AUH', 					// 机场三字码

	// VIP
	showMax: 10,							// 最多显示旅客的数量
	saveMax: 100,							// 最多存储旅客的数量
	noNoticeTime: 3,						// 不再通知时间，单位：分钟
	dialogTime: 4,							// 提示弹框停留时间，单位：秒

	isTest: 0								// 是否为测试 ,  1：是    0：否
};

/**
 * 登机数据
 */
var boardingData = {
	flight_no: 'EY8861',
	gates: '6',
	p_time: '18:05',
	arrive_time: '22:45',
	dest_c: '',
	dest_e: 'London',
	status_ch: '',
	status_en: 'Boarding'
};

