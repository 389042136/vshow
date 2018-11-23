
var common = {
	
	/**
	 * 移动端h5页面，初始化rem
	 */
	initRem: function(resolving) {
		var n = window,
			e = n.document,
			t = e.documentElement,
			i = resolving,
			d = i / 100,
			o = "orientationchange" in n ? "orientationchange" : "resize",
			a = function() {
				var w = t.clientWidth || 320;
				w > resolving && (w = resolving);
				t.style.fontSize = w / d + "px"
			};
		e.addEventListener && (n.addEventListener(o, a, !1), e.addEventListener("DOMContentLoaded", a, !1))
	},
	
	/**
	 * 封装ajax
	 */
	ajax: function(url, data) {
		var dtd = $.Deferred();
	    $.ajax({
	        url:  url,
	        type: data ? 'post' : 'get',//请求方式
	        data: JSON.stringify(data),
			contentType : "application/json",
			timeout: 10000,
	    }).then(function(data){
	        dtd.resolve(data);
	    }, function(){
	       console.error('-----请求异常-----');
	        dtd.reject();
	    });
    	return dtd.promise();
	},
	
	/**
	 * 日期格式化
	 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)、毫秒(S)只能用 1 个占位符
	 * dateFormat(val,"yyyy-MM-dd HH:mm:ss") 	==> 2018-07-02 19:56:20
	 * dateFormat(val,"yyyy-MM-dd hh:mm:ss.S") 	==> 2018-07-02 07:57:31.514
	 * dateFormat(val,"yyyy-M-d H:m:s")      	==> 2018-07-02 7:58:7
	 * dateFormat(val,"yyyy-MM-dd EEE hh:mm:ss")==> 2018-07-02 星期一 07:59:01
	 */
	dateFormat: function(val, fmt) {
		val = new Date(val);
		fmt = fmt || 'yyyy-MM-dd HH:mm';
		var week = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'],
			o = {
				"M+": val.getMonth() + 1, // 月份         
				"d+": val.getDate(), // 日         
				"h+": val.getHours() % 12 == 0 ? 12 : val.getHours() % 12, // 小时         
				"H+": val.getHours(), // 小时         
				"m+": val.getMinutes(), // 分         
				"s+": val.getSeconds(), // 秒         
				"q+": Math.floor((val.getMonth() + 3) / 3), // 季度         
				"S": val.getMilliseconds() // 毫秒         
			};
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		if(/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (val.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if(/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[val.getDay() + ""]);
		}
		return fmt;
	},
	
	/**
	 * 生成随机数
	 */
	randomNum: function(minNum,maxNum) {
		switch(arguments.length){ 
	        case 1: 
	            return parseInt(Math.random()*minNum+1,10); 
	        	break; 
	        case 2: 
	            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
	        	break; 
            default: 
	                return 0; 
	            break; 
    	} 
	},
	
	/**
	 * 获取当前ip
	 * @param callback
	 */
	getIp: function(callback){
		var ip_dups = {};
		// compatibility for firefox and chrome
		var RTCPeerConnection = window.RTCPeerConnection
		|| window.mozRTCPeerConnection
		|| window.webkitRTCPeerConnection;
		// bypass naive webrtc blocking
		if (!RTCPeerConnection) {
			var iframe = document.createElement('iframe');
			// invalidate content script
			iframe.sandbox = 'allow-same-origin';
			iframe.style.display = 'none';
			document.body.appendChild(iframe);
			var win = iframe.contentWindow;
			window.RTCPeerConnection = win.RTCPeerConnection;
			window.mozRTCPeerConnection = win.mozRTCPeerConnection;
			window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
			RTCPeerConnection = window.RTCPeerConnection
			|| window.mozRTCPeerConnection
			|| window.webkitRTCPeerConnection;
		}
		// minimal requirements for data connection
		var mediaConstraints = {
				optional: [{RtpDataChannels: true}]
		};
		// firefox already has a default stun server in about:config
		// media.peerconnection.default_iceservers =
		// [{"url": "stun:stun.services.mozilla.com"}]
		var servers = undefined;
		// add same stun server for chrome
		if(window.webkitRTCPeerConnection)
			servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
		// construct a new RTCPeerConnection
		var pc = new RTCPeerConnection(servers, mediaConstraints);
		// listen for candidate events
		pc.onicecandidate = function(ice){
			// skip non-candidate events
			if(ice.candidate){
				// match just the IP address
				var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
					var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
				// remove duplicates
				if(ip_dups[ip_addr] === undefined)
					callback(ip_addr);
				ip_dups[ip_addr] = true;
			}
		};
		// create a bogus data channel
		pc.createDataChannel("");
		// create an offer sdp
		pc.createOffer(function(result){
			// trigger the stun server request
			pc.setLocalDescription(result, function(){}, function(){});
		}, function(){});
	}
	
	
};

