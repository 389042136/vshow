"use strict";
import { Indicator } from 'mint-ui';

/**
 * 请求loading
 */
export const load = {
	open(str = '加载中...') {
		Indicator.open({
			text: str,
			spinnerType: 'fading-circle'
		});
	},
	close() {
		Indicator.close();
	}
}

/**
 * 日期格式化
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)、毫秒(S)只能用 1 个占位符
 * dateFormat(val,"yyyy-MM-dd HH:mm:ss") 	==> 2018-07-02 19:56:20
 * dateFormat(val,"yyyy-MM-dd hh:mm:ss.S") 	==> 2018-07-02 07:57:31.514
 * dateFormat(val,"yyyy-M-d H:m:s")      	==> 2018-07-02 7:58:7
 * dateFormat(val,"yyyy-MM-dd EEE hh:mm:ss")==> 2018-07-02 星期一 07:59:01
 */
export function dateFormat(val, fmt = 'yyyy-MM-dd HH:mm') {
	val = new Date(val);
	let week = ['日', '一', '二', '三', '四', '五', '六'],
		o = {
			"M+": val.getMonth() + 1, 	// 月份         
			"d+": val.getDate(), 		// 日         
			"h+": val.getHours() % 12 == 0 ? 12 : val.getHours() % 12, // 小时         
			"H+": val.getHours(), 		// 小时         
			"m+": val.getMinutes(),		// 分         
			"s+": val.getSeconds(), 	// 秒         
			"q+": Math.floor((val.getMonth() + 3) / 3), // 季度         
			"S" : val.getMilliseconds() // 毫秒         
		};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (val.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[val.getDay() + ""]);
	}
	for(let k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

/**
 * 去空格，转小写
 */
export function allTrim(str) {
	return str.replace(/\s*/g, "").toLowerCase();
}

/**
 * 表格数据排序
 */
export function dataSort(data, currentPage) {
	if(data instanceof Array) {
		if(data.length > 0) {
			for(let i = 0; i < data.length; i++) {
				data[i].fNum = (i + 1) + (currentPage - 1) * 50;
			}
			return data;
		}
	}
}

/**
 * 判断访问终端
 */
export function browser() {
	let u = navigator.userAgent;
	return {
		trident: u.indexOf('Trident') > -1, //IE内核
		presto: u.indexOf('Presto') > -1, //opera内核
		webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
		mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
		android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
		iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
		iPad: u.indexOf('iPad') > -1, //是否iPad
		webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
		weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
		qq: u.match(/\sQQ/i) == " qq" //是否QQ
	};
}

/**
 * 基础递归
 */
export function recursion(val, key, data) {
	try {
		let result = null;
		for(let item of data) {
			if(typeof item === 'undefined' && typeof item !== 'object') {
				return result;
			}
			for(let k in item) {
				if(key === k) {
					if(item[k] === val) {
						result = item;
					}
				}
			}
			if(result) {
				return result;
			}
			if(typeof item.children !== 'undefined' && item.children) {
				result = recursion(val, key, item.children);
			}
		}
		return result;
	} catch(error) {

	}
}

/**
 * 移动端h5页面，初始化rem
 */
!function(resolving){
	let n=window,
		e=n.document,
		t=e.documentElement,
		i=resolving,
		d=i/100,
		o="orientationchange"in n?"orientationchange":"resize",
		a=function(){
			var n=t.clientWidth||320;n>resolving&&(n=resolving);
			t.style.fontSize=n/d+"px"
		};
		e.addEventListener&&(n.addEventListener(o,a,!1),e.addEventListener("DOMContentLoaded",a,!1))
}(720);