<template>
	<div class="index" style="background: #e6ecfa;">
		<x-header class="x-header" title="值机柜台" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main airport-main">
			<!-- 缩放功能目前不支持 -->
			<!-- <div class="btn-scale flex flex-column">
				<div><img src="../../assets/images/icon_map_zoom_in.png" alt=""></div>
				<div><img src="../../assets/images/icon_map_zoom_out.png" alt=""></div>
			</div> -->
			<div class="airpor-btn airport-south">
				<h4>南值机柜台</h4>
			</div>
			<div class="airpor-btn airport-north">
				<h4>北值机柜台</h4>
			</div>
			<div class="airpor-list">
				<div>
					<mt-cell 
						class="trading-cell"
						to="/airportInfo/south"
	  					is-link
	  					value="点击查看详情">
						<div slot="title">南值机柜台</div>
					</mt-cell>
					<mt-cell 
						class="trading-cell"
						to="/airportInfo/north"
	  					is-link
	  					value="点击查看详情">
						<div slot="title">北值机柜台</div>
					</mt-cell>
				</div>
				
			</div>
		</div>
	</div>
	
</template>

<script>
	export default {

		data() {
			return {
				scaleStatus: [
					{type: 'ios-plus-empty'},
					{type: 'ios-minus-empty'}
				],
			}
		},
		methods: {
            callback(){
                this.$router.back(-1);
			},

		},
		created(){

		},
		mounted(){
			
		},


		
	}
</script>

<style lang='less'>
@import '../../style/definition.less';
.index {
	width: 100%;
	height: 100%;
	position: relative;
	.airport-main {
		position: absolute;
		height: 100%;
		width: 100%;
		padding: 1rem 0.32rem 0.32rem;
		box-sizing: border-box;
		position: relative;
		background: url(../../assets/images/counters_map.jpg) no-repeat center;
		background-size: 100% ;
		.btn-scale {
			position: absolute;
			top: 1.32rem;
			right: 0.32rem;
			width: 0.8rem;
			height: 1.6rem;
			border-radius: 0.12rem;
			background-color: #fff;
			div {
				width: 100%;
				height: 50%;
			}
		}
		.airpor-btn {
			position: absolute;
			color: #fff;
			width: 2.24rem;
			height: 0.8rem;
			border-radius: 0.1rem;
			&.airport-south {
				background: url(../../assets/images/airport_info_pop_bg.png) no-repeat top left;
                background-size: 100% auto;
				top: 4rem;
				left: 2rem;
			}
			&.airport-north {
				background: url(../../assets/images/airport_info_pop_bg_reverse.png) no-repeat top left;
                background-size: 100% auto;
				top: 5rem;
				left: 5rem;
			}
			h4 {
				font-size: 0.28rem;
				font-weight: normal;
				line-height: 0.56rem;
				text-align: center;
			}
		}
		.airpor-list {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 0.32rem;
			box-sizing: border-box;
			>div {
				background-color: #fff;
				border-radius: @border-radius-primary;
				padding: 0.16rem 0.32rem;
				>a {
					height: 0.8rem;
					border-bottom: @border-bottom;
					&:last-child {
						border-bottom: none;
					}
					.mint-cell-wrapper {
						.mint-cell-title {
							font-size: 0.32rem;
							color: @dark-color;
						}
						.mint-cell-value {
							font-size: 0.24rem;
							color: @theme-color;
						}
					}
				}
			}
		}
	}
}

</style>