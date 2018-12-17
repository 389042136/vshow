<template>
	<div>
        <x-header class="x-header" :title="title" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
        <div class="menu-box flex flex-column">
            <div class="notice-main notice-detail">
                <div class="notice-div" v-for="(item,index) in dataList" :key="index" :title="item.title" @click="toMinute(item)">
                    <div class="notice-div-title flex flex-justify">
                        <h3>{{item.title}}</h3>
                        <i><img src="../../assets/images/list_arrow_right.png" alt="list_arrow_right.png"></i>
                    </div>
                    <div class="div-p flex flex-column" >
                        <p v-html="item.content"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
	
</template>

<script>
	export default {
		
		data() {
			return {
                showChinese: true,
                title: "登机注意事项",
                dataList: [],
			}
        },
        methods: {
            callback(){
                this.$router.push({name: 'notice'});
			},
            toggleC(){
                this.showChinese = true;
            },
            toggleE(){
                this.showChinese = false;
            },
            toMinute(data){
                this.$router.push({name:'noticeMinute', params:data});
            },
            init(){
                this.dataList = [
                    {
                        enumName: "登机注意事项",
                        title: "国内航班登机注意事项",
                        content: `1、登机牌<br />登机牌是您乘坐飞机唯一的登机凭证，您应妥善保管。登机牌上的信息您应仔细阅读，其中常规的内容包括：姓名、航班号、乘机日期、登机口位置、登机时间、座位号码、舱位等级、始发地和目的地。最重要的是，每一张登机牌上都有特别提示的内容：登机口于飞机起飞前15分钟关闭。这句话的意思是告知您，飞机会在起飞前15分钟（根据登机牌上列出的时间）按时关闭舱门。因此，有了登机牌，您还需要在规定的时间内登机，方可顺利成行。<br />
                        2、候机显示屏及广播<br />您应按照登机牌所显示的登机口号在相应登机口候机，及时关注航班显示屏及候机广播的相关内容。如遇特殊情况，会临时改变登机口，变更后的登机口位置将通过显示屏或候机楼广播告知您。因此，您登机牌上所列明的登机口有可能不是您最终登机的准确位置，因此，请您留意临时变更的相关乘机信息。银川河东国际机场航站楼国内出港区域登机口由北向南排列顺序为7号至22号。远机位候机室登机口为55号至58号。<br />
                        3、漏乘飞机<br />您在始发站办理乘机手续后、或在经停站过站时，如果是因为航空公司原因未能搭乘上指定的航班，航空公司会为您改签后续航班；如果是您自身原因造成漏乘，按旅客误机处理。<br />`,
                    },
                    {
                        enumName: "登机注意事项",
                        title: "国际航班登机注意事项",
                        content: `1、登机牌<br />登机牌上的信息您应仔细阅读，其中常规的内容包括：姓名、航班号、乘机日期、登机口位置、登机时间、座位号码、舱位等级、始发地和目的地。最重要的是，每一张登机牌上都有特别提示的内容：登机口于飞机起飞前15分钟关闭。这句话的意思是告知您：飞机会在起飞前15分钟（根据登机牌上列出的时间）按时关闭舱门。因此，有了登机牌，您还需要在规定的时间内登机，方可顺利成行。<br />
                        2、候机显示屏及广播<br />旅客应按照登机牌所显示的登机口号在相应登机口候机，及时关注航班显示屏及候机广播的相关内容。如遇特殊情况，会临时改变登机口，变更后的登机口位置将通过显示屏或候机楼广播告知您。因此，您登机牌上所列明的登机口有可能不是您最终登机的准确位置，因此，请您留意临时变更的相关乘机信息。银川河东国际机场国际出港登机口为1号至6号，请您按照登机牌上指示在指定登机口候机。<br />
                        3、截止时间<br />航空公司根据各机场、航站楼的设施和环境的不同，截止办理乘机手续的时间是不同的，请您提前向航空公司、机场了解相关信息，以免误机。银川河东机场国际航班在飞机起飞前40分钟停止办理乘机手续。为避免误机，请您在规定时间前到达机场，持有效身份证件到出发大厅开放的值机柜台办理乘机手续。如正常排队办理乘机手续时间紧张，请及时向工作人员和值班经理提出，以寻求协助。<br />
                        4、漏乘飞机<br />如果因为航空公司原因未能搭乘上指定的航班，航空公司会为您改签后续航班；如果是您自身原因造成漏乘，按旅客误机处理。<br />`,
                    }
                ]
    					
            }
		},
		created(){
           this.init();
        },
        mounted(){
			
        },
        watch:{

        }
	}
</script>

<style lang='less' scoped>
.notice-main {
	height: 100%;
	width: 100%;
	padding: 1.28rem 0.32rem 0;
	box-sizing: border-box;
    .notice-div{
        padding: 0.32rem;
        margin-top: 0.24rem;
        box-sizing: border-box;
        background-color:#FFFFFF;
        border-radius: 0.24rem;
        font-size: 0.24rem;
        color: #828999;
        .notice-div-title {
            margin-bottom: 0.1rem;
            h3 {
                color: #41a1f7;
                font-weight: normal;
                font-size: 0.32rem;
            }
            i {
                width: 0.32rem;
                height: 0.32rem;
            }
        }
        .div-p {
            text-overflow:ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
            p {
                line-height: 0.4rem;
                text-overflow:ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                
            }
        }   
        
        

    }
}
</style>