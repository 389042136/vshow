<template>
	<div class="index" style="padding-bottom: 0.5rem;">
		<!-- 二级菜单列表弹窗 -->
		<!-- <router-view></router-view> -->
		<div class="index-header flex flex-justify">
			<div class="flex">
				<div class="header-logo">
					<img src="../assets/images/home_logo.png" alt="">
		        </div>
		        <div class="header-title">
		            <h1>银川河东国际机场</h1>
		            <p>Yinchuan Hedong International Airport</p>
		        </div> 	
			</div>
			<weather-control :panelCity="'INC'" class="index-header-weather"></weather-control>
		</div>
		<div class="index-nav">
			<div class="index-nav-top" ref="navTop" v-elReactive="0.427">
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<img src="../assets/images/banner1.png" alt="">
						</div>
						<div class="swiper-slide">
							<img src="../assets/images/banner2.png" alt="">
						</div>
						<div class="swiper-slide">
							<img src="../assets/images/banner3.png" alt="">
						</div>
					</div>
					<div class="swiper-pagination"></div>
				</div>
			</div>
			<div class="index-nav-bottom flex flex-justify">
				<router-link tag="div" to="/flights" class="index-nav-item">
					<img src="../assets/images/icon_flight_white.png" alt="">
					<div class="index-nav-title">
						<h3>航班查询</h3>
						<p>
							进出港航班查询
						</p>
					</div>
				</router-link>
				<router-link tag="div" to="/airport" class="index-nav-item">
					<img src="../assets/images/icon_nav_white.png" alt="">
					<div class="index-nav-title">
						<h3>值机柜台</h3>
						<p>
							柜台功能分布
						</p>
					</div>
				</router-link>
			</div>
		</div>
		<div class="index-all index-part" v-if="allFuncList&&allFuncList.length">
			<div class="index-part-title">
				<p></p>
				<h3>
					<i><img src="../assets/images/icon_tilte_all.png" alt=""></i>
					全部功能
				</h3>
			</div>
			<ul class="index-part-con flex flex-wrap" >
				<router-link tag="li" v-for="(item,index) in allFuncList" :key="index" :to="item.menuUrl">
					<div :class="item.menuExtendOne">
						<i class="icon-tips" v-if="item.menuImagePath=='icon-transportation'">购票</i>
                        <i class="icon-menu" :class="item.menuImagePath"></i>
                    </div>
                    <h4>{{item.menuName}}</h4>
				</router-link>
			</ul>
		</div>
		<div class="index-scenic index-part" v-if="scenicRecommandList&&scenicRecommandList.length">
			<div class="index-part-title">
				<p></p>
				<h3>
					<i><img src="../assets/images/icon_tilte_viewport.png" alt=""></i>
					景点推荐
				</h3>
			</div>
			<div class="index-part-con">
				<ul class="spot-swiper flex flex-nwrap">
	                <li v-for="(item,index) in scenicRecommandList" :key="index" :id="'spotItem'+index" @click.stop="toScenicInfo(item)">
				   		<img :src="item.scenic_logo" v-imgReactive :onerror="defaultImg">
	                    <div class="spot-title"> 
	                        <h4>{{item.scenic_name_ch}}</h4>
	                    </div>
	                </li>
	            </ul>
			</div>
		</div>
		<div class="index-trading index-part" v-if="businessRecommandList&&businessRecommandList.length">
			<div class="index-part-title">
				<p></p>
				<h3>
					<i><img src="../assets/images/icon_tilte_trade.png" alt=""></i>
					商圈推荐
				</h3>
			</div>
			<ul class="index-part-con">
				<li class="trading-cell flex flex-justify" v-for="(item,index) in businessRecommandList" :key="index" :id="'spotItem'+index" @click.stop="toBusinessInfo(item)">
					<div class="cell-icon">
						<img :src="item.business_logo" alt="" v-imgReactive>
					</div>
					<div class="cell-title">
						<div class="cell-title-top">
							<h3>{{item.business_name_ch}}</h3>
							<div class="cell-type">
								<i class="cell-type-icon" :class="'icon_trade'+item.business_type_num"></i>
								{{item.business_type}}
							</div>
						</div>
						<p class="cell-title-bottom">营业时间：{{item.business_open_time}} ~ {{item.business_close_time}}</p>
					</div>
					<div class="cell-arrow flex flex-right">
						{{item.business_area_id}}
						<i><img src="../assets/images/list_arrow_right.png" alt=""></i>
					</div>
				</li>
			</ul>
		</div>
	</div>
	
</template>

<script>
	import WeatherControl from '../components/common/weatherControl.vue';
	import { getMainmenu, getScenicRecommandList, getBusinessRecommandList} from '../service/api';
	import Swiper from '../../static/js/swiper.min.js';
	export default {
		components: {
			WeatherControl,
		},
		data() {
			return {
				allFuncList: [],
				scenicRecommandList: [],
				businessRecommandList: [],
				navHeight: null,
				defaultImg: 'this.src="' + require('../assets/images/default_img_hotel.png') + '"',

			}
		},
		methods: {
			//获取所有功能列表
			getAllFuncList(){
				getMainmenu().then(res=>{
					this.allFuncList = [];
					if(res && res.status==0 && res.data){
						
						let data = {};
						data = res.data.filter(item=>item.menuCategoryId==1);
						this.allFuncList = data[0].menus;
						this.allFuncList.push({
							createAccout: null,
							menuEnglishName: null,
							menuExtendFive: null,
							menuExtendFour: null,
							menuExtendOne: "bgc2",
							menuExtendThree: null,
							menuExtendTwo: null,
							menuImagePath: "icon-feedback",
							menuName: "意见反馈",
							menuSort: null,
							menuUrl: "/suggestions",
							updateAccount: null,
						})
						
					}
				})
			},
			// 获取景点列表
			getScenicList(){
				getScenicRecommandList().then(res=>{
					this.scenicRecommandList = [];
					if(res && res.status == 0 && res.data) {
						console.log('景点',res.data)
						this.scenicRecommandList = res.data;
					}
				})
			},
			// 获取商圈列表
			getBusinessList(){
				getBusinessRecommandList().then(res=>{
					this.businessRecommandList = [];
					if(res && res.status == 0 && res.data && res.data.businessRecommandGroup) {
						console.log('商圈',res)
						this.businessRecommandList = res.data.businessRecommandGroup;
					}
				})
			},
			// 点击景点列表item
			toScenicInfo(data){
				this.$router.push({name: 'spotqueryInfo', params: data});
			},
			// 点击商圈列表item
			toBusinessInfo(data){
				 this.$router.push({name: 'tradingShopInfo', params: data})
			},
		},
		created(){
			localStorage.removeItem('flightsData');
			this.getAllFuncList();
			this.getScenicList();
			this.getBusinessList();
		},
		mounted(){
			let mySwiper = new Swiper('.swiper-container', {
          		autoplay: {
					delay: 3000,
					stopOnLastSlide: false,
					disableOnInteraction: false,
				},
				loop:true,
				pagination: {
			    	el: '.swiper-pagination',
			    },
			})
		},


		
	}
</script>

<style lang='less'>
@import '../style/definition.less';
.index {
	width: 100%;
	// padding-bottom: 0.5rem;
	box-sizing: border-box;
	position: relative;
	.index-header {
		width: 100%;
		height: 1.12rem;
		padding: 0 0.32rem;
		box-sizing: border-box;
		.header-logo {
			width: 0.84rem;
			height: 0.44rem;
			margin-top: auto;
			margin-bottom: auto;
			margin-right: 0.14rem;
			border-radius: 0.08rem;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%; 
			}
		}
		.header-title {
			margin-top: auto;
			margin-bottom: auto;
			h1 {
				font-size: 0.36rem;
				letter-spacing: 0.01rem;
				color: @dark-color;
			}
			p {
				font-size: 0.18rem;
				color: @dark-color;
			}
		}
		.index-header-weather {
			flex: 0 0 2rem;
			margin-top: auto;
			margin-bottom: auto;
			text-align: right;
		}

	}
	.swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets {
		bottom: 0;
	}
	.index-nav {
		width: 100%;
		padding: 0 0.32rem;
		box-sizing: border-box;
		.index-nav-top {
			// height: 2.80rem;
			border-radius: @border-radius-primary;
			overflow: hidden;
		}
		.index-nav-bottom {
			height: 1.2rem;
			margin-top: 0.24rem;
			.index-nav-item {
				width: 50%;
				height: 1.2rem;
				border-radius: @border-radius-middle;
				background-color: #16ab8e;
				position: relative;
				&:last-child {
					background: #18af91 url(../assets/images/counter_block_bg.png) no-repeat top right;
					background-size: auto 100%;
				}
				&:first-child {
					background: #41a1f7 url(../assets/images/fight_block_bg.png) no-repeat top right;
                    background-size: auto 100%;
					margin-right: 0.24rem;
				}
				>img {
					position: absolute;
					width: 0.56rem;
					height: 0.56rem;
					top: 50%;
					left: 0.3rem;
					transform: translateY(-50%);
				}
				>div.index-nav-title {
					position: absolute;
					top: 0.2rem;
					left: 1.1rem;
					color: #fff;
					text-align: left;
					h3 {
						font-size: 0.32rem;
						font-weight: normal;
						letter-spacing: 0.02rem;
						line-height: 0.44rem;
					}
					p {
						font-size: 0.22rem;
						margin-top: 0.05rem;
					}
				}
			}
			
		}

	}
	.index-part {
		padding: 0 0.32rem;
		margin-top: 0.56rem;
		.index-part-title {
			height: 0.4rem;
			line-height: 0.4rem;
			text-align: center;
			color: @dark-color;
			margin-bottom: 0.36rem;
			position: relative;
			>p {
				position: absolute;
				width: 100%;
				height: 1px;
				background-color: #c9cdd6;
				top: 0.19rem;
				left: 0; 
				z-index: 0;
			}
			h3 {
				position: absolute;
				top: 0;
				left: 50%;
				width: 33%;
				transform: translateX(-50%);
				background-color: #f1f2f7;
				font-size: 0.32rem;
				color: @dark-color;
				z-index: 2;
				i {
					display: inline-block;
					width: 0.36rem;
					height: 0.36rem;
					vertical-align: top;
					margin-right: 0.1rem;
				}
			}	
		}
	}
	// 全部功能
	.index-all {
		.index-part-con {
			li {
				width: 25%;
				height: 1.96rem;
				text-align: center;
				 >div {
                    width: 1rem;
                    height: 1rem;
					border-radius: 50%;
					margin: 0 auto;
                    position: relative;
                    &.bgc1 {  //乘机须知
                        background: linear-gradient(to right,#398ff6, #4ab4f9);
                    } 
                    &.bgc2 {  //航班查询
                        background: linear-gradient(to right,#398ff6, #4ab4f9);
                    } 
                    &.bgc3 {  //手机值机
                        background: linear-gradient(to right,#14a88d, #34d4a8);
                    }
                    &.bgc4 {  //商圈查询
                        background: linear-gradient(to right,#4f54d4, #6f6dea);
                    }
                    &.bgc5 {  //交通方式查询
                        background: linear-gradient(to right,#47547a, #677aa4);
                    }
                    &.bgc6 {  //设施引导
                        background: linear-gradient(to right,#4f54d4, #6f6dea);
                    }
                    &.bgc7 {  //景点查询
                        background: linear-gradient(to right,#398ff6, #4ab4f9);
                    }
                    &.bgc8 { //停车收费
                        background: linear-gradient(to right,#4f54d4, #6f6dea);
                    }
                    &.bgc9 {  //商圈查询
                        background: linear-gradient(to right,#4f54d4, #6f6dea);      
                    }
                    &.bgc10 {  //酒店查询
                        background: linear-gradient(to right,#14a88d, #34d4a8);
					}
					i.icon-tips {
						width: 0.66rem;
						height: 0.32rem;
						text-align: center;
						line-height: 0.32rem;
						font-style: normal;
						font-size: 0.22rem;
						color: @dark-color;
						border-radius: 0.16rem;
						background-color: @orange-color;
						position: absolute;
						top: 0;
						right: -0.3rem;
					
					}
                    i.icon-menu {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 0.56rem;
                        height: 0.56rem;
                        background-color: #fff;
                    }
                    i.icon-notice {
                        // 乘机须知
                        background: url(../assets/images/icon_menu_notice.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-checkin {
                        // 手机值机
                        background: url(../assets/images/icon_menu_navigation.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-flights {
                        // 航班查询
                        background: url(../assets/images/icon_flight_white.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-tradingarea {
                        // 商圈查询
                        background: url(../assets/images/icon_menu_trade.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-facility {
                        // 设施引导
                        background: url(../assets/images/icon_menu_navigation.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-parking {
                        // 停车收费
                        background: url(../assets/images/icon_menu_taffic.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-transportation {
                        // 交通方式
                        background: url(../assets/images/icon_menu_taffic.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-spotquery {
                        // 景点查询
                        background: url(../assets/images/icon_menu_viewport.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-hotel {
                        // 酒店查询
                        background: url(../assets/images/icon_menu_hotel.png) no-repeat center;
                        background-size: 100%;
                    }
                    i.icon-airport {
                        // 机场信息查询
                        background: url(../assets/images/icon_menu_navigation.png) no-repeat center;
                        background-size: 100%;
					}
					i.icon-feedback {
						// 意见反馈
                        background: url(../assets/images/icon_menu_suggestion.png) no-repeat center;
                        background-size: 100%;
					}

                }
                h4 {
					height: 0.3rem;
					line-height: 0.3rem;
					font-size: 0.28rem;
                    font-weight: normal;
					margin-top: 0.24rem;
					color: @dark-color;
                }
			}
		}
	}
	// 景点推荐
	.index-scenic {
		margin-top: 0.08rem;
		.index-part-con {
			width: 100%;
			height: 2rem;
			overflow: hidden;
			>ul.spot-swiper {
				width: 100%;
				overflow-x: auto;
				overflow-y: hidden;
				height: 2.6rem;
				padding-bottom: 0.6rem;
				box-sizing: border-box;
	            li {
					position: relative;
					flex:0 0 2rem;
					height: 2rem;
					border-radius: @border-radius-primary;
					overflow: hidden;
					margin-right: 0.32rem;
					img {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
					}
					&:last-child {
						margin-right: 0;
					}
	                .spot-title {
	                    position: absolute;
	                    bottom: -1px;
						left: 0;
						width: 100%;
						height: 1rem;
						padding-top: 0.4rem;
						box-sizing: border-box;
						background: @linear-gradient-mask;
						text-align: center;
						border-radius: 0 0 @border-radius-primary @border-radius-primary;
						>h4 {
							font-size: 0.28rem;
							font-weight: normal;
							min-height: 0.3rem;
							color: #fff;
							overflow: hidden;
                			text-overflow: ellipsis;
                			white-space: nowrap;
						}
	                }
	            }
	        }
		}
		
	}
	// 商圈推荐
	.index-trading {
		.index-part-con {
			padding: 0.16rem 0.3rem;
			box-sizing: border-box;
			background-color: #fff;
			border-radius: @border-radius-primary;
			.trading-cell {
				height: 0.96rem;;
				padding: 0.14rem 0;
				border-bottom: @border-bottom;
				box-sizing: border-box;
		
				&:last-child {
					border-bottom: none;
				}
				.cell-icon {
					flex:0 0 0.64rem;
					height: 0.64rem;
					overflow: hidden;
					border-radius: 50%;
					vertical-align: middle;
					text-align: center;
					box-shadow: @box-shadow-icon;
					margin-right: 0.2rem;
					position: relative;
					img {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%,-50%);
					}
				}
				.cell-title {
					width: 52%;
					div.cell-title-top {
						height: 0.32rem;
						line-height: 0.32rem;
						h3 {
							float: left;
							max-width: 2rem;
							margin-right: 0.05rem;
							font-size: 0.28rem;
							height: 0.32rem;
							line-height: 0.32rem;
							font-weight: normal;
							color: @dark-color;
							overflow: hidden;
                			text-overflow: ellipsis;
							white-space: nowrap;
						}
						>div.cell-type {
							display: inline-block;
							height: 0.32rem;
							padding: 0 0.06rem;
							line-height: 0.32rem;
							font-size: 0.22rem;						
							background-color: @orange-color;
							border-radius: 0.08rem;
							vertical-align: top;
							>i.cell-type-icon {
								width: 0.28rem;
								height: 0.28rem;
								display: inline-block;
								vertical-align: middle;
								&.icon_trade43 {
									//休息
									background: url(../assets/images/icon_trade_rest_small.png) no-repeat center;
                        			background-size: 100%;
								}
								&.icon_trade41 {
									//购物
									background: url(../assets/images/icon_trade_shopping_small.png) no-repeat center;
                        			background-size: 100%;
								}
								&.icon_trade40 {
									//餐饮
									background: url(../assets/images/icon_trade_catering_small.png) no-repeat center;
                        			background-size: 100%;
								}
								&.icon_trade42 {
									//娱乐
									background: url(../assets/images/icon_trade_leisure_small.png) no-repeat center;
                        			background-size: 100%;
								}
								
							}
						}
					}
					p.cell-title-bottom {
						font-size: 0.22rem;
						height: 0.22rem;
						line-height: 0.22rem;
						color: @gray-color;
						margin-top: 0.1rem;
					}
				}
				.cell-arrow {
					width: 30%;
					font-size: 0.24rem;
					line-height: 0.66rem;
					color: @theme-color;
					text-align: left;
					i {
						width: 0.32rem;
						height: 0.32rem;
						margin-top: auto;
						margin-bottom: auto;
						margin-left: 0.4rem;
					}
				}

			}
			
		}
	}
}

</style>