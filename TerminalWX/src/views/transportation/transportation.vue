<template>
	<div>
        <x-header class="x-header" title="交通方式查询" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main traffic-main">
            <li class="traffic-item bg-bus" :key="0" @click="toTrafficList(0)">
                <i class="icon-traffic icon-bus"></i>
                <h4>机场大巴 <i class="icon-ticket">购 票</i></h4>

            </li>
            <li class="traffic-item bg-coach" :key="1" @click="toTrafficList(1)">
                <i class="icon-traffic icon-coach"></i>
                <h4>长途大巴</h4>
            </li>
            <li class="traffic-item bg-taxi" :key="2" @click="toTrafficList(2)">
                <i class="icon-traffic icon-taxi"></i>
                <h4>出租车</h4>
            </li>
            <li class="traffic-item bg-parking" :key="3" @click="toTrafficList(3)">
                <i class="icon-traffic icon-parking"></i>
                <h4>停车场</h4>
            </li>
            <li class="traffic-item bg-rail" :key="4" @click="toTrafficList(4)">
                <i class="icon-traffic icon-rail"></i>
                <h4>高铁</h4>
            </li>	
		</div>
	</div>
	
</template>

<script>
    import { Toast } from 'mint-ui';
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
            toTrafficList(index){
                // 弹窗打开
    			switch(index){
    				case 0:
    					this.$router.push({name: 'transportationBus'});
    					break;
    				case 1:
    					this.$router.push({name: 'transportationCoach'});
    					break;
                    case 2:
                        Toast({
                            message: '该功能尚在开发中，敬请期待...',
                            position: 'middle',
                            duration: 3000
                        });
    					break;
                    case 3:
                        Toast({
                            message: '该功能尚在开发中，敬请期待...',
                            position: 'middle',
                            duration: 3000
                        });
    					break;
                    case 4:
                        Toast({
                            message: '该功能尚在开发中，敬请期待...',
                            position: 'middle',
                            duration: 3000
                        });
                        break;
    			}
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
            background: #18ae91 url(../../assets/images/traffic_parking_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        &.bg-rail {
            background: #64b770 url(../../assets/images/traffic_highspeed_rail_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        &.bg-pay {
            background: #11b0f4 url(../../assets/images/traffic_parking_pay_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        &.bg-invoice {
            background: #5c5edd url(../../assets/images/traffic_tickets_bg.png) no-repeat top right;
            background-size: auto 100%;;
        }
        &.bg-car {
            background: #5973b3 url(../../assets/images/traffic_find_car_bg.png) no-repeat top right;
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
                background:url(../../assets/images/icon_traffic_airport_bus.png) no-repeat center center;
                background-size: 100% 100%;
            } 
            &.icon-coach {
                background:url(../../assets/images/icon_traffic_airport_bus.png) no-repeat center center;
                background-size: 100% 100%;
            }
            &.icon-parking {
                background: url(../../assets/images/icon_traffic_parking.png) no-repeat center center;
                background-size: 100% 100%;
            } 
            &.icon-taxi {
                background:url(../../assets/images/icon_traffic_taxi.png) no-repeat center center;
                background-size: 100% 100%;
            }
            &.icon-rail {
                background:url(../../assets/images/icon_traffic_highspeed_rail.png) no-repeat center center;
                background-size: 100% 100%;
            }
            &.icon-pay {
                background:url(../../assets/images/icon_traffic_parking_pay.png) no-repeat center center;
                background-size: 100% 100%;
            }
            &.icon-invoice {
                background:url(../../assets/images/icon_traffic_tickets.png) no-repeat center center;
                background-size: 100% 100%;
            }
            &.icon-car {
                background:url(../../assets/images/icon_traffic_find_car.png) no-repeat center center;
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
