<template>
	<el-aside class="c-el-aside">
		<!-- 导航 -->
		<el-menu class="el-aside-menu" router background-color="#000" :default-active="activeMenu" :collapse="!asideShow" active-text-color="#fff" text-color="#d8d8d8">
			<!-- 设置侧栏的隐藏 -->
			<el-row class="tittle">
				<template v-if="asideShow">
					<span>GTC银川管理平台</span>
					<i class="fa fa-chevron-left" @click="toggleAside"></i>
				</template>
				<i class="fa fa-chevron-right" @click="toggleAside" v-else></i>
			</el-row>

			<!-- 菜单 -->
			<el-submenu :index="menu.url" v-for="menu in menuList" :key="menu.url" v-if="menu.children.length > 0">
				<template slot="title">
					<i class="fa" :class="menu.icon"></i>
					<span>{{ menu.label }}</span>
				</template>
				<el-menu-item v-for="item in menu.children" :key="item.url" :index="item.url" v-if="item.url">
					{{ item.label }}
				</el-menu-item>
			</el-submenu>
			<el-menu-item :index="menu.url" :key="menu.url" v-else>
				<i class="fa" :class="menu.icon"></i>
				<span slot="title">{{ menu.label }}</span>
			</el-menu-item>
		</el-menu>
	</el-aside>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { authManagement } from "@/service/api";
	export default {
		data() {
			return {
				asideShow: true,
				activeMenu: '/',
				menuList: [
					{
						id: 0,
						label: '首页',
						url: '/',
						path: '',
						icon: 'fa-home',
						children: []
					},
					{
		                id:"1",
						label:"值机柜台",
						url: "/checkMap",
		                path:"/checkMap",
						icon:"el-icon-menu",
						children:[],
					},
					// {
		            //     id:"2",
					// 	label:"基础数据管理",
					// 	url: "/baseData",
		            //     path:"/baseData",
		            //     icon:"el-icon-menu",
		            //     children:[{
		            //             id:"2-1",
					// 			label:"地图管理",
					// 			url: "/baseData/map",
		            //             path:"/baseData/map",
		            //         },{
		            //             id:"2-2",
					// 			label:"区域管理",
					// 			url: "/baseData/area",
		            //             path:"/baseData/area",
		            //         },]
					// },
					{
		                id:"3",
						label:"商圈管理",
						url: "/tradingarea",
		                path:"/tradingarea",
						icon:"el-icon-menu",
						children:[],
					},
					{
		                id:"4",
						label:"景点查询",
						url: "/scenic",
		                path:"/scenic",
						icon:"el-icon-menu",
						children:[],
					},
					{
		                id:"5",
						label:"酒店管理",
						url: "/hotel",
		                path:"/hotel",
						icon:"el-icon-menu",
						children:[{
		                        id:"5-1",
								label:"酒店管理",
								url: "/hotel/hotelList",
		                        path:"/hotel/hotelList",
		                    },{
		                        id:"5-2",
								label:"客房管理",
								url: "/hotel/roomList",
		                        path:"/hotel/roomList",
		                }],
					},
					{
		                id:"6",
						label:"留言板管理",
						url: "/suggestions",
		                path:"/suggestions",
						icon:"el-icon-menu",
						children:[],
					},
					// {
		            //     id:"7",
					// 	label:"统计管理",
					// 	url: "/statistics",
		            //     path:"statistics",
					// 	icon:"el-icon-menu",
					// 	children:[],
					// },
					// {
		            //     id:"8",
					// 	label:"乘机须知",
					// 	url: "/notice",
		            //     path:"notice",
					// 	icon:"el-icon-menu",
					// 	children:[],
					// },
					// {
		            //     id:"10",
					// 	label:"权限管理",
					// 	url: "/auth",
		            //     path:"/auth",
		            //     icon:"fa fa-road",
		            //     children:[{
		            //             id:"11-1",
					// 			label:"角色管理",
					// 			url: "/auth/role",
		            //             path:"/auth/role",
		            //         },{
		            //             id:"11-2",
					// 			label:"账号管理",
					// 			url: "/auth/account",
		            //             path:"/auth/account",
		            //     }]
					// },
				],
			};
		},
		methods: {
			/**
			 * 载入VUX mutations
			 * SET_BREAD 设置面包屑状态的方法
			 */
			...mapMutations(['SET_BREAD', 'SET_ALLAUTH']),

			/**
			 * 初始化
			 */
			init() {
				this.asideShow = localStorage.getItem('asideShow') == 'false' ? false : true;
				this.activeMenu = localStorage.getItem('activeMenu') || '/';
				this.$router.push(this.activeMenu);
				this.$transfer.$on('updataMenu', () => this.menuAside());
			},

			/**
			 * 获取左侧导航栏
			 */
			async menuAside() {
				// let res = await authManagement.getModules();
				// if(!res) return;
				let home = [{
					id: 0,
					label: '首页',
					url: '/',
					icon: 'fa-home',
					children: []
				}];
				// this.menuList = home.concat(res.data);

				//保存vuex
				this.SET_ALLAUTH(this.menuList );
			},

			/**
			 * 通过路由修改活跃菜单
			 */
			activeIndex(val) {
				if(!val.query.type) {
					this.activeMenu = val.path;
					this.chooseNav(val.path);
				}
				//保存活跃菜单，防止刷新丢失
				localStorage.setItem('activeMenu', this.activeMenu);
			},

			/**
			 * 测栏导航联动面包屑
			 */
			chooseNav(url) {
				let arr = [];
				this.menuList.find(i => {
					if(i.url == url) {
						arr.push(i.label);
						return true;
					}else {
						i.children.find(j => {
							if(j.url == url) {
								arr.push(i.label);
								arr.push(j.label);
								return true;
							}
						});
					}
				});
				//改变状态，用于面包屑导航
				this.SET_BREAD(arr);
			},

			/**
			 * 收缩菜单
			 */
			toggleAside() {
				this.asideShow = !this.asideShow;
				localStorage.setItem('asideShow', this.asideShow);	//存储菜单展开状态
			},
		},
		watch: {
			'$route'(to,from) {
				// console.log('object',to,from);
				this.activeIndex(to);
			}
		},
		created() {
			this.init();
			this.menuAside();
		}
	}
</script>

<style lang='less'>
	@asideWidth: 270px;
	.c-el-aside {
		width: auto !important;
		height: 100%;
		overflow-x: hidden;
		.el-aside-menu {
			height: 100%;
		}
		.el-aside-menu:not(.el-menu--collapse) {
			width: @asideWidth;
		}
		.tittle {
			height: 100px;
			line-height: 1px;
			padding-top: 20px;
			color: #fff;
			background-color: #000;
			text-align: center;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 20px;
			letter-spacing: .3px;
			white-space: nowrap;
			i {
				font-size: 24px;
				cursor: pointer;
			}
		}
		.is-active {
			background: linear-gradient( 45deg,#29adeb, #177ce3) !important;
		}
		a {
			color: #fff;
			display: block;
		}
		.fa {
			vertical-align: middle;
			margin-right: 5px;
			width: 24px;
			text-align: center;
			font-size: 18px;
		}
	}
</style>