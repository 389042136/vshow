<template>
	<div>
		<div id="fullScreenCon" ref="fullScreenCon" v-if="maskImg" @click="maskImg = false">
			<img :src="fullScreenImg" alt="">
		</div>
		 <x-header class="x-header" :title="tabInfoData.business_name_ch" :left-options="{backText:'',
		 preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main">
			<div class="introduce flex flex-left">
				<div class="introduce-div-img">
				   <img class="introduce-img" src="../../assets/images/icon_title_pic.png">
				</div>
				<h5 class="introduce-h5">店铺实景</h5>
			</div>
			<div class="img-div flex flex-wrap">
				<div class="img-item" v-for="(item, index) in tabInfoData.business_pic" :key="index">
					<img :src="item" :onerror="defaultImg"  v-imgReactive @click="toFullScreen(item)">
				</div>
			</div>
			
			<div class="room flex flex-left">
				<div class="room-div-img">
				  <img class="room-img" src="../../assets/images/icon_title_detail.png">
				</div>
				<h5 class="room-h5">店铺详情</h5>
			</div>
			<div class="info-div flex flex-column">
				<div class="info">
					<p class="info-time">营业时间：{{tabInfoData.business_open_time}} ~ {{tabInfoData.business_close_time}}</p>
				</div>
				<div class="info-div-p">
					<p class="info-p">{{tabInfoData.business_content}}</p>
				</div>
			</div>
			<div class="phone flex flex-center">
                 <div class="div-phone flex flex-center" v-for="(item, index) in arrPhone" :key="index" :id="'phone'+index">
					<div class="div-phone-img">
					<img class="phone-img" src="../../assets/images/icon_phone_orange.png">
					</div>
					<a class="phone-p1" :href="'tel:' + item">{{item}}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { getQueryBusinessInfo } from '../../service/api';
	import { setTimeout } from 'timers';
	export default {
		components: {
		},
		data() {
			return {
				params: {},
				hotelDataList: [],
				currentPage: 1,
				tabInfoData:[],
				arrPhone:[],
				defaultImg: 'this.src="' + require('../../assets/images/default_img_hotel.png') + '"',
				maskImg: false,
				fullScreenImg: "",
			}
		},
		methods: {
			callback(){
					this.$router.back(-1);
			},

			// 跳转页面
			toNoticeInfo(data,index){
				this.$router.push({path: '/hotelInfo', params: data});
			},

			// 获取数据
			getData(id){
		        getQueryBusinessInfo(id).then(res=>{
					if( res && res.status == 0 && res.data){
						this.tabInfoData = res.data;
						if(this.tabInfoData.business_mobile.indexOf(",") != -1){
							this.arrPhone=this.tabInfoData.business_mobile.split(",");
						}else{
							this.arrPhone[0]=this.tabInfoData.business_mobile;
						}
					}
				})
				
			},
			//全屏
			toFullScreen(src) {
				this.fullScreenImg = src;
				this.maskImg = true;
			}
		},
		created(){
			this.params = this.$route.params;
			this.getData(this.params.business_id);
		},
		mounted(){
			
		 },


		
	}
</script>

<style lang='less' scoped>
@import '../../style/definition.less';
#fullScreenCon {
	position: fixed;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	z-index: 99;
	img {
		position: absolute;
		width: 100%;
		height: auto;
		top: 50%;
		transform: translateY(-50%);
	}
}
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
	padding: 1.4rem 0.32rem 0;
	box-sizing: border-box;
	.introduce{
		width: 100%;
		.introduce-div-img{
			height: 0.32rem;
			width: 0.32rem;
			margin-top: 0.04rem;
			.introduce-img{
				width: 0.32rem;
				height: 0.32rem;
			}
		 }
		.introduce-h5{
			font-size: 0.28rem;
			margin-left: 0.12rem;
			font-weight: normal;
		}
	}
	.img-div{
		width: 100%;
	    margin-top: 0.24rem;
		overflow: hidden;
		box-sizing: border-box;
		.img-item {
			flex: 0 0 31.6%;
			height: 1.6rem;
			margin-right: 2.4%;
			margin-bottom: 0.16rem;
			border-radius: 0.16rem;
			overflow: hidden;
			position: relative;
			&:nth-child(3n) {
				margin-right: 0;
			}
			img {
				display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
			}
		}
    }
    .room{
		width: 6.5rem;
		margin-top: 0.4rem;
		margin-bottom: 0.1rem;
		.room-div-img{
			height: 0.32rem;
			width: 0.32rem;
			margin-top: 0.04rem;
			.room-img{
				width: 0.32rem;
				height: 0.32rem;
			}
		 }
		.room-h5{
			font-size: 0.28rem;
			margin-left: 0.12rem;
			font-weight: normal;
		}
	}
	.info-div{
		width: 100%;
	    margin-top: 0.24rem;
		border-radius: 0.24rem;
		box-sizing: border-box;
		padding:0.32rem 0.32rem ;
		background-color:#FFFFFF;
		.info{
			width: 100%;
		    box-sizing: border-box;
			.info-time{
				font-size: 0.24rem;
				color: #828999;
			}
		}
		.info-div-p{
			width: 100%;
			box-sizing: border-box;
			margin-top: 0.22rem;
			.info-p{
				text-align:justify;
				font-size: 0.28rem;
				font-weight: normal;
				line-height: 0.48rem;
			}
		}
	}
    .phone{
		width: 100%;
		height: 0.8rem;
		margin-top: 0.3rem;
		border-radius: 0.24rem;
		box-sizing: border-box;
		padding:0 0.32rem 0 ;
		background-color:#FFFFFF;
		.div-phone{
			flex: 1;
			height: 0.4rem;
			margin-top:0.2rem ;
			.div-phone-img{
				width: 0.32rem;
				height: 0.32rem;
				margin-top: 0.01rem;
				margin-right: 0.16rem;
				.phone-img{
					width: 100%;
					height: 100%;
				}
			}
			.phone-p1{
				text-align: left;
				font-size: 0.28rem;
				font-weight: normal;
				color: #FF7640;
			}
			:nth-child(2){
				border: none;
			}
		}
		:nth-child(2){
			border-left: #eaebed 1px solid;
		}
	}
}
</style>