import axios from 'axios';
import { Message } from 'element-ui';
import { load, logout } from '@/utils/utils';
import { errorCode } from '@/utils/statusCode';
import router from '@/router';

//baseUrl: config.js 中定义的全局变量;

/**
 * 请求配置
 */
let baseRequest = async(callback) => {
	load.openLoading();
	let requestConfig = {
		credentials: 'include',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json;charset=UTF-8',
			// 'Authorization': localStorage.getItem("token") || '',
		},
		mode: "cors",
		cache: "force-cache",
		withCredentials: true ,
		timeout: 5000,
	}
	try {
		let response = await callback(requestConfig);
		let res = response.data;
		load.closeLoading();

		// //全局错误提示
		// if(errorCode[res.status]) {
			// Message.error(errorCode[res.status]);

			//重新登录
			if(res.status == '2007') {
				logout();
			}

			//无权限，返回首页
			if(res.status == '403') {
				router.push('/');
			}
			// return false;
		// }
		return res;
	} catch(error) {
		load.closeLoading();
		Message.error('网络异常，请稍后再试');
		return false;
	}
}

export default {
	get: async(url = '', params = {}) => {
		url = baseUrl + url;
		let res = await baseRequest(config => axios.get(url, { params } , config));
		return res;
	},
	post: async(url = '', data = {}) => {
		url = baseUrl + url;
		let res = await baseRequest(config => axios.post(url, data, config));
		return res;
	},
	put: async(url = '', data = {}) => {
		url = baseUrl + url;
		let res = await baseRequest(config => axios.put(url, data, config));
		return res;
	},
	delete: async(url = '', data = {}) => {
		url = baseUrl + url;
		let res = await baseRequest(config => axios.delete(url, data, config));
		return res;
	},
	uploadFile: async(url = '', data = {}, flag = 1) => {
		url = baseUrl + url;
		let config = {
			headers: {
				// 'Authorization': localStorage.getItem("token") || '',
			},
		};
		
		let form = new FormData();
		//增加多个文件
		if(data.files) {
			data.files.forEach(item => {
				form.append('file', item);
			});
			delete data.files;
		}
		for(let key in data) {
			form.append(key, data[key]);
		}

		if(flag) {
			return await baseRequest(() => axios.post(url, form, config));
		}else {
			return await baseRequest(() => axios.put(url, form, config));
		}
	},
};