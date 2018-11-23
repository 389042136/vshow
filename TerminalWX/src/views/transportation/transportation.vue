<template>
	<div>
        <x-header class="x-header" title="交通方式查询" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main traffic-main">
            <router-link to="/transportationBus" tag="li" class="traffic-item bg-bus" :key="0">
                <i class="icon-traffic icon-bus"></i>
                <h4>机场大巴 <i class="icon-ticket">购 票</i></h4>

            </router-link>
            <router-link to="/transportationCoach" tag="li" class="traffic-item bg-coach" :key="1">
                <i class="icon-traffic icon-coach"></i>
                <h4>长途大巴</h4>
            </router-link>
            <router-link to="/transportationTaxi" tag="li" class="traffic-item bg-taxi" :key="2">
                <i class="icon-traffic icon-taxi"></i>
                <h4>出租车</h4>
            </router-link>
            <router-link to="/transportationParking" tag="li" class="traffic-item bg-parking" :key="3">
                <i class="icon-traffic icon-parking"></i>
                <h4>停车场</h4>
            </router-link>
            <router-link to="/transportationRail" tag="li" class="traffic-item bg-rail" :key="4">
                <i class="icon-traffic icon-rail"></i>
                <h4>高铁</h4>
            </router-link>
				
		</div>
	</div>
	
</template>

<script>

	export default {
		components: {

		},
		data() {
			return {
                timeShow: true,
				feedshow: false,
				params: {},
				dataList: [],
				currentPage: 1,

			}
		},
		methods: {
            callback(){
                this.$router.back(-1);
			},
			init(){
				
			},


		},
		created(){
		},
		mounted(){
			
		},


		
	}
</script>

<style lang='less' scoped>
@import '../../style/definition.less';
.traffic-main {
    padding: 1.52rem 0.32rem 0;
    box-sizing: border-box;
    .traffic-item {
        height: 1.36rem;
        margin-bottom: 0.08rem;
        padding-left: 1.3rem;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        &:first-child {
            border-radius: @border-radius-primary @border-radius-primary 0 0;
        }
        &:last-child {
            border-radius:  0 0 @border-radius-primary @border-radius-primary;
        }
        &.bg-bus {
            background: #11b0f4 url(../../assets/images/traffic_airport_bus_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        &.bg-coach {
            background: #5c5edd url(../../assets/images/traffic_bus_bg.png) no-repeat top right;
            background-size: auto 100%;
        }
        &.bg-taxi {
            background: #5973b3 url(../../assets/images/traffic_taxi_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        &.bg-parking {
            background: #11b0f4 url(../../assets/images/traffic_parking_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        &.bg-rail {
            background: #18ae91 url(../../assets/images/traffic_highspeed_rail_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        i.icon-traffic {
            position: absolute;
            top: 50%;
            left: 0.56rem;
            width: 0.56rem;
            height: 0.56rem;
            transform: translateY(-50%);
            &.icon-bus {
                background:url(../../assets/images/icon_airport_bus.png) no-repeat center center;
                background-size: 100% 100%;
            } 
            &.icon-coach {
                background:url(../../assets/images/icon_airport_bus.png) no-repeat center center;
                background-size: 100% 100%;
            }
            &.icon-parking {
                background: url(../../assets/images/icon_parking.png) no-repeat center center;
                background-size: 100% 100%;
            } 
            &.icon-taxi {
                background:url(../../assets/images/icon_taxi.png) no-repeat center center;
                background-size: 100% 100%;
            }
            &.icon-rail {
                background:url(../../assets/images/icon_high_speed_rail.png) no-repeat center center;
                background-size: 100% 100%;
            }       
        }
        h4 {
            font-size: 0.36rem;
            line-height: 1.36rem;
            font-weight: 400;
            color: #fff;
            .icon-ticket {
                height: 0.4rem;
                line-height: 0.4rem;
                padding: 0.06rem 0.1rem;
                font-size: 0.28rem;
                font-style: normal;
                color: @dark-color;
                background-color: @orange-color;
                border-radius: @border-radius-little;
            }
        }
        
    }
}


</style>
