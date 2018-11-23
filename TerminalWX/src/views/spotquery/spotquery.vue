<template>
	<div>
		<x-header class="x-header" title="景点查询" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback" >
		</x-header>
		<div class="index-main notice-main">
			<ul class="flex flex-wrap notice-box"> 
				<li v-for="(item, index) in dataList" :key="index" @click.stop="toHotelInfo(item)" :id="'noticesItem'+index" class="notice-box-item" :class="'bgImg'+index">
					<img :src="item.scenic_logo" alt="" v-imgReactive>
					<div class="down">
							<h4 class="div-h4">{{item.scenic_name_ch}}</h4>
							<div class="spot-sign">
								<i></i>
								{{item.scenic_position}}
						    </div>
					</div>
				</li>
			</ul>		
		</div>
	</div>
</template>

<script>
	import { getQueryScenicList } from '../../service/api';
	import { setTimeout } from 'timers';
	export default {
		components: {},
		data() {
			return {
				dataList: [],
				currentPage: 1,
			}
		},
		methods: {
			// 详情弹窗关闭
			detailClose(){
		
			},
            callback(){
                this.$router.back(-1);
			},
			toHotelInfo(data){
				this.$router.push({name: 'spotqueryInfo', params: data});
			},
			init(){
				this.dataList =[
					// {
					// 	"hotel_position":'盐池',
					// 	"hotel_name_ch":'明长城遗址',
					// 	"the_cheapest_price":'389',
					// 	"hotel_distant":'20',
					// 	"scenic_logo":'http://a1.att.hudong.com/51/15/16300000668094129041156890870.jpg',
					// 	"hotel_address":'金凤区亲水大街与长乐西路'
					// },
					// {
					// 	"hotel_position":'盐池',
					// 	"hotel_name_ch":'明长城遗址',
					// 	"the_cheapest_price":'389',
					// 	"hotel_distant":'20',
					// 	"scenic_logo":'http://a1.att.hudong.com/51/15/16300000668094129041156890870.jpg',
					// 	"hotel_address":'金凤区亲水大街与长乐西路'
					// },
				]
				getQueryScenicList().then(res=>{
					this.dataList = [];
					if(res && res.status == 0 && res.data) {
						this.dataList = res.data;
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
	padding: 1.52rem 0.32rem 0;
	box-sizing: border-box;
	>ul.notice-box {
		width: 100%;
		box-sizing: border-box;
		li.notice-box-item {
			width: 100%;
			height: 3.2rem;
			border-radius: 0.24rem;
			margin-bottom: 0.32rem;
			box-sizing: border-box;
			position: relative;
			overflow: hidden;
			.spot-sign {
				position: absolute;
				bottom: 0.24rem;
				right: 0.32rem;
				height: 0.3rem;
				line-height: 0.3rem;
				border-radius: 0.3rem;
				padding-left: 0.4rem;
				// padding: 0.1rem 0.6rem 0rem 0.7rem;
				font-size: 0.24rem;
				color: rgb(231, 228, 228);
				box-sizing: border-box;
				>i {
					position: absolute;
					top: 0;
					left: 0;
					width: 0.28rem;
					height: 0.28rem;
					background: url(../../assets/images/icon_location_28.png) no-repeat center center;
					background-size: 100%;
			     }
			}
			img{
				position: absolute;
				top: 50%;
				left: 50%;
				width: 100%;
				height: 100%;
				transform: translate(-50%,-50%);
			}
			.down{
				 width: 100%;
				 height: 1.2rem;
				 position: absolute;
				 bottom: 0;
				 border-radius: 0 0 0.24rem 0.24rem;
				 padding: 0 0.32rem 0.24rem;
				 box-sizing: border-box;
				 background: @linear-gradient-mask;
				.div-h4{
					position: absolute;
					font-size: 0.32rem;
					font-weight: normal;
					text-align: left;
					bottom: 0.24rem;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					color: #fff;
				}
			}

		}
	}



}


</style>