<template>
	<div class="index ">
        <x-header class="x-header" :title="title" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="airportInfo-main">
            <div class="airportInfo-box" v-if="countDataList&&countDataList.length">
                <!-- <div class="airportInfo-top">
                    查看大图
                </div> -->
                <div class="airportInfo-table">
                    <ul>
                        <li class="airportInfo-table-item flex" v-for="(item,index) in countDataList" :key="index">
                            <div class="item-num">
                                <h4>{{item.checkin_num_of_counter}}</h4>
                            </div>
                            <div class="item-text">
                                <div class="item_icon" v-if="item.checkin_airline_iata">
                                    <img :src="item.checkin_airline_iata" alt="" @error="errorImg(item)">
                               
                                </div>
                                <p  v-for="(child,childIndex) in item.checkin_info_of_counter.split(',')" :key="childIndex">
                                    {{child}}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            
		</div>
	</div>
	
</template>

<script>
    import { getCheckInCounterList } from '../../service/api';
	export default {
		data() {
			return {
                title: '',
                countStatus: this.$route.params.count,
                position: '',
                countDataList: [],
			}
		},
		methods: {
            callback(){
                this.$router.back(-1);
            },
            init(){
                getCheckInCounterList({
                    position: this.position,
                    // model: 1,
                }).then(res=>{
					this.countDataList = [];
					if(res && res.status == 0 && res.data) {
                        this.countDataList = res.data;
                        this.countDataList.forEach(item=>{
                            if(item.checkin_airline_iata.length) {
                                item.checkin_airline_iata = '../../static/img/airline/M_' + item.checkin_airline_iata.toUpperCase()+'.png';
                            }   
                            
                        })
					}
				})
            },
            /**
             * 去空格，转小写
             */
            trim(str) {
                return allTrim(str);
            },
            errorImg(data){
                data.checkin_airline_iata = null
            }

			

		},
		created(){
            switch(this.countStatus) {
                case 'south':
                    this.title = '南值机区柜台分布';
                    this.position = 'S';
                    break;
                case 'north':
                    this.title = '北值机区柜台分布';
                    this.position = 'N';
                    break;
            }
            this.init();
		},
		mounted(){
			
		},


		
	}
</script>

<style lang='less' scoped>
@import '../../style/definition.less';
.index {
	width: 100%;
	height: 100%;
    position: relative;
	.airportInfo-main {
		width: 100%;
        padding: 1.4rem 0.32rem;
        box-sizing: border-box;
        .airportInfo-box {
            width: 100%;
            padding: 2.1rem 0.24rem 0.24rem;
            box-sizing: border-box;
            border-radius: @border-radius-primary;
            background: #37465c url(../../assets/images/airport_info_card_bg_01.png) no-repeat top left;
            background-size: 100% auto;
            overflow: hidden;
            position: relative;
            .airportInfo-top {
                position: absolute;
                top: 0.24rem;
                right: 0.24rem;
                width: 1.7rem;
                height: 0.56rem;
                background-color: rgba(30,38,64,0.8);
                border-radius: 0.28rem;
                font-size: 0.26rem;
                line-height: 0.56rem;
                text-align: center;
                color: #fff;
            }
            .airportInfo-table {
                    >ul {
                        li.airportInfo-table-item {
                            padding: 0.16rem 0;
                            border-bottom: 1px solid rgba(255,255,255,0.2);
                            &:last-child {
                                border-bottom: none;
                            }
                            .item-num {
                                flex: 0 0 1.24rem;
                                margin-right: 0.3rem;
                                h4 {
                                    width: 100%;
                                    height: 0.48rem;
                                    font-family: 'squre';
                                    font-size: 0.36rem;
                                    font-weight: normal;
                                    line-height: 0.48rem;
                                    text-align: center;
                                    color: #fff;
                                    background-color: @lightorange-color;
                                    border-radius: 0.1rem;
                                }
                            }
                            .item-text {
                                flex: 1;
                                position: relative;
                                p {
                                    font-size: 0.28rem;
                                    line-height: 0.44rem;
                                    text-align: left;
                                    color: #fff;
                                }
                                .item_icon {
                                    position: absolute;
                                    top: 50%;
                                    right: 0;
                                    transform: translateY(-50%);
                                    width: 0.64rem;
                                    height: 0.64rem;
                                    border-radius: 50%;
                                    overflow: hidden;
                                    vertical-align: middle;
                                    text-align: center;
                                    img {
                                        width: 100%;
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