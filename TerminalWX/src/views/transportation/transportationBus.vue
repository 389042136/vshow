<template>
        <div class="transportion-box flex flex-column">
            <x-header :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback" style="position: static; background: transparent;" class="x-header transportion-header">
                <div solt="overwrite-title" style="color: #fff;">机场大巴</div>
                <div class="header-right" @click="toShowCode">
                    <h4>购票</h4>
                    <!-- <div class="code-box" v-if="showCode">
                        <div class="pic">
                            <img src="../../assets/images/code_03.png" alt="">
                        </div>
                        <div class="content">
                            <h4>手机扫描二维码购票</h4>
                        </div>
                    </div> -->
                </div>
		    </x-header>
            <div class="transportion-main">
                <ul v-if="dataList&&dataList.length">
                    <li class="transportion-item" v-for="(item,index) in dataList" :key="index">
                        <div class="transportion-item-top flex flex-justify">
                            <div class="icon-item">
                                <i><img src="../../assets/images/icon_traffic_airport_bus.png" alt=""></i>
                            </div>
                            <div class="item-route">
                                <h4>线路</h4>
                                <p>{{item.start}}</p>
                            </div>
                            <!-- <div class="item-mile">
                                <h4>里程 Mileage</h4>
                                <p>21公里</p>
                                <h5>20km</h5>
                            </div> -->
                            <div class="item-time">
                                <h4>时间</h4>
                                <p>{{item.time}}</p>
                                <!-- <h5 class="active-red">5分钟后发车</h5> -->
                            </div>
                            <div class="item-tickets">
                                <h4>余票</h4>
                                <p><span class="active-red">{{item.tickets}}</span> </p>
                                <!-- <h5>余票充足</h5> -->
                            </div>
                            <div class="item-price">
                                <p class="active-red">￥{{item.price}}</p>
                                <!-- <h5></h5> -->
                            </div>
                        </div>
                        <div class="transportion-item-bottom flex flex-justify">
                            <!-- <div class="item-route">
                                <ul class="flex flex-nwrap">
                                    <li v-for="(item, index) in routeList" class="flex flex-nwrap" :key="index" >
                                        <p>{{item}}</p>
                                        <div v-if="index<routeList.length-1"></div>
                                    </li>
                                </ul>
                            </div> -->

                            <div class="item-route" :style="{'height':!item.isMore?'auto':'0.64rem'}">
                                <ul class="flex flex-wrap" ref="line">
                                    <li v-for="(child,childIndex) in item.routeList" class="flex flex-nwrap" :key="childIndex">
                                        <p>{{child}}</p>
                                        <div v-if="childIndex<item.routeList.length-1"></div>
                                    </li>
                                </ul>
                            </div>
                            <div class="item-title" ref="itemRouteTitle">
                                <div class="item-more" @click="toRouteMore(item)" v-if="item.isMore">···</div>
                                {{item.mile}}
                            </div>
                        </div>
                    </li>
                    

                </ul>
                
            </div>
        </div>
	
</template>

<script>
	export default {
		data() {
			return {
                showCode: false,
                dataList: [],

			}
        },
        methods: {
            callback(){
                this.$router.back(-1);
            },
            toShowCode(){
                // this.showCode = !this.showCode;
                // 跳转至购票界面
            },
            toRouteMore(item){
                this.$set(item, 'isMore', false)
            },
		},
		created(){
            this.dataList = [
                {id: 1, start: '空港酒店', time:'12:00', tickets: 86, price: '20:00', mile: '20km', routeList: [
                    '始发站名称', '经停站1', '经停站2', '经停站3', '经停站4', '经停站5', '经停站6', '空港酒店',
                ]},
                {id: 2, start: '空港酒店', time:'12:00', tickets: 86, price: '20:00', mile: '20km', routeList: [
                    '始发站名称', '经停站1', '经停站2', 
                ]},
            ]

        },
        mounted(){
            let height = this.$refs.itemRouteTitle[0].offsetHeight;
            this.$refs.line.forEach((item, index) => {
                if(item.offsetHeight > height){
                    this.$set(this.dataList[index], 'isMore', true);
                }
            })
            
            
            
            
        },
        watch:{

        }
		

		
	}
</script>

<style lang='less' scoped>
@import '../../style/definition.less';
.transportion-box {
    height: 100%;
    background: #f0f2f7 url(../../assets/images/bus_bg.png) no-repeat top left;
    background-size: 100% auto;
    .transportion-header {
        color: #fff;
        flex: 0 0 1rem;
        z-index: 11;
        .header-right {
            position: absolute;
            top: 0.2rem;
            right: 0.32rem;
            width: 1rem;
            height: 0.56rem;
            background-color: @orange-color;
            border-radius: @border-radius-little;
            h4 {
                font-size: 0.28rem;
                font-weight: normal;
                line-height: 0.56rem;
                text-align: center;
                color: @dark-color;
            }
            .code-box {
                position: absolute;
                top: 0.8rem;
                right: 0;
                width: 2.6rem;
                height: 3rem;
                background-color: #fff;
                border-radius: @border-radius-primary;
                padding: 0.18rem;
                box-sizing: border-box;
                box-shadow: @box-shadow-box;
                &:before {
                    content: '';
                    position: absolute;
                    top: -0.08rem;
                    right: 0.5rem;
                    width: 0.16rem;
                    height: 0.16rem;
                    background-color: #fff;
                    -webkit-transform: rotate(45deg);
                    -moz-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
                .content {
                    text-align: center;
                    color: @darkblue-color;
                    h4 {
                        font-size: 0.24rem;
                    }
                }

            }
        }
    }
    .transportion-main {
        flex: 1;
        box-sizing: border-box; 
        overflow: auto;
        z-index: 0;
        >ul {
            margin: 0.24rem 0.32rem 0.5rem;
            li.transportion-item {
                // height: 1.76rem;
                margin-bottom: 0.24rem;
                border-radius: @border-radius-primary;
                background-color: #fff;
                padding: 0 0.24rem;
                box-sizing: border-box;
                &:last-child {
                    margin-bottom: 0;
                }
                >.transportion-item-top {
                    height: 1.12rem;
                    padding: 0.24rem 0;
                    border-bottom: @border-bottom;
                    box-sizing: border-box;
                    .icon-item  {
                        flex: 0 0 0.64rem;
                        height: 0.64rem;
                        margin-right: 0.2rem;
                        background: @linear-gradient-primary;
                        border-radius: 50%;
                        box-sizing: border-box;
                        position: relative;
                        i {
                            width: 0.46rem;
                            height: 0.46rem;
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%,-50%);
                        }
                    }
                    .item-route {
                        flex: 0 0 30%;
                        // flex: 0 0 2rem;
                    }
                    .item-mile {
                        flex: 0 0 16%;
                        // flex: 0 0 1rem;
                    } 
                    .item-time {
                        flex: 0 0 16%;
                        // flex: 0 0 1rem;
                    }
                    .item-tickets {
                        flex: 0 0 16%;
                        // flex: 0 0 0.9rem;
                    }
                    .item-price {
                        flex: 1;
                        p {
                            font-family: 'squre';
                            font-size: 0.36rem;
                            height: 0.72rem;
                            line-height: 0.72rem;
                            text-align: right;
                            margin-top: 0;
                        }
                    }
                    > div {
                        h4 {
                            font-size: 0.22rem;
                            height: 0.22rem;
                            line-height: 0.22rem;
                            font-weight: normal;
                            color: @gray-color;
                        }
                        p {
                            font-size: 0.28rem;
                            height: 0.3rem;
                            line-height: 0.3rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            margin-top: 0.1rem;
                        }
                    }
                }
                >.transportion-item-bottom {
                    width: 100%;
                    // height: 0.64rem;
                    .item-title {
                        flex: 0 0 1.6rem;
                        height: 0.64rem;
                        font-size: 0.22rem;
                        color: @gray-color;
                        text-align: right;
                        line-height: 0.64rem;
                        box-sizing: border-box;
                        position: relative;
                        >.item-more {
                            position: absolute;
                            height: 0.32rem;
                            top: 50%;
                            transform: translateY(-50%);
                            right: 1rem;
                            padding: 0 0.14rem;
                            font-size: 0.24rem;
                            line-height: 0.32rem;
                            color: @theme-color;
                            background-color: #f0f2f7;
                            border-radius: @border-radius-little;

                        }
                    }
                    .item-route {
                        
                        overflow: hidden;
                        // ul {
                        //     overflow-x: auto;
                        //     overflow-y: hidden;
                        //     li {
                        //         height: 1rem;
                        //         margin: 0;
                        //         text-align: left;
                        //         min-width: 1rem;
                        //         flex-shrink: 0;
                        //         >p {
                        //             float: left;
                        //             font-size: 0.22rem;
                        //             line-height: 0.64rem;
                        //             color: @theme-color;
                        //         }
                        //         >div {
                        //             float: left;
                        //             width: 0.22rem;
                        //             height: 0.12rem;
                        //             background: url(../../assets/images/line_arrow.png) no-repeat center;
                        //             background-size: 100% 100%;
                        //             margin: 0.2rem 0.1rem 0;
                        //         }
                        //     }
                        // }

                        ul {
                            li {
                                height: 0.64rem;
                                margin: 0;
                                text-align: left;
                                min-width: 1rem;
                                flex-shrink: 0;
                                >p {
                                    float: left;
                                    font-size: 0.22rem;
                                    line-height: 0.64rem;
                                    color: @theme-color;
                                }
                                >div {
                                    float: left;
                                    width: 0.22rem;
                                    height: 0.12rem;
                                    background: url(../../assets/images/line_arrow.png) no-repeat center;
                                    background-size: 100% 100%;
                                    margin: 0.25rem 0.1rem 0;
                                }
                            }
                        }
                        
                    }
                }
            }
        }
    }
}

</style>