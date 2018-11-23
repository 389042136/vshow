import axios from 'axios';
import { errorCode } from '@/utils/statusCode';
import { load } from '@/utils/utils';
import { Toast } from 'mint-ui';


//baseUrl: config.js 中定义的全局变量;

/**
 * 请求配置
 */
let baseRequest = async(callback) => {
	load.open();
	let requestConfig = {
		credentials: 'include',
		headers: {
			// 'Accept': 'application/json',
			'Content-Type': 'application/json;charset=UTF-8',
		},
		// mode: "cors",
		cache: "force-cache",
		//withCredentials: true ,
		timeout: 5000,
	}
	try {
		let response = await callback(requestConfig);
		let res = response.data;
		load.close();

		//全局错误提示
		if(errorCode[res.status]) {
			Toast(errorCode[res.status]);
			return false;
		}
		return res;
	} catch(error) {
		console.log(error);
		load.close();
		Toast('网络异常，请稍后再试');
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
};