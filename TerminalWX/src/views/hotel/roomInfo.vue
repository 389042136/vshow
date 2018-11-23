<template>
	<div>
		<mt-header :title="params.room_name_ch" class="index-header " fixed>
		    <div slot="left" class="icon-back" @click="callback">
				<img src="../../assets/images/icon_header_back.png" alt="">
			</div>
			<div slot="right" class="flex flex-right">
				<div class="pice flex flex-right">
					<p class="pice-p">
						¥{{hotelRoomInfo.room_price}}<span>每晚</span>
					</p>
				</div>
			</div>
		</mt-header>
		<div class="index-main notice-main">
			<div class="introduce flex flex-left">
				<div class="introduce-div-img">
				   <img class="introduce-img" src="../../assets/images/icon_title_pic.png">
				</div>
				<h5 class="introduce-h5">房间照片</h5>
			</div>
			<div class="img-div">
				<div class="div-border">
					<div class="swiper-slide" v-for="(item, index) in hotelRoomInfo.room_pic" :key="index">
						<img class="swiper-slide-img" :src="item" :onerror="defaultImg"  v-imgReactive>
					</div>
				</div>
			</div>
			<div class="room flex flex-left">
				<div class="room-div-img">
				  <img class="room-img" src="../../assets/images/icon_title_detail.png" >
				</div>
				<h5 class="room-h5">房间设施</h5>
			</div>
			<div class="div-ul">
				<ul class="installations-ul flex flex-wrap">
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_wifi == '1'">
						<div class="installations-div-img">
							<img class="installations-img" src="../../assets/images/icon_facility_wifi.png">
						</div>
						<h6 class="installations-ul-h6">wifi</h6>
					</li>
					<li  class="installations-li flex flex-column"  v-if="roomList != null && roomList.room_dev_phone == '1'">
						<div class="installations-div-img">
							<img class="installations-img" src="../../assets/images/icon_facility_phone.png">
						</div>
						<h6 class="installations-ul-h6">电话</h6>
					</li>
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_blower == '1'">
						<div class="installations-div-img" >
							<img class="installations-img" src="../../assets/images/icon_facility_blower.png">
						</div>
						<h6 class="installations-ul-h6">吹风机</h6>
					</li>
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_air_conditioning == '1'">
						<div class="installations-div-img" >
							<img class="installations-img" src="../../assets/images/icon_facility_AC.png">
						</div>
						<h6 class="installations-ul-h6">空调</h6>
					</li>
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_heat == '1'">
						<div class="installations-div-img">
							<img class="installations-img" src="../../assets/images/icon_facility_heating.png">
						</div>
						<h6 class="installations-ul-h6">暖气</h6>
					</li>
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_tv == '1'">
						<div class="installations-div-img">
							<img class="installations-img" src="../../assets/images/icon_facility_TV.png">
						</div>
						<h6 class="installations-ul-h6">电视</h6>
					</li>
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_shower == '1'">
						<div class="installations-div-img">
							<img class="installations-img" src="../../assets/images/icon_facility_shower.png">
						</div>
						<h6 class="installations-ul-h6">淋浴</h6>
					</li>
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_toilet == '1'">
						<div class="installations-div-img">
							<img class="installations-img" src="../../assets/images/icon_facility_toilet.png">
						</div>
						<h6 class="installations-ul-h6">卫生间</h6>
					</li>
					<li  class="installations-li flex flex-column" v-if="roomList != null && roomList.room_dev_hanger == '1'">
						<div class="installations-div-img">
							<img class="installations-img" src="../../assets/images/icon_facility_hanger.png">
						</div>
						<h6 class="installations-ul-h6">衣架</h6>
					</li>
				</ul>	
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
	import { getQueryHotelRoomInfo } from '../../service/api';
	import { setTimeout } from 'timers';
	export default {
		components: {
		},
		data() {
			return {
				params: {},
				hotelDataList: [],
				currentPage: 1,
				hotelId:'',
				roomList:[],
				hotelRoomInfo:[],
				arrPhone:[],
				defaultImg: 'this.src="' + require('../../assets/images/default_img_hotel.png') + '"',
			}
		},
		methods: {
			// 返回
			callback(){
					this.$router.back(-1);
			},

			// 页面跳转
			toNoticeInfo(data,index){
				this.$router.push({path: '/hotelInfo', params: data});
			},
			// 初始化方法
			init(){
				let param={
					"hotelId" :this.hotelId,
					"roomId" : this.params.room_id
				 }
				getQueryHotelRoomInfo(param).then(res=>{
						if(res && res.status == 0 && res.data){
							this.roomList=res.data.hotelRoomInfoDev;
								this.hotelDataList = res.data.hotel;
							this.hotelRoomInfo = res.data.hotelRoomInfo;
							if(this.hotelDataList.hotel_mobile.indexOf(",") != -1){
								this.arrPhone=this.hotelDataList.hotel_mobile.split(",");
							}else{
								this.arrPhone[0]=this.hotelDataList.hotel_mobile;
							}
						}
					})
			  },
		},
		created(){
			this.params = this.$route.query.data;
			this.hotelId=this.$route.query.hotelId;
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
	height: 1.04rem;
	padding: 0 0.32rem;
	font-size: 0.36rem;
	box-sizing: border-box;
	.icon-back {
		width: 0.64rem;
		height: 0.64rem;
		margin-left: -0.12rem;
		img {
			width: 100%;
		}
	}
	.pice{
		height: 0.36rem;
		border-radius: 0.1rem;
		position:relative;
		padding: 0.1rem 0.1rem 0rem ;
		text-align: center;
		border:  2px solid @red-pice-color;
		.pice-p{
		   font-size: 0.28rem;
		   font-family: 'squre';
		   color: @red-pice-color;
		   span{
			    font-size: 0.24rem;
		   }
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
	.info-div{
		height: 2.5rem;
	    margin-top: 0.2rem;
		border-radius: 0.2rem;
        overflow-y: hidden;
		.div-border{
           display: flex;
		   justify-content: flex-start;
		   .swiper-slide{
				width: 30%;
				height: 2.0rem;
				display: inline-block;
				margin:0.25rem 3.5% 0 0;
				.swiper-img{
					height: 100%;
					width:100%;
					border-radius:0.24rem; 
				}
			}
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
					display: block;
	                position: absolute;
	                top: 50%;
	                left: 50%;
	                transform: translate(-50%,-50%);
				}
			}
		}
    }
	.schedule{
		width: 100%;
		height: 100%;
		margin-top: 0.5rem;
		.schedule-div-img{
			height: 0.5rem;
			width: 0.5rem;
			.schedule-img{
				width: 100%;
				height: 100%;
			}
		 }
		.schedule-h5{
			text-align: left;
			font-size: 0.35rem;
			margin-top: -0.5rem;
			margin-left: 0.7rem;
			font-weight: normal;
		}
	}
  .phone{
		width: 100%;
		height: 0.8rem;
		margin-top: 0.3rem;
		padding:0 0.32rem 0 ;
		border-radius: 0.24rem;
		box-sizing: border-box;
		background-color:#FFFFFF;
		.div-phone{
			flex: 1;
			height: 0.4rem;
			margin-top:0.25rem;
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
				color: @orange-color;
			}
			:nth-child(2){
				border: none;
			}
		}
		:nth-child(2){
			border-left: #eaebed 1px solid;
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
	.div-ul{
		width: 100%;
		margin-top: 0.24rem;
		background-color:#fff;
		border-radius: 0.24rem;
		.installations-ul{
			padding: 0.32rem 0.32rem 0 0.32rem ;
			.installations-li{
				width: 20%;
				text-align: center;
				.installations-div-img{
					display: flex;
                    justify-content: center;
					.installations-img{
						width: 0.56rem;
						height: 0.56rem;
					}
				}
				.installations-ul-h6{
					 font-size: 0.24rem;
					 margin-top: 0.12rem;
					 margin-bottom: 0.32rem;
					 font-weight: normal;
				}

			}
			
		}
	}
}
</style>