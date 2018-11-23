<!-- 公共组件： Top -->
<template>
    <div class="common-time">
        <div class="time">{{timedata.time}}</div>
        <div class="date">
            <p>{{timedata.date}} </p>
            <p>{{timedata.week}}</p>
        </div>
    </div>
</template>

<script>
import { dateFormat } from '../../utils/utils';
    export default {
        data(){
            return {
                timedata: {},
            }
        },
        methods: {

        },
        created(){
            let data = dateFormat(new Date(),'MM月dd日 EEE HH:mm').split(' ');    
            this.timedata = {date: data[0], week: data[1], time: data[2]} ;
        },
        mounted(){
            
            this.timer = setInterval(()=>{
                this.timedata = {};
                let data = dateFormat(new Date(),'MM月dd日 EEE HH:mm').split(' ')
                this.timedata = {date: data[0], week: data[1], time: data[2]};
            },1000)
        },
        beforeDestroy(){
            if(this.timer){
                clearInterval(this.timer);
            }
        },
        watch: {

        }
        
    }
</script>


<style lang="less" scoped>
@import '../../style/definition.less';
    .common-time {
        div.time {
            font-size: 0.72rem;
            line-height: 0.75rem;
            font-weight: 400;
        }
        div.date {
            margin-top: 0.05rem;
            p {
                float: left;
                font-size: 0.26rem;
                color: @gray-color;
                &:last-child{
                    margin-left: 0.1rem;
                }
            }   
        } 
    }
</style>

