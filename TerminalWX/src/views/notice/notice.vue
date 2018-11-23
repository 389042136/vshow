<template>
	<div>
		<x-header class="x-header" title="乘机须知" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main">
			<ul class="flex flex-wrap notice-box"> 
				<router-link tag="li" :to="{name:'noticeInfo', params:item}" v-for="(item, index) in secondaryDataList" :key="index" :id="'noticesItem'+index" class="notice-box-item" :class="'bgImg'+index" >
					<div class="div-img">
						<img v-if="item.enumId == 5" src="../../assets/images/icon_notice.png" alt="">
						<img v-if="item.enumId == 6" src="../../assets/images/icon_notice_sercurity.png" alt="">
						<img v-if="item.enumId == 7" src="../../assets/images/icon_notice_object.png" alt="">
						<img v-if="item.enumId == 8" src="../../assets/images/icon_notice_luggage.png" alt="">
						<img v-if="item.enumId == 9" src="../../assets/images/icon_notice_certificate.png" alt="">
					</div>
					<h4>{{item.enumName}}</h4>
				</router-link>
			</ul>		
		</div>
	</div>
	
</template>

<script>
	import { Tab, TabItem } from '../../components/vux/tab/index';
	import { getMenulist } from '../../service/api';
	import { setTimeout } from 'timers';
	export default {
		components: {
			Tab,
            TabItem,
		},
		data() {
			return {
				params: {},
				secondaryDataList: [],
				currentPage: 1,
			}
		},
		methods: {
			// 详情弹窗关闭
			detailClose(){
			},
            callback(){
                this.$router.push({name: 'index'});
			},
			toNoticeInfo(data){
				this.$router.push({path: '/noticeInfo'});
			},
			init(){
				getMenulist({
					queryData: this.params,
					currentPage: this.currentPage,
				}).then(res=>{
					this.secondaryDataList = [];
					if(res && res.status == 0 && res.data){
						this.secondaryDataList = res.data.returnDatas;

					}
				})
			},
		},
		created(){
			this.params = this.$route.params;
			this.params.enumType = 3;
			this.init();
		},
		mounted(){
			
		},


		
	}
</script>

<style lang='less' scoped>
@import '../../style/definition.less';
.index-header {
	width: 100%;
	height: 1rem;
	padding: 0 0.32rem;
	font-size: 0.36rem;
	box-sizing: border-box;
	.icon-back {
		width: 0.44rem;
		height: 0.44rem;
		img {
			width: 100%;
		}
	}
}
.notice-main {
	height: 100%;
	width: 100%;
	padding: 1rem 0.32rem 0 0.32rem;
	box-sizing: border-box;
	>ul.notice-box {
		margin-top: 0.5rem;
		li.notice-box-item {
			width: 48%;
			height: 1.6rem;
			padding-top: 0.9rem;
			border-radius: 0.24rem;
			margin: 0 4% 4% 0;
			text-align: center;
			box-sizing: border-box;
			position: relative;
			.div-img{
				width: 0.64rem;
				height: 0.64rem;
				position: absolute;
				top: 0.15rem;
				left: 50%;
				transform: translateX(-50%);
			}
			
			h4 {
				font-size: 0.32rem;
				font-weight: normal;
				color: #fff;
			}
			&.bgImg0 {
				background: url(../../assets/images/notice_boarding_bg.png) no-repeat center;
				background-size: 100%;
			}
			&.bgImg1 {
				background: url(../../assets/images/notice_sercurity_bg.png) no-repeat center;
				background-size: 100%;
			}
			&.bgImg2 {
				background: url(../../assets/images/notice_object_bg.png) no-repeat center;
				background-size: 100%;
			}
			&.bgImg3 {
				background: url(../../assets/images/notice_luggage_bg.png) no-repeat center;
				background-size: 100%;
			}
			&.bgImg4 {
				background: url(../../assets/images/notice_passport_bg.png) no-repeat center;
				background-size: 100%;
			}
			&:nth-child(even){
				margin-right: 0;
			}
			

		}
	}



}


</style>