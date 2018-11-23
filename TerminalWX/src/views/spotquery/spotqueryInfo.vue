<template>
	<div>
		 <x-header class="x-header" :title="spotInfoData.scenic_name_ch" :left-options="{backText:'',
		 preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main flex flex-column">
			<div class="introduce flex flex-left">
				<div class="introduce-div-img">
				   <img class="introduce-img" src="../../assets/images/icon_title_pic.png">
				</div>
				<p class="introduce-h5">景区图片</p>
			</div>
			<div class="img-div">
				<div class="div-border">
					<div class="swiper-slide" v-for="(item, index) in spotList" :key="index">
						<img class="swiper-slide-img" :src="item" v-imgReactive :onerror="defaultImg">
					</div>
				</div>
			</div>
			
			<div class="room flex flex-left">
				<div class="room-div-img">
				  <img class="room-img" src="../../assets/images/icon_title_detail.png">
				</div>
				<p class="room-h5">景点详情</p>
			</div>
			<div class="info-div">
				<div class="info flex flex-leftflex flex-left">
					<div class="info-div-img">
						<img class="info-img" src="../../assets/images/icon_location_28.png">
					</div>
					<p class="info-address">{{spotInfoData.scenic_address}}</p>
				</div>
				<div class="info-div-p">
					<p class="info-p">
					{{spotInfoData.scenic_content}}	
					</p>
				</div>
			</div>
			<div class="div-phone flex flex-column ">
				<p class="phone-p">
					开放时间：{{spotInfoData.scenic_open_time}} ~ {{spotInfoData.scenic_close_time}}
				</p>
				<p class="phone-p">参考票价：{{spotInfoData.scenic_price}}元/人</p>
				<p class="phone-p">
					 联系方式：
           			<span  v-for="(item, index) in arrPhone" :key="index" :id="'phone'+index" :href="'tel:' + item">
					   {{item}}
				    </span>
				</p>
				
			</div>
		</div>
	</div>
</template>

<script>
	import { getQueryScenicInfo } from '../../service/api';
	import { setTimeout } from 'timers';
	export default {
		components: {},
		data() {
			return {
				params: {},
				spotList: [],
				currentPage: 1,
				spotInfoData:[],
				arrPhone:[],
				defaultImg: 'this.src="' + require('../../assets/images/default_img_hotel.png') + '"',
			}
		},
		methods: {
			// 详情弹窗关闭
			detailClose(){
		
			},
			callback(){
					this.$router.back(-1);
			},
			toNoticeInfo(data,index){
				this.$router.push({path: '/hotelInfo', params: data});
			},
			init(){
				getQueryScenicInfo(this.params.scenic_id).then(res=>{
					this.spotInfoData = {};
					if(res && res.status == 0 && res.data) {
						this.spotInfoData = res.data;
						this.spotList=res.data.scenic_pic;
						 if(this.spotInfoData.scenic_mobile.indexOf(",") != -1){
							 this.arrPhone=this.spotInfoData.scenic_mobile.split(",");
						}else{
							 this.arrPhone[0]=this.spotInfoData.scenic_mobile;
						}
					}
				})
			},
		},
		created(){
			this.params = this.$route.params;
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
	width: 100%;
	padding: 1.52rem 0.32rem 0;
	box-sizing: border-box;
	.introduce{
		width: 100%;
		.introduce-div-img{
			height: 0.32rem;
			width: 0.32rem;
			margin-top: 0.04rem;
			.introduce-img{
				display: block;
				width: 100%;
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
		height: 1.8rem;
	    margin-top: 0.24rem;
		border-radius: 0.16rem;
		overflow: hidden;
		box-sizing: border-box;
		.div-border{
			height: 2rem;
		   display: flex;
		   overflow-x: auto;
			overflow-y: hidden;
		   justify-content: flex-start;
		   .swiper-slide{
				flex: 0 0 2.07rem;
				height: 1.6rem;
				display: inline-block;
				margin:0 0.16rem 0 0;
				border-radius: 0.16rem;
				overflow: hidden;
				position: relative;
				.swiper-slide-img{
					// height: 100%;
					// width:100%;
					// border-radius:0.16rem; 
					display: block;
	                position: absolute;
	                top: 50%;
	                left: 50%;
	                transform: translate(-50%,-50%);
				}
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
				display: block;
				width: 100%;
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
			.info-div-img{
				height: 0.28rem;
				width: 0.28rem;
				.info-img{
					width: 100%;
					height: 100%;
				}
			}
			.info-address{
				font-size: 0.24rem;
				margin-left: 0.12rem;
				font-weight: normal;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				color:#828999;
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
    .div-phone{
		width: 100%;
		padding: 0.32rem;
		margin-top: 0.24rem;
		border-radius: 0.24rem;
		box-sizing: border-box;
		background-color:#FFFFFF;
		.phone-p{
			color: #828999;
			text-align: left;
			font-size: 0.24rem;
			font-weight: normal;
			line-height: 0.4rem;
			span{
				margin-left: -0.06rem;
				margin-right: 0.2rem;
			}
		}
	}
}
</style>