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
                title: "安检注意事项",
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
                        enumName: "安检注意事项",
                        title: "国内航班安检注意事项",
                        content: `1、维序岗位<br />当您办理完登机牌和行李托运后，就可以前往候机楼大厅中央接受登机前的安全检查。请确保随身物品中无火种、液体（包括超过规格的液体化妆品物品）及其他禁止携带物品。通过维序岗位时向安检员出示您的登机牌，送行人员止步。<br />
                        2、优先检查通道<br />安检区域设置有航空公司头等舱旅客、金银卡旅客、军人依法优先通道，还设置有晚到、儿童、中转、无行李、塞上行会员、城市候机楼旅客通道及其他旅客通道，请查看通道上方屏显对应到S21、S20及其他通道接受检查。<br />
                        3、通道内检查<br />(1)接受证件检查时，请向安检人员出示登机牌和购买机票时的有效乘机凭证，同时面向安检员身后摄像头接受拍照；安检员查验完成，在登机牌上加盖安检验讫章后交还给您；您和随身携带的所有物品接受下一阶段安全检查。<br />(2)通过验证后，到达X光机前段区域，将您随身携带的箱包放入X光机传送带上，将电脑、导线、充电宝、手机等电子产品及钥匙、钱包、香烟等随身物品单独取出放入框中，然后通过金属探测门接受人身检查。<br />(3)您随身携带的箱包及放入置物框内的物品接受x光机检查，如发现问题则需进行开箱包检查，检查后需再次经过X光机复检。禁止随身携带的物品根据检查要求请您到值机柜台重新办理托运手续或寄存。<br />(4)当您通过金属探测门后，请接受人身检查。进行人身检查时，如携带火种类物品需取出做自弃处理；如携带利器类物品可自弃或者放入您的包中重新到值机柜台办理托运，托运完成后需重新进行安全检查；遇安检员查出可疑物品时，请您配合取出并交由安检员查验。安全检查结束后，请注意取走您随身行李及放入筐内的个人物品。<br />
                        4、温馨提示<br />(1)为了保证航空安全，特殊情况下会实施脱鞋解皮带等形式检查，请您配合。<br />(2)孕妇通过安检时，如有顾虑请向安检人员提前说明，但需接受手工人身检查。<br />(3)为了确保您顺利出行，您应于起飞前至少一个小时到达安检接受安全检查，为接受安全检查留出充足的时间，减少不必要的麻烦。<br />(4)严禁冒用他人证件、伪造证件、涂改证件等违法行为，如您出现此类情况将面临公安机关的处罚。`,
                    },
                    {
                        enumName: "安检注意事项",
                        title: "国际航班安全检查",
                        content: `1、旅客证件检查<br />安检时，请您向安检人员出示登机牌和有效身份证件，安检员审核后将在登机牌上加盖安检验讫章。您和您随身携带的所有物品必须接受安全检查。<br />
                        2、行李物品检查<br />旅客进入安检通道时首先将行李物品放入X射线安检设备的传送带上, 工作人员通过电视荧光屏（X光机）检查，如发现问题，则进行开包检查。<br />
                        3、手提行李物品检查<br />将随身携带的手提行李物品放在电视监测机（X光机）的传送带上，手机、硬币、钥匙等放在篮子里，由检查人员通过荧光屏（X光机）检查。<br />
                        4、旅客身体检查<br />旅客通过特设的探测门，进行身体检查。<br />
                        5、安全检查结束后<br />请不要遗漏您放入筐内的个人物品。<br />
                        6、温馨提示<br />(1)为了保证航空安全，特殊情况下需实施安检特别工作方案，可能要求您脱下皮带、鞋子等。必要时可以对旅客人身及其手提行李全部进行仪器和手工双重检查，请您配合安检人员的检查。<br />
                        (2)金属探测门的安全性：旅客在通过探测门时会有顾虑，像孕妇、带有心脏起搏器的患者，甚至有旅客担心信用卡、手机、相机等物品会受影响而失效。这种顾虑是没必要的，不必恐慌，民航金属探测门和手持金属探测器都是经过严格检验，符合安全标准和旅客安全标准的，它通过感应寄生电流及均化磁场的数字信号处理方式获得很高的分辨率，但发射磁场厚度很低，对心脏起搏器佩戴患者、体弱者、孕妇，磁场媒质和其他一些电子装置均无损害，广大乘机旅客可以放心通过安检。孕妇通过安检时，如有顾虑请向安检人员提前说明，但需接受手工人身检查。<br />
                        (3)为了保证按时起飞，您应提前到达机场，为接受安全检查留出充足的时间，减少不必要的麻烦。如果您因为个人及其他原因延误了航班，需要找航空公司进行签转，根据机票种类的不同区别处理。<br />`,
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