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
                <input v-if="!switchValue" type="search" placeholder="输入航班号" v-model.trim="formFlight.flightNum" @keyup.enter="queryByFlight">
                <input v-else type="text" placeholder="选择地点" v-model.trim="formPlace.flightPlace" @click.stop="toListPage"> -->

                <!-- 带查询按钮 -->
                <div class="switch-input flex" v-if="!switchValue">
                    <input type="text" placeholder="输入航班号" v-model.trim="formFlight.flightNum" @keyup.enter="queryByFlight" @keyup="formFlight.flightNum=$event.target.value.toString().toUpperCase()">
                    <button class="switch-btn" @click="queryByFlight">查询</button>
                </div>
                <div class="switch-input flex" v-else>
                    <input type="text" placeholder="点击选择地点" v-model.trim="formPlace.flightPlace" @focus="toListPage">
                    <button class="switch-btn" @click="queryByPlace">查询</button>
                </div>  
                
            </div>
        </div>
        <div class="flights-main" v-if="tabIndex==0">
            <ul v-if="dataListA&&dataListA.length">
                <li class="flights-main-item flex flex-justify" v-for="(item,index) in dataListA" :key="index" @click="toShowInfo(item,index)">
                    <div class="item-icon">
                        <img src="../../assets/images/xbk.jpg" alt="" v-imgReactive>
                    </div>
                    <div class="item-flight">
                        <h3>{{item.flights}}</h3>
                        <p>{{item.terminal}} <span style="margin-left: 0.1rem;">时间:{{item.time}}</span></p>
                    </div>
                    <div class="item-place">
                        <h3>{{item.place}}</h3>
                        <p>值机柜台:{{item.count}}</p>
                    </div>
                    <div class="item-status">
                        <h3>正在登机</h3>
                        <p>登机口:{{item.gate}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="flights-main" v-if="tabIndex==1">
            <ul v-if="dataListD&&dataListD.length">
                <li class="flights-main-item flex flex-justify" v-for="(item,index) in dataListD" :key="index" @click="toShowInfo(item)">
                    <div class="item-icon">
                        <img src="../../assets/images/xbk.jpg" alt="" v-imgReactive>
                    </div>
                    <div class="item-flight">
                        <h3>{{item.flights}}</h3>
                        <p>{{item.terminal}}<span style="margin-left: 0.1rem;">时间:{{item.time}}</span></p>
                    </div>
                    <div class="item-place">
                        <h3>{{item.place}}</h3>
                        <p>值机柜台:{{item.count}}</p>
                    </div>
                    <div class="item-status">
                        <h3>正在登机</h3>
                        <p>登机口:{{item.gate}}</p>
                    </div>
                </li>
            </ul>
        </div>
        
	
	</div>
	
</template>

<script>
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
                    {name: '进港航班', label: 0},
                    {name: '出港航班', label: 1},
                ],
                switchValue: 0,
                switchDatas: [
                    {name: '航班',label: 0},
                    {name: '地点', label: 1},
                ],
                // 查询参数
                formFlight: {
                    flightStatus: null,
                    flightNum: '',
                },
                formPlace: {
                    flightStatus: null,
                    flightPlace: '',
                    flightIata: ''
                },
                dataListA: [],  //进港航班数据
                dataListD: [],   //出港航班数据
                detailData: {},
                detailShow: false,
                indexActive: null,
                
                    
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
            toShowInfo(data,index){
                this.detailData = data;
                this.indexActive = index;
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
                    flightNum: this.formFlight.flightNum,
                    flightPlace: this.formPlace.flightPlace,
                    flightIata: this.formPlace.flightIata,
                }
                localStorage.setItem('flightsData',JSON.stringify(statusActive));
                this.$router.push({name: 'airportList'});
            },
            // 获取进港航班信息
            getdataListA(){

            },
            // 获取出港航班信息
            getdataListD(){

            },
            // 按航班查询
            queryByFlight(){
                console.log(this.formFlight)
                alert("该功能正在开发中...")
            },
            // 按机场查询
            queryByPlace(){
                console.log(this.formPlace)
                alert("该功能正在开发中..")
            }
		},
		created(){
            let tempData = null;
            tempData = JSON.parse(localStorage.getItem('flightsData'))
            if(tempData){
                this.tabIndex = parseInt(tempData.tabIndex);
                this.switchValue = parseInt(tempData.switchValue);
                this.formFlight.flightNum = tempData.flightNum;
                this.formPlace.flightPlace = tempData.flightPlace;
            }
            this.dataListA = [
               {id: 1, airline: '中国东方航空', flights: 'MU2560', terminal: 'T3', time: '15:30', place:'乌鲁木齐', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 2, airline: '海南航空', flights: 'JR8860', terminal: 'T3', time: '15:30', place:'北京', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 3, airline: '中国东方航空', flights: 'EU1130', terminal: 'T3', time: '15:30', place:'哈尔滨', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 4, airline: '中国东方航空', flights: 'MU2560', terminal: 'T3', time: '15:30', place:'西安', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 1, airline: '中国东方航空', flights: 'MU2560', terminal: 'T3', time: '15:30', place:'乌鲁木齐', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 2, airline: '海南航空', flights: 'JR8860', terminal: 'T3', time: '15:30', place:'北京', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 3, airline: '中国东方航空', flights: 'EU1130', terminal: 'T3', time: '15:30', place:'哈尔滨', count:'D23', gate:'H35', icon: '', status:'boarding'},
                {id: 4, airline: '中国东方航空', flights: 'MU2560', terminal: 'T3', time: '15:30', place:'西安', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 1, airline: '中国东方航空', flights: 'MU2560', terminal: 'T3', time: '15:30', place:'乌鲁木齐', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 2, airline: '海南航空', flights: 'JR8860', terminal: 'T3', time: '15:30', place:'北京', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 3, airline: '中国东方航空', flights: 'EU1130', terminal: 'T3', time: '15:30', place:'哈尔滨', count:'D23', gate:'H35', icon: '', status:'boarding'},
             
             
           
           ];
           this.dataListD = [
               {id: 1, airline: '海南航空', flights: 'JR2220', terminal: 'T3', time: '15:30', place:'格尔木', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 2, airline: '海南航空', flights: 'JR2220', terminal: 'T3', time: '15:30', place:'格尔木', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 3, airline: '海南航空', flights: 'JR2220', terminal: 'T3', time: '15:30', place:'格尔木', count:'D23', gate:'H35', icon: '', status:'boarding'},
               {id: 4, airline: '海南航空', flights: 'JR2220', terminal: 'T3', time: '15:30', place:'格尔木', count:'D23', gate:'H35', icon: '', status:'boarding'},
           ]
		},
		mounted(){
            
        },
        beforeDestroy(){
            
        },
        destroyed(){
            
        },
        watch:{
            tabIndex(val) {
                this.formFlight.flightStatus = val;
                this.formPlace.flightStatus = val;
            }
        }


		
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
                height: 0.4rem;
                line-height: 0.4rem;
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
                flex: 0 0 1.8rem;
                h3 {
                    font-family: 'squre';
                } 
            }
            >.item-place {
                flex: 0 0 2.2rem;
            }
            >.item-status {
                flex: 0 0 1.4rem;
                h3 {
                    font-size:0.24rem;
                    font-weight: normal;
                    height: 0.4rem;
                    line-height: 0.4rem;
                    text-align: center;
                    width: 1.14rem;
                    border: 2px solid #1cb393;
                    border-radius: @border-radius-little;
                    &.status0 {
                        color: #1cb393;
                        border: 2px solid #1cb393;
                    }
                    &.status1 {
                        color: #42a3f8; 
                        border: 2px solid #42a3f8;
                    }
                    &.status2 {
                        color: #f65d64;
                        border: 2px solid #f65d64;
                    }
                    &.status3 {
                        color: #ff8f44;
                        border: 2px solid #ff8f44;
                    }
                }
            }
        }
    }
    
}


</style>