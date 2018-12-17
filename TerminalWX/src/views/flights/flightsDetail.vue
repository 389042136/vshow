<template>
	<popup v-model="show" @on-hide="menuClose"> 
        <!-- 进港 a -->
        <div class="flightinfo-main flex flex-column" v-if="type==0">
            <div class="flightinfo-top flex flex-justify">
                <div class="flightinfo-title">
                    <i>
                        <img :src="data.a_al_logo" alt="">
                    </i>
                    <div>
                        <h3>{{data.a_al_name}}</h3>
                        <p>{{data.a_flightno}}</p>
                    </div>
                </div>
                <div class="flightinfo-icon" :class="'status_' + data.a_flight_status_en">
                    {{data.a_flight_status_en | colTemplateFunction($store.state.flightStatus)}}
                </div>
            </div>
            <div class="flightinfo-city flex flex-center">
                <div class="info-start">
                    <h4>{{data.a_origin}} {{data.a_terminal_origin}}</h4>
                </div>
                <div class="info-over">
                    <p v-if="data.a_via_ch">经停</p>
                    <div class="info-over-line"></div>
                    <p v-if="data.a_via_ch">{{data.a_via_ch}}</p>
                </div>
                <div class="info-end">
                    <h4>{{data.a_destination}} {{data.a_terminal}}</h4>
                </div>
            </div>
            <div class="flightinfo-detail flex flex-around">
                <div class="detail-plane">
                    <h4>计划到达</h4>
                    <p>{{data.a_plan_time}}</p>
                </div>
                <div class="detail-count">
                    <h4>行李转盘</h4>
                    <p>{{data.a_luggage}}</p>
                </div>
                <div class="detail-gate">
                    <h4>出口</h4>
                    <p>{{data.a_exit_gate}}</p>
                </div>
            </div>
        </div>
        <!-- 出港 d -->
        <div class="flightinfo-main flex flex-column" v-if="type==1">
            <div class="flightinfo-top flex flex-justify">
                <div class="flightinfo-title">
                    <i>
                        <img :src="data.d_al_logo" alt="">
                    </i>
                    <div>
                        <h3>{{data.d_al_name}}</h3>
                        <p>{{data.d_flightno}}</p>
                    </div>
                </div>
                <div class="flightinfo-icon" :class="'status_' + data.d_flight_status_en">
                    {{data.d_flight_status_en | colTemplateFunction($store.state.flightStatus)}}
                </div>
            </div>
            <div class="flightinfo-city flex flex-center">
                <div class="info-start">
                    <h4>{{data.d_origin}} {{data.d_terminal}}</h4>
                </div>
                <div class="info-over">
                    <p v-if="data.d_via_ch">经停</p>
                    <div class="info-over-line"></div>
                    <p v-if="data.d_via_ch" style="margin-top: 0.2rem;">{{data.d_via_ch}}</p>
                </div>
                <div class="info-end">
                    <h4>{{data.d_destination}} {{data.d_terminal_destination}}</h4>
                </div>
            </div>
            <div class="flightinfo-detail flex flex-around">
                <div class="detail-plane">
                    <h4>计划起飞</h4>
                    <p>{{data.d_plan_time}}</p>
                </div>
                <div class="detail-expect">
                    <h4>截止时间</h4>
                    <p>{{data.d_close_time}}</p>
                </div>
                <div class="detail-count">
                    <h4>值机柜台</h4>
                    <p>{{data.d_checkin_counter}}</p>
                </div>
                <div class="detail-gate">
                    <h4>登机口</h4>
                    <p>{{data.d_gate}}</p>
                </div>
            </div>
        </div>
    </popup>
	
</template>

<script>
    import { flights } from '../../service/api';
	export default {
        props: {
            detailShow: Boolean,
            detailId: Number,
            detailType: Number, 
            detailData: Object,      
        },
		data() {
			return {
                show: false,
                data: {},
                type: null,
                params: {},
			}
        },
        methods: {
            init(){
                this.show = this.detailShow;
            },
            menuClose(){
                this.$emit('detailClose');
            },
            // 根据航班id获取航班详情
            async getFlightInfo(params){
                let res = await flights.getFlightInfo(params);
                if(!res) return; 
                this.data  = res.data;
            },
		},
		created(){
			
        },
        mounted(){
            this.init();

        },
        watch:{
            detailShow(val){
                this.show = val; 
            },
            detailData(val){
                this.type = val.type;
                this.getFlightInfo(val);
            },
        },
        filters:{
	        colTemplateFunction(val,format){
				let result = "";
	            format.forEach(value => {
	                if (value.fsCode == val) {
	                    result = value.fsDescC;
	                }
	            })
	            return result;
	        },
	    },
		

		
	}
</script>

<style lang='less' scoped>
@import '../../style/definition.less';
.flightinfo-main {
    height: 4rem;
    border-radius: @border-radius-middle;
    background: #fff url(../../assets/images/fight_card_bg.png) no-repeat top left;
    background-size: 100%;
    overflow: hidden;
    .flightinfo-top {
        flex: 0 0 1.2rem;
        padding: 0.2rem 0.32rem;
        box-sizing: border-box;
        .flightinfo-title {
            i {
                float: left;
                width: 0.64rem;
                height: 0.64rem;
                // background-color: #fff;
                margin-right: 0.2rem;
                border-radius: 50%;
            }
            >div {
                float: left;
                color: #fff;
                h3 {
                    height: 0.24rem;
                    line-height: 0.24rem;
                    font-size: 0.22rem;
                    font-weight: normal;
                    color: rgba(255,255,255,0.6)
                }
                p {
                    height: 0.4rem;
                    line-height: 0.4rem;
                    font-family: 'squre';
                    font-size: 0.36rem;
                    color: #fff;
                    margin-top: 0.05rem;
                }
            }
        }
        .flightinfo-icon {
            width: 1.4rem;
            height: 0.48rem;
            line-height: 0.48rem;
            font-size: 0.28rem;
            text-align: center;
            color: #fff;
            margin-top: 0.1rem;
            border-radius: 0.1rem;
            &.status_DEP {
				background: #1cb393;
			}
			&.status_LBD {
				background: #f65d64;
			}
			&.status_NST {
				background: #1cb393;
			}
			&.status_CKO {
				background: #f65d64;
			}
			&.status_CKI {
				background: #f65d64;
			}
			&.status_BOR {
				background: #1cb393;
			}
			&.status_POK {
				background: #f65d64;
			}
			&.status_TBR {
				background: #1cb393;
			}
			&.status_ARR {
				background: #1cb393;
			}
			&.status_ONR {
				background: #1cb393;
			}
			&.status_ALT {
				background: #ff854f;
			}
			&.status_DLY {
				background: #ff854f;
			}
			&.status_CAN {
				background: #ff854f;
			}
			&.status_RTN {
				background: #ff854f;
			}
			&.status_BAK {
				background: #ff854f;
			}	
        }
        
    }
    .flightinfo-city {
        flex: 0 0 1.5rem;
        color: #fff;
        background-color: rgba(255,255,255,0.2);
        >div {
            text-align: center;
            flex: 1;
            position: relative;
            h4 {
                width: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                font-size: 0.4rem;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            p {
                font-size: 0.24rem;
            }
        }
        
        .info-over {
            flex: 0 0 1.6rem;
            height: 0.8rem;
            margin-top: auto;
            margin-bottom: auto;
            position: relative;
            >.info-over-line {
                position: absolute;
                top: 0.3rem;
                left: 50%;
                transform: translateX(-50%);
                height: 0.16rem;
                width: 1rem;
                background: url(../../assets/images/line_arrow_big.png) no-repeat center;
			    background-size: 100% 100%;
                margin: 0 auto;
            }
        }

    }
    .flightinfo-detail {
        flex: 1;
        padding: 0 0.2rem;
        text-align: center;
        background-color: #fff;
        >div {
            margin-top: 0.24rem;
        }
        h4 {
            font-size: 0.22rem;
            font-weight: normal;
            color: @gray-color;
        }
        p {
            font-size: 0.32rem;
            margin-top: 0.1rem;
            color: @dark-color;
        }
    }
}
</style>