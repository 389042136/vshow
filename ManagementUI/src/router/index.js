/**
 * 路由配置
 */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const Login = r => require.ensure([], () => r(require('@/views/login/login.vue')));
const Index = r => require.ensure([], () => r(require('@/views/index/index.vue')));

//首页
const Home = r => require.ensure([], () => r(require('@/views/home/home.vue')));
const Menu = r => require.ensure([], () => r(require('@/views/menu/menu.vue')));
// 值机柜台
const CheckMap = r => require.ensure([], () => r(require('@/views/checkMap/checkMap.vue')));
// 乘机须知
const Notice = r => require.ensure([], () => r(require('@/views/notice/notice.vue')));
// 引导设施管理
const Guidance = r => require.ensure([], () => r(require('@/views/guidance/guidance.vue')));
// 商圈管理
const Tradingarea = r => require.ensure([], () => r(require('@/views/tradingarea/tradingarea.vue')));
// 景点管理
const Scenic = r => require.ensure([], () => r(require('@/views/scenic/scenic.vue')));

// ---------------------------------------------------------------------------------------------
//权限管理
const Auth = r => require.ensure([], () => r(require('@/views/auth/Auth.vue')));
const Role = r => require.ensure([], () => r(require('@/views/auth/role/role.vue')));
const Account = r => require.ensure([], () => r(require('@/views/auth/account/account.vue')));

//基础数据管理
const BaseData = r => require.ensure([], () => r(require('@/views/baseData/baseData.vue')));
const BasedataMap = r => require.ensure([], () => r(require('@/views/baseData/map/map.vue')));
const BasedataArea = r => require.ensure([], () => r(require('@/views/baseData/area/area.vue')));


// 酒店管理
const Hotel = r => require.ensure([], () => r(require('@/views/hotel/hotel.vue')));
const HotelList = r => require.ensure([], () => r(require('@/views/hotel/hotelList/hotelList.vue')));
const RoomList = r => require.ensure([], () => r(require('@/views/hotel/roomList/roomList.vue')));

// 留言板管理
const Suggestions = r => require.ensure([], () => r(require('@/views/suggestions/suggestions.vue')));

// 统计管理
const Statistics = r => require.ensure([], () => r(require('@/views/statistics/statistics.vue')));
export default new Router({
	//mode: 'history',  //H5 history模式
	routes: [{
			path: '/login',
			name: '登录',
			component: Login,
		},
		{
			path: '/',
			component: Index,
			children: [
				/**
				 * 首页
				 */
				{
					path: '',
					name: '首页',
					component: Home,
				},
				/**
				 * 首页
				 */
				// {
				// 	path: 'menu',
				// 	name: '菜单维护',
				// 	component: Menu,
				// },
                /**
				 * 乘机须知
				 */
				// {
				// 	path: 'notice',
				// 	name: '乘机须知',
				// 	component: Notice,
				// },
				 /**
				 * 值机柜台
				 */
				{
					path: 'checkMap',
					name: '值机柜台',
					component: CheckMap,
				},
				 /**
				 * 引导设施管理
				 */
				{
					path: 'guidance',
					name: '引导设施',
					component: Guidance,
				},
				// 酒店管理
				{
					path: 'hotel',
					name: '酒店管理',
					redirect: 'hotel/hotelList',
					component: Hotel,
					children: [
						{
							path: 'hotelList',
							name: '酒店管理',
							component: HotelList,
						},
						{
							path: 'roomList',
							name: '客房管理',
							component: RoomList,
						},

					]
				},
				// 留言板管理
				{
					
					path: 'suggestions',
					name: '留言板管理',
					component: Suggestions,
				},
				 /**
				 * 商圈管理
				 */
				{
					path: 'tradingarea',
					component: Tradingarea,
				},
				/**
				 * 景点管理
				 */
				{
					path: 'scenic',
					component: Scenic,
				},
				/**
				 * 权限管理
				 */
				// {
				// 	path: 'auth',
				// 	redirect: 'auth/role',
				// 	component: Auth,
				// 	children: [
				// 		//角色管理
				// 		{
				// 			path: 'role',
				// 			component: Role,
				// 		},
				// 		//账号管理
				// 		{
				// 			path: 'account',
				// 			component: Account,
				// 		},
				// 	]
				// },

				/**
				 * 基础数据管理
				 */
				{
					path: 'baseData',
					redirect: 'baseData/map',
					component: BaseData,
					children: [
						//地图管理
						{
							path: 'map',
							component: BasedataMap,
						},
						//区域管理
						{
							path: 'area',
							component: BasedataArea,
						}
					]
				},
				// 统计管理
				{
					
					path: 'statistics',
					name: '统计管理',
					component: Statistics,
				},
			]
		},
		{
			path: '*',
			redirect: '/',
		},
	]
})