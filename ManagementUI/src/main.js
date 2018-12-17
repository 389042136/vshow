// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index';
import ElementUI from 'element-ui';
import PicturePreview from 'vue-picture-preview';
import { successCode } from '@/utils/statusCode';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';
import './style/rest.less';
import './style/cover.less';


/**
 * 引入组件
 */
Vue.use(ElementUI, { size: 'small' });
Vue.use(PicturePreview);
/**
 * 路由拦截
 */
const whiteList = ['/login'];
router.beforeEach(async(to, from, next) => {
	// 判断是否有token
	if(localStorage.getItem('token')) {
		if(to.path === '/login') {
			next(false);
		} else {
			if(!store.getters.globalParams.ftp_url) {
				await store.dispatch('get_globalparams');
			}
			next();
		}
	} else {
		if(whiteList.includes(to.path)) {
			next(); 				// 在免登录白名单，直接进入
		} else {
			next('/login'); 		// 若token不存在，跳转到登录
		}
		store.dispatch('clearAll'); // 清空vuex
	}
});

/**
 * 通过使用一个空的Vue实例作为中央事件总线
 * 非父子组件通信
 */
Vue.prototype.$transfer = new Vue();

/**
 * 成功状态码
 */
Vue.prototype.$successCode = successCode;

/**
 * 实例化
 */
Vue.config.productionTip = false;
new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
});

window.log = console.log.bind(console);