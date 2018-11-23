<template>
	<el-aside class="c-el-aside">
		<!-- 导航 -->
		<el-menu class="el-aside-menu" router background-color="#000" :default-active="activeMenu" :collapse="!asideShow" active-text-color="#fff" text-color="#d8d8d8">
			<!-- 设置侧栏的隐藏 -->
			<el-row class="tittle">
				<template v-if="asideShow">
					<span>GTC系统管理平台 </span>
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
				menuList: [],
				asideShow: true,
				activeMenu: '/',
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
				this.$transfer.$on('updataMenu', () => this.menuAside());
			},

			/**
			 * 获取左侧导航栏
			 */
			async menuAside() {
				let res = await authManagement.getModules();
				if(!res) return;
				let home = [{
					id: 0,
					label: '首页',
					url: '/',
					icon: 'fa-home',
					children: []
				}];
				this.menuList = home.concat(res.data);

				//保存vuex
				this.SET_ALLAUTH(res.data);
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
			'$route' (to) {
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