<template>
	<div style="height: 100%">
		<x-header class="x-header" title="商圈查询" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		
		</x-header>
		<div class=" notice-main flex flex-column">
			<div class="div-title">
				<ul class="title-ul flex flex-justify"> 
				    <li class="title-li" 
						v-for="(item, index) in tradDate" 
						:key="index" 
						:id="'li'+index"
						:style="{'background' : areaId == item.map_id ? 'linear-gradient(to right,#388ff6, #4cb3f5)' : '#fff'}"
					 	@click="choiceType(index,item)">
						<p :style="{'color' : areaId == item.map_id ? '#fff' : 'rgb(27, 29, 29)'}">
							{{item.map_name}}
						</p>
					</li>
			    </ul>	
			</div>
			<div class="div-types flex flex-justify" >
				<button class="but" 
					v-for="(item, index) in queryBusinessType" 
					:key="index" 
					:id="'btn'+index" 
					@click="selectInfo(index,item)">
					<div class="btn-down flex flex-column">
						<img 
						   v-show="businessType == item.enum_id" 
						   :src="require('../../assets/images/icon_trade_'+allTrim(item.enum_english_name)+'_blue.png')">
						<img 
						   v-show="businessType != item.enum_id" 
						   :src="require('../../assets/images/icon_trade_'+allTrim(item.enum_english_name)+'_dark.png')">
						<h4 :style="{'color' : businessType == item.enum_id ? 'rgb(111, 183, 250)' : 'rgb(27, 29, 29)'}">
							{{item.enum_name}}
						</h4>
					</div>
				</button>
			</div>
			<div class="down flex flex-justify" >
				<table class="tb"  >
					<tbody class="tb-tbody flex flex-column">                              
						<tr v-for="(item, index) in tradingDataList" :key="index">
							<td class="flex flex-row" @click="choice(item)">
								<div class="tb-div-img ">
									<img class="tb-img" :src="item.business_logo"  v-imgReactive>
								</div>
								<div class="div-time flex flex-column">
									<div class="div-time-h4 flex flex-left">
                                    <p class="tb-h4">{{item.business_name_ch}} </p>
										<p class="tb-span-img ">
											<span class="tb-span-img-div flex flex-left">
												<i class="tb-i" :class="'icon_trade'+item.business_type_id"></i>
												<span class="tb-span-p">{{item.business_type}}</span>
											</span>
										</p>
									</div>
									<div class="time-div">
									<span class="tb-time"> 营业时间：{{item.business_open_time}} ~ {{item.business_close_time}}</span>
									</div>
								</div>
								<div class="tb-td-div-btn flex flex-right">
									<button class="butn-map" @click.stop="toMap(item)">
										<h5 class="h5-map">地图</h5>
									</button>
									<button class="tb-btn">
										<h5 class="tb-h5">详情</h5>
									</button>
								</div>
							</td>
						</tr>
					</tbody>
              </table>
			</div>
		</div>
	</div>
</template>

<script>
	import { Tab, TabItem } from '../../components/vux/tab/index';
	import { getQueryBusinessArea ,getQueryBusinessGroup} from '../../service/api';
	import { setTimeout } from 'timers';
	export default {
		components: { Tab,TabItem },
		data() {
			return {
				params: {},
				tradingDataList: [],
				tradDate:[],
				queryBusinessType:[],
				areaId:'0',
				businessType:'0',
				flage:false
			}
		},
		methods: {
            callback(){
                this.$router.back(-1);
			},

			// 跳转详情页面
			choice(data){
				this.$router.push({name: 'tradingShopInfo', params: data})
			},

			toMap(data) {
				data.businessMap = this.businessMap;
				this.$router.push({name: 'tradingareaMap', params: data})
			},

			// 选择查询区域
			choiceType(index,data){
				this.areaId=data.map_id
				this.getQueryBusinessGroup(this.areaId,this.businessType);
			},

			// 选择查询类型 
			selectInfo(index,data){
				this.businessType=data.enum_id;
				this.getQueryBusinessGroup(this.areaId,data.enum_id);
			},
			/**
			 * 去空格，转小写
			 */
			allTrim(str) {
					return str.replace(/\s*/g, "").toLowerCase();
			},
			// 查询区域
			async getQueryBusinessArea (){
         		await  getQueryBusinessArea().then(res=>{
					if( res && res.status == 0 && res.data){
						this.tradDate = res.data;
					}
				});
				this.choiceType(0,this.tradDate[0]);
			},
			// 查询列表及其type类型
			async getQueryBusinessGroup(areaId,businessType){
				await getQueryBusinessGroup(
					{
						"areaId" :areaId,
						"businessType" : businessType
					}
				).then(res=>{
					if( res && res.status == 0 && res.data){
						this.queryBusinessType=[];
						let all={'enum_english_name':"All",'enum_id':'0','enum_name':'全部'};
				        this.queryBusinessType.push(all);
						res.data.queryBusinessType.forEach(element => {
							this.queryBusinessType.push(element);
						});
						this.tradingDataList=res.data.businessGroup;
						this.businessMap = res.data.businessMap.map_url;
					}
				});
			},
		  // 初始化方法
			init(){
				this.getQueryBusinessArea();
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
	padding: 1.48rem 0.32rem 0;
	box-sizing: border-box;
	.div-title{
		flex: 0 0 0.64rem;
		width: 100%;
		box-sizing: border-box;
		.title-ul{
			width: 100%;
			box-sizing: border-box;
			.title-li{
				height: 0.64rem;
				box-sizing: border-box;
				font-size: 0.28rem;
				font-weight: normal;
				border-radius: 0.12rem;
				background-color: #fff;
				text-align: justify;
				padding: 0 0.1rem 0;
				margin-right: 0.24rem;
				&:last-child {
					margin-right: 0;
				}
				p{
					margin-top: 0.15rem;
				}

			}
		}
	}
	.div-types{
		width: 100%;
		flex: 0 0 1.2rem;
		box-sizing: border-box;
		border-radius: 0.24rem;
		background-color: #fff;
		overflow: hidden;
		padding:0 0.4rem 0;
		margin-top: 0.24rem;
	}
	.but {
		text-align: center;
		>div {
			text-align: center;
			h4 {
				font-size: 0.24rem;
				font-weight: normal;
				color: rgb(27, 29, 29);
			}
			img {
				width: 0.48rem;
				height: 0.48rem;
			}
		}
		
	}
	.down{
		width: 100%;
		flex: .95;
		margin-top: 0.24rem;
		text-align: center;
		border-radius: 0.2rem;
		overflow-y: auto;
		box-sizing: border-box;
		background-color: #fff;
		padding: 0.24rem 0.32rem 0.2rem;
		.tb {
			width: 100%;
			font-size: 0.24rem;
			border: none;
			border-collapse: collapse;
			box-sizing: border-box;
			overflow: hidden;
			tr{
				margin-top: 0.1rem;
				height: 0.93rem;
			}
			td{
				padding-bottom: 0.1rem;
				border-bottom: 1px solid rgb(245, 242, 242);
			}
			.tb-div-img{
				height: 0.64rem;
				flex:0 0 0.64rem;
				position: relative;
				overflow: hidden;
				border-radius: 50%;
		     	vertical-align: middle;
					text-align: center;
				box-shadow: @box-shadow-icon;
				.tb-img{
					position: absolute;
					top:50%; 
					left:50%;
					transform: translate(-50%,-50%);
				}
			}
			.div-time{
				flex:1;
				padding: 0 0.24rem 0;
				.div-time-h4{
                   .tb-h4{
						font-size: 0.28rem;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						margin-right: 0.12rem;
					}
					.tb-span-img{
						height: 0.32rem;
						text-align: right;
						position:relative;
						border-radius: 0.08rem;
						background-color: @orange-color;
						padding: 0 0.06rem;
						.tb-span-img-div{
							.tb-i{
								width: 0.32rem;
								height: 0.32rem;
								&.icon_trade43 {
									//休息
									background: url(../../assets/images/icon_trade_rest_small.png) no-repeat center;
									background-size: 100%;
								}
								&.icon_trade41 {
									//购物
									background: url(../../assets/images/icon_trade_shopping_small.png) no-repeat center;
									background-size: 100%;
								}
								&.icon_trade40 {
									//餐饮
									background: url(../../assets/images/icon_trade_catering_small.png) no-repeat center;
									background-size: 100%;
								}
								&.icon_trade42 {
									//娱乐
									background: url(../../assets/images/icon_trade_leisure_small.png) no-repeat center;
									background-size: 100%;
								}
							}
							.tb-span-p{
								margin-left: 0.05rem;
								font-size: 0.22rem;
								line-height: 0.32rem;
							}
						}
					}
				}
				.time-div{
					margin-top: 0.08rem;
					text-align: left;
					.tb-time{
						font-size: 0.22rem;
						color: @gray-color;
					}
				}
			}
			.tb-td-div-btn{
				height: 0.48rem;
				position: relative;
				margin-top: 0.15rem;
				.butn-map{
					height: 0.48rem;
					border-radius: 0.08rem;
					color: #41a1f7;
					padding:  0 0.16rem;
					background-color: #fff;
					margin-right: 0.16rem;
					border: 0.01rem solid #41a1f7;
					.h5-map{
						font-size: 0.24rem;
						line-height: 0.48rem;
						font-weight: normal;
						text-align: justify;
					}
				}
				.tb-btn{
					padding:  0 0.16rem;
					height: 0.48rem;
					border-radius: 0.08rem;
					background: @linear-gradient-primary;
					.tb-h5{
						font-size: 0.24rem;
						line-height: 0.48rem;
						font-weight: normal;
					}
				}
			}
        }
	}
}
</style>