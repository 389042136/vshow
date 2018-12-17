<template>
	<div class="flights-index flex flex-column">
        <flights-detail :detailShow="detailShow" @detailClose="detailClose" :detailData="detailData"></flights-detail>
        <div class="flights-top">   
            <x-header :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback" class="x-header flights-top-header" style="position: static; background: transparent">
                <div slot="overwrite-title">
                    <tab
                        :line-width= 0.04
                        active-color="#fff"
                        default-color="rgba(255, 255, 255, 0.6)"
                        custom-bar-width="0.5rem"
                        bar-active-color="linear-gradient(to right,#3990f6, #4ab5f9)"
                        v-model="tabIndex">
                        <tab-item @on-item-click="tabHandler" v-for="(item,index) in tabDatas" :key="index">
                            {{item.name}}
                        </tab-item>
                    </tab>
                </div>
    		</x-header>
            <div class="flights-top-switch flex">
                <div class="switch">
                    <tab
                    :line-width= 0.64
                    active-color="#fff"
                    default-color="#828999"
                    custom-bar-width="1.02rem"
                    bar-active-color="linear-gradient(to right,#3990f6, #4ab5f9)"
                    v-model="switchValue">
                        <tab-item @on-item-click="switchHandler" v-for="(item,index) in switchDatas" :key="index">
                            {{item.name}}
                        </tab-item>
                    </tab>
                </div>

                <!-- 不带查询按钮
                <input v-if="!switchValue" type="search" placeholder="输入航班号" v-model.trim="formFlight.flightno" @keyup.enter="queryByFlight">
                <input v-else type="text" placeholder="选择地点" v-model.trim="formPlace.city" @click.stop="toListPage"> -->

                <!-- 带查询按钮 -->
                <div class="switch-input flex" v-if="!switchValue">
                    <input type="text" placeholder="输入航班号" v-model.trim="formFlight.flightno" @keyup.enter="queryByFlight" @keyup="formFlight.flightno=$event.target.value.toString().toUpperCase()">
                    <button class="switch-btn" @click="queryByFlight">查询</button>
                </div>
                <div class="switch-input flex" v-else>
                    <input type="text" placeholder="点击选择地点" v-model.trim="formPlace.flightPlace" @focus="toListPage">
                    <button class="switch-btn" @click="queryByPlace">查询</button>
                </div>  
                
            </div>
        </div>
        <!-- 进港航班 -->
        <div class="flights-main" v-if="tabIndex==0">
            <ul v-if="dataListA&&dataListA.length">
                <li class="flights-main-item flex flex-justify" v-for="(item,index) in dataListA" :key="index" @click="toShowInfo(item.a_id,tabIndex)">
                    <div class="item-icon">
                        <img :src="item.a_al_logo" alt="" v-imgReactive>
                    </div>
                    <div class="item-flight">
                        <h3>{{item.a_flightno}}</h3>
                        <p>{{item.a_terminal}} <span style="margin-left: 0.1rem;">时间:{{item.a_plan_time}}</span></p>
                    </div>
                    <div class="item-place">
                        <h3>{{item.a_origin}}</h3>
                        <p>行李转盘:{{item.a_luggage}}</p>
                    </div>
                    <div class="item-status">
                        <h3 :class="'status_' + item.a_flight_status_en">{{item.a_flight_status_en | colTemplateFunction($store.state.flightStatus)}}</h3>
                        <p>出口:{{item.a_exit_gate}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 出港航班 -->
        <div class="flights-main" v-if="tabIndex==1">
            <ul v-if="dataListD&&dataListD.length">
                <li class="flights-main-item flex flex-justify" v-for="(item,index) in dataListD" :key="index" @click="toShowInfo(item.d_id,tabIndex)">
                    <div class="item-icon">
                        <img :src="item.d_al_logo" alt="" v-imgReactive>
                    </div>
                    <div class="item-flight">
                        <h3>{{item.d_flightno}}</h3>
                        <p>{{item.d_terminal}}<span style="margin-left: 0.1rem;">时间:{{item.d_plan_time}}</span></p>
                    </div>
                    <div class="item-place">
                        <h3>{{item.d_destination}}</h3>
                        <p>值机柜台:{{item.d_checkin_counter}}</p>
                    </div>
                    <div class="item-status">
                        <h3 :class="'status_' + item.d_flight_status_en">{{item.d_flight_status_en | colTemplateFunction($store.state.flightStatus)}}</h3>
                        <p>登机口:{{item.d_gate}}</p>
                    </div>
                </li>
            </ul>
        </div>

	</div>
	
</template>

<script>
    import { flights } from '../../service/api';
    import { Tab, TabItem } from '../../components/vux/tab/index';
    import FlightsDetail from './flightsDetail.vue';
	export default {
		components: {
            Tab,
            TabItem,
            FlightsDetail,
		},
		data() {
			return {
                tabIndex: 0,
                tabDatas: [
                    {name: '进港航班', label: 0, direction: 'a'},
                    {name: '出港航班', label: 1, direction: 'd'},
                ],
                switchValue: 0,
                switchDatas: [
                    {name: '航班',label: 0},
                    {name: '地点', label: 1},
                ],
                // 查询参数
                formFlight: {
                    direction: 'a',
                    flightno: '',
                },
                formPlace: {
                    direction: 'a',
                    city: '',
                    flightPlace:''
                },
                dataListA: [],  //进港航班数据
                dataListD: [],   //出港航班数据
                detailData: {},
                detailShow: false,
                indexActive: null,   
                type: null,   
			}
		},
		methods: {
            callback(){
                this.$router.push({name: 'index'})
			},
			// 点击标题tab切换
            tabHandler(val){
                this.tabIndex = val; 
            },
            //点击switch按钮
            switchHandler(val){
                this.switchValue = val;  
            },
            toShowInfo(id,tabType){
                switch(tabType) {
                    case 0:
                        this.type = 'a';
                        break;
                    case 1:
                        this.type = 'd';
                        break;
                }
                this.detailData = {
                    type: tabType,
                    direction: this.type,
                    id: id,
                }
                this.detailShow = true;
            },
            detailClose(){
                this.detailShow = false;
            },
            // 展开机场列表
            toListPage(value,$event){
                document.activeElement.blur();
                // 记录当前页的所有状态数据
                let statusActive = null;
                statusActive = {
                    tabIndex: this.tabIndex,
                    switchValue: this.switchValue,
                    flightno: this.formFlight.flightno,
                    city: this.formPlace.city,
                    flightIata: this.formPlace.flightIata,
                }
                localStorage.setItem('flightsData',JSON.stringify(statusActive));
                this.$router.push({name: 'airportList'});
            },

            // 按航班查询
            queryByFlight(){
                this.getdataByFlightNo();

            },
            // 按机场查询
            queryByPlace(){
                this.getdataByCity();
            },

            // 获取根据城市三字码查询航班列表
            async getdataByCity(){
                let res = await flights.getFlightListByCity(this.formPlace);
                if(!res) return;
                switch(this.tabIndex) {
                    case 0:
                        this.dataListA = res.data;
                        break;
                    case 1:
                        this.dataListD = res.data;
                        break;
                }
            },

            // 根据航班号查询航班列表
            async getdataByFlightNo(){
                let res = await flights.getFlightListByFlightNo(this.formFlight);
                if(!res) return;
                switch(this.tabIndex) {
                    case 0:
                        this.dataListA = res.data;
                        break;
                    case 1:
                        this.dataListD = res.data;
                        break;
                }
            },
		},
		created(){
            let tempData = null;
            tempData = JSON.parse(localStorage.getItem('flightsData'))
            if(tempData){
                this.tabIndex = parseInt(tempData.tabIndex);
                this.switchValue = parseInt(tempData.switchValue);
                this.formFlight.flightno = tempData.flightno;
                this.formPlace.city = tempData.flightIata;
                this.formPlace.flightPlace = tempData.flightPlace;
            }
		},
		mounted(){
            
        },
        beforeDestroy(){
            
        },
        destroyed(){
            
        },
        watch:{
            tabIndex(val) {
                switch(val) {
                    case 0:
                        this.formFlight.direction = 'a';
                        this.formPlace.direction = 'a';
                        break;
                    case 1:
                        this.formFlight.direction = 'd';
                        this.formPlace.direction = 'd';
                        break;
                }
            }
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

<style lang='less'>
@import '../../style/definition.less';
.flights-index {
    height: 100%;
    background: #f0f2f7 url(../../assets/images/fight_bg.png) no-repeat top left;
    background-size: 100% auto;
    .flights-top-header.vux-header .vux-header-left .left-arrow {
        background: url(../../assets/images/icon_header_back_white.png) no-repeat center;
        background-size: 100%;
    }
}
.flights-top {
    flex: 0 0 2rem;
    width: 100%;
    z-index: 11;
    padding: 0 0.32rem;
    box-sizing: border-box;
    .x-header.flights-top-header {
        .vux-header-title-area {
            margin: 0 1.4rem!important;
        }
        .vux-tab-container {
            height: 1.04rem;
        }
       .vux-tab {
           height: 0.6rem;
           margin-top: 0.14rem;
           .vux-tab-item {
               line-height: 0.6rem;
           }
       }
    }
    .flights-top-switch {
        height: 0.72rem;
        .switch {
            flex: 0 0 2.12rem;
            height: 0.72rem;
            margin-right: 0.20rem;
            padding: 0.04rem;
            background-color: #fff!important;
            border-radius: 0.16rem;
            box-sizing: border-box;
            .vux-tab-wrap {
                .vux-tab-container {
                    height: 0.64rem;
                    .vux-tab {
                        height: 0.64rem!important;
                        background: transparent;
                        .vux-tab-item {
                            position: relative;
                            z-index: 1;
                            font-size: 0.28rem!important;
                            font-weight: normal;
                            line-height: 0.64rem;
                        }
                        .vux-tab-bar-inner {
                            border-radius: 0.14rem;
                            position: absolute;
                        }
                    }
                }
                
            }
        }
        >input {
            width: 100%;
            padding-left: 0.2rem;
            border-radius: 0.16rem;
            box-sizing: border-box;
            font-size: 0.28rem;
            color: @dark-color;
        }
        //添加查询按钮的样式
        >.switch-input {
            flex: 1;
            input {
                flex: 1;
                width: 100%;
                padding-left: 0.2rem;
                border-radius: 0.16rem;
                box-sizing: border-box;
                font-size: 0.28rem;
                margin-right: 0.1rem;
            }
            .switch-btn {
                flex:0 0 1.02rem;
                height: 100%;
                background:linear-gradient(to right,#3990f6, #4ab5f9);
                text-align: center;
                font-size: 0.28rem;
                line-height: 0.64rem;
                color: #fff;
                border-radius: 0.16rem;
            }
        }

    }
}
.flights-main {
    flex: 1;
    box-sizing: border-box; 
    overflow: auto;
    z-index: 0;
    ul {
        margin: 0 0.32rem;
        padding: 0.16rem 0.24rem;
        background: #fff;
        border-radius: @border-radius-primary;  
        margin-bottom: 0.5rem; 
        li.flights-main-item {
            height: 1.2rem;
            padding: 0.2rem 0;
            box-sizing: border-box;
            border-bottom: @border-bottom;
            &.active {
                background-color: #eaebed;
            }
            &:last-child {
                border-bottom: none;
            }
            h3 {
                height: 0.44rem;
                line-height: 0.44rem;
                font-size: 0.32rem;
                font-weight: normal;
                color: @dark-color;
            }
            p {
                height: 0.40rem;
                line-height: 0.4rem;
                font-size: 0.22rem;
                color: @gray-color;
            }
            >.item-icon {
                flex: 0 0 0.64rem;
                height: 0.64rem;
                border-radius: 50%;
                box-shadow: @box-shadow-icon;
                margin-right: 0.1rem;
                overflow: hidden;
            }
            >.item-flight {
                flex: 0 0 1.9rem;
                overflow: hidden;
        	    text-overflow: ellipsis;
        	    white-space: nowrap;
                h3 {
                    font-family: 'squre';
                } 
            }
            >.item-place {
                flex: 0 0 2.1rem;
                overflow: hidden;
        	    text-overflow: ellipsis;
        	    white-space: nowrap;
            }
            >.item-status {
                flex: 0 0 1.4rem;
                h3 {
                    font-size:0.24rem;
                    font-weight: normal;
                    height: 0.36rem;
                    line-height: 0.38rem;
                    text-align: center;
                    width: 1.14rem;
                    border-radius: @border-radius-little;
                    &.status_DEP {
        				color: #1cb393;
        				border: 0.02rem solid #1cb393;
        			}
        			&.status_LBD {
        				color: #f65d64;
        				border: 0.02rem solid #f65d64;
        			}
        			&.status_NST {
        				color: #1cb393;
        				border: 0.02rem solid #1cb393;
        			}
        			&.status_CKO {
        				color: #f65d64;
        				border: 0.02rem solid #f65d64;
        			}
        			&.status_CKI {
        				color: #f65d64;
        				border: 0.02rem solid #f65d64;
        			}
        			&.status_BOR {
        				color: #1cb393;
        				border: 0.02rem solid #1cb393;
        			}
        			&.status_POK {
        				color: #f65d64;
        				border: 0.02rem solid #f65d64;
        			}
        			&.status_TBR {
        				color: #1cb393;
        				border: 0.02rem solid #1cb393;
        			}
        			&.status_ARR {
        				color: #1cb393;
        				border: 0.02rem solid #1cb393;
        			}
        			&.status_ONR {
        				color: #1cb393;
        				border: 0.02rem solid #1cb393;
        			}
        			&.status_ALT {
        				color: #ff854f;
        				border: 0.02rem solid #ff854f;
        			}
        			&.status_DLY {
        				color: #ff854f;
        				border: 0.02rem solid #ff854f;
        			}
        			&.status_CAN {
        				color: #ff854f;
        				border: 0.02rem solid #ff854f;
        			}
        			&.status_RTN {
        				color: #ff854f;
        				border: 0.02rem solid #ff854f;
        			}
        			&.status_BAK {
        				color: #ff854f;
        				border: 0.02rem solid #ff854f;
        			}	
                }
            }
        }
    }
    
}


</style>