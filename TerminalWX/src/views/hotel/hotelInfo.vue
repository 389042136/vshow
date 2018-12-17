<template>
	<div>
		<x-header class="x-header" :title="hotelinfos.hotel_name_ch" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main">
			<div class="introduce flex flex-left">
				<div class="introduce-div-img">
				   <img class="introduce-img" src="../../assets/images/icon_title_detail.png">
				</div>
				<h5 class="introduce-h5">酒店简介</h5>
			</div>
			<div class="info-div">
				<div class="info flex flex-left">
					<div class="info-div-img">
						<img class="info-img" src="../../assets/images/icon_location_36.png">
					</div>
					<p class="info-km" v-if="hotelinfos.hotel_distant">[{{hotelinfos.hotel_distant}}km]</p>
					<p class="info-address">{{hotelinfos.hotel_address}}</p>
				</div>
				<div class="info-div-p">
					<p class="info-p">
						{{hotelinfos.hotel_content}}
					  <!-- 宁夏西港航空饭店位于银川河东国际机场西南侧,居于黄河河畔,
					  紧邻银川综合保税区。尽可揽“长河落日圆”的美景。银川市西北56公里平罗县境内的西大滩西北角 -->
					</p>
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
			<div class="room flex flex-left">
				<div class="room-div-img">
				  <img class="room-img" src="../../assets/images/icon_tilte_room.png">
				</div>
				<h5 class="room-h5">房型列表</h5>
			</div>
			<div class="div-ul">
				<ul class="flex flex-wrap notice-box"> 
					<li class="notice-box-item flex flex-left" v-for="(item, index) in hotelDataList" :key="index"
					    @click.stop="toNoticeInfo(item,index)" :id="'noticesItem'+index" >
						<div class="div-ul-img">
						   <img class="ul-img" :src="item.room_logo_list" alt=""  v-imgReactive>
						</div>
						<div class="down">
							<div class="down-div-t">
								<p class="pice" v-if="item.room_price">¥{{item.room_price}}每晚</p>{{item.room_name_ch}}
							</div>
							<ul class="right-info-ul flex flex-justfy">
								<li class="right-info-li flex flex-left"  v-if="item.room_num_of_bed !='0'">
									<div class="info-div-img">
										<img src="../../assets/images/icon_beds.png" class="info-img">
									</div>
									<h5 class="info-h5">{{item.room_num_of_bed}}张床</h5>
								</li>
								<li class="right-info-li flex flex-left" v-if="item.room_num_of_person !='0'">
									<div class="info-div-img">
										<img src="../../assets/images/icon_persons.png" class="info-img">
									</div>
									<h5 class="info-h5">最多{{item.room_num_of_bed}}人</h5>
								</li>
								<li class="right-info-li flex flex-left" v-if="item.room_breakfast !='0'">
									<div class="info-div-img">
										<img src="../../assets/images/icon_breakfast.png" class="info-img">
									</div>
									<h5 class="info-h5">双早</h5>
								</li>
							</ul>
						</div>
						<div class="cell-arrow flex flex-right">
							<i><img src="../../assets/images/list_arrow_right.png" alt=""></i>
						</div>
					</li>
				</ul>	
			</div>
		</div>
	</div>
</template>

<script>
import { getQueryHotelRoomList,getQueryHotelRoomInfo } from '../../service/api';
import { setTimeout } from 'timers';
export default {
	components: {},
	data() {
		return {
			params: {},
			hotelDataList: [],
			currentPage: 1,
			hotelinfos:[],
			arrPhone:[],
			roomList:[]
		}
	},
	methods: {
		callback(){
			this.$router.back(-1);
		},
		// 跳转房间详情页面
		toNoticeInfo(data,index){
			this.$router.push({name:'roomInfo', query:{"data":data,"hotelId":this.params.hotel_id}});
		},

		// 获取房间的具体信息
		QueryHotelRoomInfo(room_id){
			let param={
				"hotelId" :this.params.hotel_id,
				"roomId" :room_id
			}
		 return getQueryHotelRoomInfo(param).then(res=>{
				if(res && res.status == 0 && res.data){
					this.roomLis=[];
					this.roomList=res.data.hotelRoomInfo;
					return res.data.hotelRoomInfo;
				}
		  })
		},
		// 初始化方法，组装数据
		init(){
			getQueryHotelRoomList(this.params.hotel_id).then(res=>{
				this.hotelDataList = [];
				if(res && res.status == 0 && res.data){
					this.hotelinfos = res.data.hotel;
					//处理电话
					if(this.hotelinfos.hotel_mobile.indexOf(",") != -1){
						this.arrPhone=this.hotelinfos.hotel_mobile.split(",");
					}else{
						this.arrPhone[0]=this.hotelinfos.hotel_mobile;
					}
					//处理双早，入住人数
					this.hotelDataList = res.data.hotelRoomList;
					for (let index = 0; index < this.hotelDataList.length; index++) {
						this.QueryHotelRoomInfo(this.hotelDataList[index].room_id).then(res=>{
							const obj = Object.assign({}, this.hotelDataList[index],
													   { room_breakfast: res.room_breakfast,
													     room_num_of_bed: res.room_num_of_bed,
														 room_num_of_person: res.room_num_of_person 
														});
							this.$set(this.hotelDataList,index,obj);
						});
					}
				}
			})
		},
	},
	created(){
		this.params = this.$route.query;
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
	padding: 1.48rem 0.32rem 0;
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
				width: 0.28rem;
				height: 0.28rem;
				margin-right: 0.1rem;
				.info-img{
					width: 100%;
					height: 100%;
				}
			}
			.info-km{
				font-size: 0.24rem;
				color: @orange-color;
			}
			.info-address{
				font-size: 0.24rem;
				margin-left: 0.12rem;
				font-weight: normal;
				line-height: 0.4rem;
				// overflow: hidden;
				// text-overflow:ellipsis;
				// white-space: nowrap;
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
			margin-top:0.25rem ;
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
	    margin-top: 0.24rem;
		background-color:#FFFFFF;
		>ul.notice-box {
			padding: 0 0.32rem 0;
			li.notice-box-item {
				// border: #FF7640 1px solid;
				width: 100%;
				text-align: center;
				box-sizing: border-box;
				padding: 0.32rem 0  0.24rem;
				// overflow: hidden;
				border-bottom: 1px solid rgb(243, 237, 237);
				.div-ul-img{
					flex:0 0 1.6rem;
					height: 1.2rem;
					margin-right: 0.24rem;
					border-radius: 0.16rem;
					overflow: hidden;
				}
				.down{
					flex:1;
					padding: 0.16rem 0 0.1rem;
					.down-div-t{
						max-width: 3.7rem;
						height: 0.4rem;
						font-size: 0.28rem;
						font-weight: normal;
						text-align: left;
						color: @dark-color;
						overflow: hidden;
                		text-overflow: ellipsis;
						white-space: nowrap;
						.pice{
							display: inline-block;
							height: 0.34rem;
							font-family: 'squre';
							font-size: 0.28rem;
							font-weight: normal;
							text-align: left;
							line-height: 0.36rem;
							vertical-align: top;
							border-radius: 0.08rem;
							margin-right: 0.16rem;
							border: 0.02rem solid @red-color;
							color: @red-pice-color;
						}
					}

					.right-info-ul{
						width: 100%;
						margin-top: 0.16rem;
						>.right-info-li{
							display: block;
							margin-right: 0.22rem;
							&:last-child {
								margin-right: 0;
							}
						}
						.info-div-img{
							width: 0.28rem;
							height: 0.28rem;
							.info-img{
								width: 100%;
								height: 100%;
							}
						}
						.info-h5{
							font-size: 0.24rem;
							margin-left: 0.36rem;
							margin-top: -0.29rem;
							font-weight: normal;
							color: rgb(165, 160, 158);
						}
					}
					
				}
				.cell-arrow{
					width: 0.32rem;
					height: 0.32rem;
					// border: 0.02rem solid rgb(236, 80, 41);
					i{
						width: 0.32rem;
						height: 0.32rem;
						margin-top: 0.5rem;
						// border: 0.02rem solid rgb(236, 80, 41);
					}
				}
			}
		}
    }
}
</style>