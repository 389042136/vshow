<template>
	<div id="app">
		<!-- <keep-alive> -->
			<router-view></router-view>
		<!-- </keep-alive> -->
		<!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
	</div>
</template>

<script>
	import { wxGetParams } from '@/service/api';
	export default {
		name: 'App',
		created() {
			/**
			 * 通过config接口注入权限验证配置
			 */
			let url = encodeURIComponent(location.href.split('#')[0]);
			wxGetParams(url).then(data => {
				this.$wechat.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.data.appId, // 必填，公众号的唯一标识
					timestamp: data.data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
					signature: data.data.signature,// 必填，签名，见附录1
					jsApiList: [
						'chooseImage',
						'previewImage',
						'uploadImage',
						'downloadImage'
					] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			});
		}
	}
</script>

<style>
	#app {
		width: 100%;
		height: 100%; 
		background-size: cover;
		/* overflow: hidden; */
	}
</style>