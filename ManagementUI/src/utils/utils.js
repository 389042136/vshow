"use strict";
import {
	Loading,
	Message,	//消息提示
	MessageBox	//弹框
} from 'element-ui';
import router from '@/router';
import { indexFn } from "@/service/api";
import { successCode } from '@/utils/statusCode';

/**
 * 请求loading
 */
export const load = {
	l: null,
	openLoading(str = 'Loading…') {
		this.l = Loading.service({
			lock: true,
			text: str,
			spinner: 'el-icon-loading',
			background: 'rgba(255, 255, 255, 0.2)'
		});
	},
	closeLoading() {
		this.l.close();
	}
}

/**
 * 操作提示
 */
export function showPrompt(callback, tittle = '此') {
	MessageBox.confirm(`确认执行${ tittle }操作吗？`, '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		callback();
	}).catch(() => {
		return false;
	});
}

/**
 * 格式校验
 */
export const formatCheck = {

	//表单验证
	form(obj, name) {
		let result = true;
		obj.$refs[name].validate((valid) => {
			if(!valid) {
				Message.warning('请完善信息!');
				result = false;
			}
		});
		return result;
	},

	//账号校验: 由6-30位数字、字母、下划线组成，并以字母开头
	account(str){
		let patrn = /^[a-zA-Z][0-9a-zA-Z-_]{5,29}$/;
		if(!patrn.test(str)) {
			return false;
		}
		return true;
	},

	//密码校验: 由6-30位数字、字母组成，不允许为纯数字或纯字母
	password(str) {
		let patrn = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/;
		if(!patrn.test(str)) {
			return false;
		}
		return true;
	},

	//数字 字母 下划线 中间线
	isNumCharLine(str) {
		let patrn = /^[a-zA-Z][0-9a-zA-Z-_/.]+$/; 
		if (!patrn.test(str)) {
			return false;  
		}
		return true; 
	},


	//英文 数字 空格
	isEnglish(str) {
		let patrn = /^[0-9a-zA-Z-\.\s]+$/; 
		if (!patrn.test(str)) {
			return false;  
		}
		return true; 
	},

	//手机号
	// isTel(str) {
	// 	let patrn = /^1[0-9]{10}$/;
	// 	if(!patrn.test(str)) {
	// 		return false;
	// 	}
	// 	return true;
	// },


	//手机号
	isTel(str) {
		let patrn = /(^\d{3,4}-\d{7,8}$)|(^1[0-9]{10}$)/;
		if(!patrn.test(str)) {
			return false;
		}
		return true;
	},
	

	//email校验
	isEmail(str) {
		let patrn = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT)$/;
		if(!patrn.test(str)) {
			return false;
		}
		return true;
	},

	//整数
	isInteger(str){
		let patrn = /^[0-9]\d*$/;
		if(!patrn.test(str)) {
			return false;
		}
		return true;
	},

	//IP地址校验
	isIP(str) {
		if(str.length > 15 || str.length < 7) {
			return false;
		}
		let patrn = /^((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){3}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
		if(!patrn.test(str)) {
			return false;
		}
		return true;
	},

	//MAC地址校验
	isMAC(str) {
		if(str.length != 17) {
			return false;
		}
		let patrn = /^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}$/;
		if(!patrn.test(str)) {
			return false;
		}
		return true;
	},

	//前后去空格
	trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},

	//字符串中包含特殊字符
	containSpecChars(str) {
		for(let i = 0; i < str.length; i++) {
			let c = str.charAt(i);
			switch(c) {
				case "|":
					return true;
				case "<":
					return true;
				case ">":
					return true;
				case "&":
					return true;
				case "%":
					return true;
				case "?":
					return true;
				case "$":
					return true;
				case "\\":
					return true;
				case "\'":
					return true;
				case "\"":
					return true;
				case "*":
					return true;
				case ".":
					return true;
				case "!":
					return true;
				case "`":
					return true;
				case "~":
					return true;
				case "@":
					return true;
				case "#":
					return true;
				case "^":
					return true;
				case "(":
					return true;
				case ")":
					return true;
				case "+":
					return true;
				case "=":
					return true;
				case "{":
					return true;
				case "}":
					return true;
				case "[":
					return true;
				case "]":
					return true;
				case ";":
					return true;
				case ":":
					return true;
				case "\"":
					return true;
			}
		}
		return false;
	}
}

/**
 * 校验文件格式，大小，文件名
 * file： 文件
 * typeArr: 文件类型，arr
 * maxSize：大小
 */
export function fileCheck(file, typeArr, maxSize) {
	//校验文件格式
	let flag = suffix(file.name, typeArr);
	if(!flag) {
		Message.warning('文件格式不正确');
		return false;
	}

	//校验文件大小
	flag = file.size / 1024 / 1024 > maxSize;
	if(flag) {
		Message.warning(`上传文件大小不允许超过 ${ maxSize } MB`);
		return false;
	}

	//校验文件名称
	/* flag = formatCheck.isNumCharLine(file.name);
	if(!flag) {
		Message.warning('文件名称由字母、数字、下划线或中间线组成，并以字母开头');
		return false;
	} */
	return true;
}

/**
 * 判断后缀名是否满足
 */
export function suffix(str, typeArr) {
	let index = str.lastIndexOf('.') + 1;
	let ext = str.substring(index).toLowerCase(); 
	return typeArr.includes(ext);
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
 * 账号退出
 */
export async function logout() {
	let res = await indexFn.logout();
	if(res.status == successCode) {
		// localStorage.removeItem('token');
		localStorage.removeItem('activeMenu');
		localStorage.removeItem('breadArr');
		localStorage.removeItem('token');
		router.push('/login');
	}
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
 * 深度复制
 */
export function deepClone(source) {
	let sourceCopy = source instanceof Array ? [] : {};
	for(let item in source) {
		sourceCopy[item] = typeof source[item] === 'object' ? deepClone(source[item]) : source[item];
	}
	return sourceCopy;
}

/**
 * 数组求差值
 */
export function diff(arrA, arrB) {
	return arrA.filter(function(i) {
		return arrB.indexOf(i) < 0;
	});
};

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