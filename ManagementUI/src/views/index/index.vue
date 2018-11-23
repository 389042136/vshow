<template>
	<el-container id="c-index">
		<!-- Aside -->
		<Aside class="c-el-aside"></Aside>
		<el-container direction="vertical">
			<!-- Header -->
			<Header></Header>
			<el-main class="c-main-con">
				<router-view class="c-router-view"></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	let device = [ {
      "dvcId" : 20003,
      "dvcIp" : "192.168.11.193",
      "zoneName" : "T1",
      "dvcName" : "候机引导",
      "status" : 2,
      "linkStatus" : null
	} ];
	import { mapState, mapMutations } from "vuex";
	import Header from "./header/header";
	import Aside from "./menuAside/menuAside";
	export default {
		components: { 
			Header,
			Aside,
		},
		data() {
			return {
				
			};
		},
		sockets:{
			connect_msg(data) {
				data = device;
				this.receiveMsg(data);
			},
			customEmit() {
				console.log('发送：', val)
			},
			disconnect() {
				console.log('断开连接...');
			}
		},
		methods: {
			...mapMutations(['SET_BREAKDEVICE']),

			/**
			 * 接收消息
			 */
			receiveMsg(data) {
				let _this = this;
				data.forEach((val, i) => {
					~ function(i) {
						let timer = setTimeout(() => {
							clearTimeout(timer);
							_this.notification(val);
						}, i * 10);
					}(i);
				});

				//将数据存入vuex中
				this.SET_BREAKDEVICE(data);
			},

			/**
			 * 通知内容
			 */
			notification(val) {
				this.$notify.error({
					title: 'ip:' + val.dvcIp,
					message: val.dvcName + '断开连接',
					position: 'bottom-right'
				});
			}
		},
	}
</script>

<style lang='less'>
	@headerH: 53px;
	#c-index {
		height: 100%;
		.c-main-con {
			padding: 0;
			height: calc(100% - @headerH);
		}
	}
</style>