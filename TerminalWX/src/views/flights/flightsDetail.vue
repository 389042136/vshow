<template>
	<popup v-model="show" @on-hide="menuClose"> 
        <div class="flightinfo-main flex flex-column">
            <div class="flightinfo-top flex flex-justify">
                <div class="flightinfo-title">
                    <i>
                        <img src="" alt="">
                    </i>
                    <div>
                        <h3>{{data.airline}}</h3>
                        <p>{{data.flights}}</p>
                    </div>
                </div>
                <div class="flightinfo-icon">
                    催促登机
                </div>
            </div>
            <div class="flightinfo-city flex flex-center">
                <div class="info-start">
                    <h4>银川 T3</h4>
                </div>
                <div class="info-over">
                    <p>经停</p>
                    <div class="info-over-line"></div>
                    <p >西安</p>
                </div>
                <div class="info-end">
                    <h4>北京 T3</h4>
                </div>
            </div>
            <div class="flightinfo-detail flex flex-around">
                <div class="detail-plane">
                    <h4>计划起飞</h4>
                    <p>{{data.time}}</p>
                </div>
                <div class="detail-expect">
                    <h4>预计起飞</h4>
                    <p>14:25</p>
                </div>
                <div class="detail-count">
                    <h4>值机柜台</h4>
                    <p>{{data.count}}</p>
                </div>
                <div class="detail-gate">
                    <h4>登机口</h4>
                    <p>{{data.gate}}</p>
                </div>
            </div>
        </div>
    </popup>
	
</template>

<script>

	export default {
        props: {
            detailShow: Boolean,
            detailData: Object,
            
        },
		data() {
			return {
                show: false,
                data: {},
			}
        },
        methods: {
            init(){
                this.show = this.detailShow;
                this.data = this.detailData;
            },
            menuClose(){
                this.$emit('detailClose');
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
                this.data = JSON.parse(JSON.stringify(val));
            }
        }
		

		
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
                background-color: #fff;
                margin-right: 0.2rem;
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
            background-color: #f65d64;
            &.status0 {
                background-color: #1cb393;
    		}
    		&.status1 {
    			background-color: #42a3f8;
    		}
    		&.status2 {
    			background-color: #f65d64;
    		}
    		&.status3 {
    			background-color: #ff8f44;
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
        }
        h4 {
            font-size: 0.4rem;
            font-weight: normal;
            line-height: 1.5rem;
        }
        p {
            font-size: 0.24rem;
        }
        .info-over {
            flex: 0 0 1.8rem;
            height: 1rem;
            margin-top: auto;
            margin-bottom: auto;
            >.info-over-line {
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