<!--机场信息查看-->
<template>
	<div id="airportInfo">
		<ul>
			<li class="flex-a-center">
				<div class="left">机场名称：</div>
				<div class="right">{{ airportName }}</div>
			</li>
			<li class="flex-a-center">
				<div class="left">机场Logo：</div>
				<div class="right flex-a-center">
					<img :src="airportLogo" v-preview="airportLogo">
					<el-button type="primary" plain round @click="dialogShow = true">更换Logo</el-button>
				</div>
			</li>
			<li class="flex-a-center">
				<div class="left">有效使用时间：</div>
				<div class="right">{{ startTime }}  ~  {{ endTime }}</div>
			</li>
		</ul>
		<ChangeLogo :dialogData="airportLogo" :dialogShow="dialogShow" @dialogClose="dialogClose"></ChangeLogo>
	</div>
</template>

<script>
	import { airportInfo } from "@/service/api";
	import ChangeLogo from "./changeLogo";
	export default {
		components: {
			ChangeLogo
		},
		data() {
			return {
				airportName: '',
				airportLogo: '',
				startTime: '',
				endTime: '',
				dialogShow: false,
			}
		},
		methods: {
			/**
			 * 查询
			 */
			async getData() {
				let res = await airportInfo.getInfo();
				if(res) {
					this.airportName = res.data.entName;
					this.airportLogo = res.data.entLogo || require('@/assets/images/logo_default.png');
					this.startTime = res.data.entUseStartTimeString;
					this.endTime = res.data.entUseEndTimeString;
				}
			},

			/**
			 * 修改logo弹框关闭
			 */
			dialogClose(flag) {
				this.dialogShow = false;
				if(flag) this.getData();
			},
		},
		created() {
			this.getData();
		},
	}
</script>
<style lang="less">
	#airportInfo {
		padding-top: 50px;
		padding-left: 50px;
		font-size: 16px;
		letter-spacing: 1px;
		li {
			margin: 20px 0;
		}
		li .left {
			width: 180px;
			text-align: right;
			margin-right: 20px;
		}
		.right img {
			width: 100px;
			margin-right: 10px;
			cursor: pointer;
		}
	}
</style>