// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index';
import MintUI from 'mint-ui';
import { XHeader, Panel, Popup, Search, CellBox, XInput, WechatPlugin, ToastPlugin } from 'vux';
import directive from './tools/directive';
import { successCode } from '@/utils/statusCode';
import { browser } from '@/utils/utils';
import '@/assets/font/font.css';
import 'swiper/dist/css/swiper.css';
import "mint-ui/lib/style.css";
import '@/assets/css/animate.min.css';
import './style/definition.less';
import './style/rest.less';
import './style/cover.less';

/**
 * 引入组件
 */

Vue.use(MintUI);
Vue.use(WechatPlugin);
Vue.use(ToastPlugin); 
Vue.component('x-header', XHeader)
Vue.component('panel', Panel)
Vue.component('popup', Popup)
Vue.component('search', Search)
Vue.component('cell-box', CellBox)
Vue.component('x-input', XInput)


/**
 * 移除移动端页面点击延迟
 */
const FastClick = require('fastclick')
FastClick.attach(document.body)

/**
 * 路由拦截
 */
// router.beforeEach((to, from, next) => {
// 	// 微信浏览器拦截，只能在微信内置浏览器中访问
// 	if(browser().weixin || to.path == '/WXError') {
// 		next();
// 	}else {
// 		next('/WXError'); 
// 	}
// });

/**
 * 通过使用一个空的Vue实例作为中央事件总线
 * 非父子组件通信
 */
Vue.prototype.$transfer = new Vue();

/**
 * 成功状态码
 */
Vue.prototype.$successCode = successCode;

directive(Vue);

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