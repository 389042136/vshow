<!-- 公共组件： Top -->
<template>
    <div class="common-weather">
        <div class="weather-icon">
            <img v-if="weatherStatus=='day'" :src="weatherPic" alt="">
            <img v-if="weatherStatus=='night'" :src="weatherPicNight" alt="">
        </div>
        <div class="city" v-cloak>
            <div>多云转晴</div>
            <!-- <div>{{data.weatherDayNight}}</div> -->
            <div>{{data.weatherDayTemprature}}<span class="separate">/</span>{{data.weatherNightTemprature}}<span class="degree">&#8451;</span></div>
        </div>
    </div>
</template>

<script>
    import { getWeather } from '../../service/api';
    export default {
        prop:{
            panelCity: String,
        },
        data(){
            return {
                cityCode:'INC',  //城市代码
                data: {},   //天气信息
                cityData: {},   //城市信息
                weatherStatus: {},   //白天还是晚上
                weatherPicDay:'',   //白天图片
                weatherPicNight:'',   //晚上图片
            }
        },
        methods:{
            init(){
                getWeather(this.cityCode).then(res=>{
                    this.data = {};
                    if(res && res.status == 0){
                        this.$nextTick(()=>{
                            this.weatherStatus = res.data.dayOrNight;
                            this.data = res.data.weather;
                            this.cityData = res.data.airport;
                            this.weatherPic = require('../../assets/images/day/'+this.data.weatherCodeDay+ '.png');
                            this.weatherPicNight = require('../../assets/images/night/'+this.data.weatherCodeNight+ '.png');
                        })
                    }
                })
            },

        },
        created(){
            this.init();
        },
        mounted(){
            

        },
        watch:{
            panelCity(val){
                this.cityCode = val;
            },
        }
        
    }
</script>


<style lang="less" scoped>
@import '../../style/definition.less';
    .common-weather {
        min-width: 2rem;
        height: 0.56rem;
        .weather-icon {
            float: left;
            width: 0.56rem;
            height: 0.56rem;
            margin-right: 0.1rem;
        }
        .city {
            height: 0.56rem;
            float: left;
            div {
                font-size: 0.22rem;
                color: @dark-color;
                span.separate {
                color: @dark-color;
                }
                span.degree {
                    font-size: 0.22rem;
                }
            }
            
        }
        
    }
</style>

