<template>
	<div>
		<x-header class="x-header" title="酒店查询" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main">
			<ul class="flex flex-wrap notice-box"> 
				<li class="notice-box-item" v-for="(item, index) in hotelDataList" :key="index" 
					@click.stop="toHotelInfo(item)" :id="'noticesItem'+index" >
					<div class="spot-sign">
						<i></i>
						{{item.hotel_position}}
					</div>
					<div class="div-img" v-elReactive="0.63">
						<img  v-if="item.hotel_logo_list != null && item.hotel_logo_list.indexOf('jpg') != -1" :src="item.hotel_logo_list" alt="">
						<img  v-else src="../../../static/room/room2.jpg" alt="">
					</div>
					<div class="down flex flex-column">
						<div class="down-div-t">
							<h4 class="div-h4">{{item.hotel_name_ch}}</h4>
							<p class="pice">
								¥{{item.the_cheapest_price}}<span>起</span>
							</p>
						</div>
						<div class="down-div-d flex flex-row">
							<p class="km">[{{item.hotel_distant}}km]</p>
							<p class="address">{{item.hotel_address}}</p>
						</div>
					</div>
				</li>
			</ul>		
		</div>
	</div>
</template>

<script>
	import { getQueryHotelList } from '../../service/api';
	import { setTimeout } from 'timers';
	export default {
		components: {
			
		},
		data() {
			return {
				hotelDataList: [],
				currentPage: 1,
			}
		},
		methods: {
			// 返回
      callback(){
         this.$router.back(-1);
			},
			// 页面跳转
			toHotelInfo(data){
				this.$router.push({name: 'hotelInfo', query: data});
			},
			// 初始化方法
			init(){
				getQueryHotelList().then(res=>{
					if( res && res.status == 0 && res.data){
						console.log('酒店列表',res.data);
						this.hotelDataList = res.data;
						console.log(this.hotelDataList[1].hotel_logo_list.type);
					}
				})
			},
		},
		created(){
			this.params = this.$route.params;
			this.params.enumType = 3;
			this.init();
		},
		mounted(){},
	}
</script>

<style lang='less' scoped>
@import '../../style/definition.less';
.index-header {
	width: 100%;
	height: 1.04rem;
	padding: 0 0.32rem 0;
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
	padding: 1.52rem 0.32rem 0;
	box-sizing: border-box;
	>ul.notice-box {
		width: 100%;
		box-sizing: border-box;
		li.notice-box-item {
			width: 47.5%;
			margin: 0 0.32rem 0 0;
			text-align: center;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
			&:nth-child(even){
				margin-right: 0;
			}
			.spot-sign {
					position: absolute;
					top: 0.4rem;
					right: -0.3rem;
					height: 0.36rem;
					line-height: 0.36rem;
					border-radius: 0.3rem;
					padding: 0 0.46rem 0 0.46rem;
					background: rgba(30,38,64,0.8);
					font-size: 0.22rem;
					// color: @gray-color;
					color: #fff;
					text-align: center;
					box-sizing: border-box;
					>i {
						position: absolute;
						top: 0.06rem;
						left: 0.1rem;
						width: 0.24rem;
						height: 0.24rem;
						background: url(../../assets/images/icon_location_36.png) no-repeat center center;
						background-size: 100% 100%;
					}
				}
			.div-img{
				width: 100%;
				height: 100%;
				overflow: hidden;
				border-radius: 0.16rem;
				img{
					width: 100%;
				    height: 100%;
				}
			}
			.down{
				margin-top: 0.22rem;
				margin-bottom: 0.36rem;
				.down-div-t{
					height: 0.3rem;
					.div-h4{
						font-size: 0.28rem;
						line-height: 0.3rem;
						font-weight: normal;
						text-align: left;
						width: 65%;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						color: @dark-color;
					}
					.pice{
						font-size: 0.28rem;
						font-family: 'squre';
						font-weight: normal;
						text-align: right;
						margin-top: -0.34rem;
						color: @red-color;
						span{
							font-size: 0.22rem;
						    font-weight: normal;
						}
					}
				}
				.down-div-d{
					height: 0.3rem;
					line-height: 0.3rem;
					padding: 0.10rem 0 0 0;
					.km{
						font-size: 0.22rem;
						font-weight: normal;
						text-align: left;
						color: @orange-color;
					}
					.address{
						font-size: 0.22rem;
						font-weight: normal;
						text-align: left;
						margin-top: -0.01rem;
						margin-left: 0.1rem;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						color: @gray-color;
					}
				}
			}

		}
	}
}


</style>