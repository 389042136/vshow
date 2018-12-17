<template>
	<el-header class="c-header" height="53px">
		<EditPassBox @dialogClose="dialogClose" :dialogShow="dialogShow"></EditPassBox>
		<!-- this header context -->
		<el-row type="flex" justify="space-between">
			<el-col :span="12" class="nav-notice flex-a-center">
				<i class="fa fa-fire" aria-hidden="true"></i>GTC银川后台管理系统
			</el-col>
			<el-col :span="12" class="flex-j-right flex-a-center">
				<div class="nav-location flex-a-center">
					<i class="fa fa-globe"></i>当前位置：
				</div>
				<el-breadcrumb separator-class="el-icon-arrow-right" class="c-bread font-bold">
					<el-breadcrumb-item v-for="(item, index) in breadArr" :key="index">{{ item }}</el-breadcrumb-item>
				</el-breadcrumb>
				<!-- 消息 -->
				<el-badge :max="99" class="badge-item">
					<el-button class="notice-set" round><i class="fa fa-bell"></i></el-button>
				</el-badge>
				<!-- 用户设置 -->
				<el-dropdown @command="handleCommand" trigger="click" size="small">
					<el-button class="user-set" round size="small"><i class="fa fa-user"></i></el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="editPass"><i class="el-icon-edit"></i> 修改密码</el-dropdown-item>
						<el-dropdown-item command="exit"><i class="el-icon-circle-close-outline"></i> 退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-row>
	</el-header>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import { showPrompt, logout } from "@/utils/utils";
	import EditPassBox from "./editPassword";
	export default {
		components: {
			EditPassBox
		},
		computed: {
			...mapState(['breadArr']),
		},
		data() {
			return {
				dialogShow: false,
			};
		},
		methods: {
			...mapMutations(['SET_BREAD']),

			/**
			 * 初始化
			 */
			init() {
				let arr = JSON.parse(localStorage.getItem("breadArr"));
				if(!arr || arr.length == 0) {
					arr = ['首页'];
				}
				this.SET_BREAD(arr);
			},

			/**
			 * dropdown的选项判断
			 * @param command String dropdown-item的command值
			 */
			handleCommand(command) {
				if(command == 'exit') {
					showPrompt(() => logout(), '退出');
				} else if(command == 'editPass') {
					this.dialogShow = true;
				}
			},

			dialogClose() {
				this.dialogShow = false;
			}
		},
		created() {
			this.init();
		},
		watch: {
			breadArr(val) {
				//存储面包屑导航，防止页面刷新状态改变
				localStorage.setItem('breadArr', JSON.stringify(val));
			}
		}

	}
</script>

<style lang='less'>
	.c-header {
		border-bottom: 1px solid rgba(148, 168, 189, 0.3);
		background: linear-gradient(to left, rgba(148, 168, 189, 0.3), rgb(255, 255, 255));
		&.el-header {
			padding: 10px;
		}
		.c-bread {
			padding-right: 20px;
		}
		.nav-notice {
			padding-left: 12px;
			font-size: 16px;
			letter-spacing: 3px;
			i {
				margin-right: 12px;
				font-size: 24px;
				color: #67C23A;
			}
		}
		.nav-location {
			padding-right: 5px;
			line-height: 0;
			i {
				margin-right: 5px;
				font-size: 20px;
			}
		}
		.el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner {
			color: #333;
		}
		.user-set {
			margin: 0 10px;
		}
		.badge-item {
			margin-right: 5px;
		}
		.badge-item>sup {
			right: 20px;
			top: 5px;
		}
	}
</style>