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

//权限管理
const Auth = r => require.ensure([], () => r(require('@/views/auth/Auth.vue')));
const Role = r => require.ensure([], () => r(require('@/views/auth/role/role.vue')));
const Account = r => require.ensure([], () => r(require('@/views/auth/account/account.vue')));
const Resources = r => require.ensure([], () => r(require('@/views/auth/resources/resources.vue')));

//机场信息管理
const AirportInfo = r => require.ensure([], () => r(require('@/views/airportInfo/airportInfo.vue')));
const Query = r => require.ensure([], () => r(require('@/views/airportInfo/query/query.vue')));
const Params = r => require.ensure([], () => r(require('@/views/airportInfo/params/params.vue')));

//基础数据管理
const BaseData = r => require.ensure([], () => r(require('@/views/baseData/baseData.vue')));
const BasedataMap = r => require.ensure([], () => r(require('@/views/baseData/map/map.vue')));
const BasedataArea = r => require.ensure([], () => r(require('@/views/baseData/area/area.vue')));

//设备管理
const Device = r => require.ensure([], () => r(require('@/views/device/device.vue')));
const DeviceList = r => require.ensure([], () => r(require('@/views/device/deviceList/deviceList.vue')));
const AddEditDevice = r => require.ensure([], () => r(require('@/views/device/deviceList/addEditDevice.vue')));
const Position = r => require.ensure([], () => r(require('@/views/device/position/position.vue')));

//设备显示控制
const DisplayControl = r => require.ensure([], () => r(require('@/views/displayControl/displayControl.vue')));
const FreeText = r => require.ensure([], () => r(require('@/views/displayControl/freeText/freeText.vue')));
const ShowPage = r => require.ensure([], () => r(require('@/views/displayControl/showPage/showPage.vue')));
const Background = r => require.ensure([], () => r(require('@/views/displayControl/background/background.vue')));
const DIYPage = r => require.ensure([], () => r(require('@/views/displayControl/DIYPage/DIYPage.vue')));

//设备监控
const DeviceMonitor = r => require.ensure([], () => r(require('@/views/deviceMonitor/deviceMonitor.vue')));
const MapMonitor = r => require.ensure([], () => r(require('@/views/deviceMonitor/mapMonitor/mapMonitor.vue')));
const Deviceshow = r => require.ensure([], () => r(require('@/views/deviceMonitor/deviceshow/deviceshow.vue')));

//日志管理
const Log = r => require.ensure([], () => r(require('@/views/log/log.vue')));
const Loginlog = r => require.ensure([], () => r(require('@/views/log/loginlog/loginlog.vue')));
const Operationlog = r => require.ensure([], () => r(require('@/views/log/operationlog/operationlog.vue')));


export default new Router({
	//mode: 'history',  //H5 history模式
	routes: [{
			path: '/login',
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
					component: Home,
				},

				/**
				 * 权限管理
				 */
				{
					path: 'auth',
					redirect: 'auth/role',
					component: Auth,
					children: [
						//角色管理
						{
							path: 'role',
							component: Role,
						},
						//账号管理
						{
							path: 'account',
							component: Account,
						},
						//查看资源
						{
							path: 'resources',
							component: Resources,
						},
					]
				},

				/**
				 * 机场信息管理
				 */
				{
					path: 'airportInfo',
					redirect: 'airportInfo/query',
					component: AirportInfo,
					children: [
						//查看机场信息
						{
							path: 'query',
							component: Query,
						},
						//全局参数配置
						{
							path: 'params',
							component: Params,
						},
					]
				},

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

				/**
				 * 设备管理
				 */
				{
					path: 'device',
					redirect: 'device/deviceList',
					component: Device,
					children: [
						//设备列表
						{
							path: 'deviceList',
							component: DeviceList,
						},
						//新增编辑设备
						{
							path: 'addEditDevice',
							component: AddEditDevice,
						},
						//设备显示位置
						{
							path: 'position',
							component: Position,
						}
					]
				},

				/**
				 * 设备显示控制
				 */
				{
					path: 'displayControl',
					redirect: 'displayControl/freeText',
					component: DisplayControl,
					children: [
						//自由文本
						{
							path: 'freeText',
							component: FreeText,
						},
						//显示页面
						{
							path: 'showPage',
							component: ShowPage,
						},
						//背景资源
						{
							path: 'background',
							component: Background,
						},
						//自定义页面
						{
							path: 'DIYPage',
							component: DIYPage,
						}
					]
				},

				/**
				 * 设备监控
				 */
				{
					path: 'deviceMonitor',
					redirect: 'deviceMonitor/mapMonitor',
					component: DeviceMonitor,
					children: [
						//地图状态监控
						{
							path: 'mapMonitor',
							component: MapMonitor,
						},
						//地图显示
						{
							path: 'deviceshow',
							component: Deviceshow,
						}
					]
				},

				/**
				 * 日志管理
				 */
				{
					path: 'log',
					redirect: 'log/loginlog',
					component: Log,
					children: [
						//登录日志管理
						{
							path: 'loginlog',
							component: Loginlog,
						},
						//操作日志管理
						{
							path: 'operationlog',
							component: Operationlog,
						}
					]
				}
			]
		},
		{
			path: '*',
			redirect: '/',
		},
	]
})