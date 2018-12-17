<template>
	<div>
        <x-header class="x-header" title="停车缴费" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main traffic-main">
            <li class="traffic-item bg-pay" id="5" @click="toTrafficList(5)">
                <i class="icon-traffic icon-pay"></i>
                <h4>停车缴费</h4>
            </li>
            <li class="traffic-item bg-invoice" id="6" @click="toTrafficList(6)">
                <i class="icon-traffic icon-invoice"></i>
                <h4>电子发票</h4>
            </li>
            <li class="traffic-item bg-car" id="7" @click="toTrafficList(7)">
                <i class="icon-traffic icon-car"></i>
                <h4>寻找爱车</h4>
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
    			switch(index){
    				case 5:
                        window.location.href = "http://wx.parkingwang.com/fee_charge/charge_fee?source=ycairport";
                        break;
                    case 6:
                        Toast({
                            message: '该功能尚在开发中，敬请期待...',
                            position: 'middle',
                            duration: 3000
                        });
                        break;
                    case 7:
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
