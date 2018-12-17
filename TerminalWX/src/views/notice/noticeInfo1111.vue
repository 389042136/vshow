<template>
	<div>
        <x-header class="x-header" :title="param.enumName" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
        <div class="menu-box flex flex-column">
            <div class="notice-main notice-detail">
                <div class="notice-div" >
                    <mt-cell class="cell"  :to="{path:'/noticeMinute', query:powerBank}" is-link title="1.关于携带充电宝的规定"></mt-cell>
                    <div class="div-p flex flex-column" @click="toMinute(powerBank)">
                        <p class="p2">
                             {{powerBank.one}}<br/> 
                             {{powerBank.two}}<br/>
                             {{powerBank.three}}
                             <!--1额定能量小于100WH能带上飞机 -->
                            <!-- 2旅客们最多可携带2个充电宝上飞机，而且总容量不超过20000毫安的旅客们最多可携带2个充电宝上飞机，而且总容量不超过20000毫安的旅客们最多可携带2个充电宝上飞机，而且总容量不超过20000毫安的 -->
                        </p>
                    </div>
                </div>
                <div class="notice-div" >
                    <mt-cell class="cell" :to="{path:'/noticeMinute', query:luggage}" is-link title="2.行李托运规定"></mt-cell>
                    <div class="div-p flex flex-column" @click="toMinute(luggage)">
                        <p class="p2">
                             {{luggage.one}}<br/> 
                             {{luggage.two}}<br/>
                             {{powerBank.three}} 
                        </p>
                    </div>
                </div>
                <div class="notice-div" >
                    <mt-cell class="cell" :to="{path:'/noticeMinute', query:luggage}" is-link title="3.行李托运规定"></mt-cell>
                    <div class="div-p flex flex-column" @click="toMinute(luggage)">
                        <p class="p2">
                             {{luggage.one}}<br/> 
                             {{luggage.two}}<br/>
                             {{luggage.three}}  
                        </p>
                    </div>
                </div>
                <div class="notice-div" >
                    <mt-cell class="cell" :to="{path:'/noticeMinute', query:powerBank}" is-link title="4.关于携带充电宝的规定"></mt-cell>
                    <div class="div-p flex flex-column" @click="toMinute(powerBank)">
                        <p class="p2">
                             {{powerBank.one}}<br/> 
                             {{powerBank.two}}<br/>
                             {{powerBank.three}} 
                        </p>
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
                param: {},
                powerBank:{}, //充电宝
                luggage:{} //行李
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
               this.$router.push({path:'/noticeMinute', query:data});
            },
            init(){
                this.powerBank={
                        "enumName":this.param.enumName,
                        "title":'关于携带充电宝的规定',
                        "one":"1、禁止托运，充电宝须单独拿出来过安检。",
                        "two":"2、未注明电量指标的充电宝一律禁止上飞机。",
                        "three":"3、充电宝额定能量不超过100WH（瓦特小时）的无需航空公司批准，即可带上飞机；超过100WH但不超过160WH的，经航空公司批准后方可携带。",
                        "four":"4、不得在飞行过程中使用充电宝给电子设备充电。对于有启动开关的充电宝，在飞行过程中应始终关闭充电宝。",
                        "five":"5、民航局发出公告，充电宝禁止托运，每名旅客随身携带充电宝的数量不超过两个。充电宝额定能量不超过100WH（瓦特小时）的无需航空公司批准，即可带上飞机；超过100WH但不超过160WH的，经航空公司批准后方可携带"
                    };
                this.luggage={
                    "enumName":this.param.enumName,
                    "title":'托运行李规定',
                    "one":'1、禁止托运爆炸或者燃烧物质和装置；能够造成人身严重伤害或者危机航空器安全的爆炸或燃烧装置（物质）或者可能被误认为是此类装置的物品，弹药、爆破器材、烟火制品、上述物品的仿真品等;',
                    "two":'2、禁止托运管制器具；能够造成人身伤害或对航空安全和运输秩序构成较大危害的管制器具，管制刀具、军警械具、其他属于国家规定的管制器具等；',
                    "three":'3、禁止托运能够造成人身伤害或对航空安全和运输秩序构成较大危害的危险物品，压缩气体、自燃物品、遇湿易燃物品、易燃液体、易燃固体、氧化剂和有机过氧化物、毒害品、腐蚀性物品、放射性物品等；',
                    "four":'4、禁止托运枪支等武器（包括主要零部件）；能够发射弹药并造成人身严重伤害的装置或者可能被误认为是此类装置的物品，军用枪、民用枪、其他枪支及仿真枪支等；',
                    "five":'5、婴儿在旅途中必需的液态乳制品、糖尿病或其他疾病的患者航空旅途中必需的液态药品，经安全检查确认后方可随身携带；',
                };
            }
		},
		created(){
           this.param = this.$route.params;
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
	padding: 1.2rem 0.32rem 0;
	box-sizing: border-box;
    .notice-div{
         height: 10%;
         width: 100%;
         box-sizing: border-box;
         background-color:#FFFFFF;
         margin-top: 0.24rem;
         border-radius: 0.24rem;
         .cell{
             padding-top: 0.5%;
            //  height: 0.05%;
             font-size: 0.2rem;
             font-weight: normal;
             color: #41a1f7;
             margin: 0 0.24rem 0 0.32rem ;
         }
         .div-p{
             width: 100%;
             margin-top: -0.5%;
             margin-bottom: 0.2rem;
             .p2{ 
                 font-size: 0.24rem;
                 font-weight: normal;
                 line-height: 0.4rem;
                 padding-left: 0.32rem;
                 padding-right: 0.24rem;
                 overflow: hidden;
                 text-overflow:ellipsis;
                 -webkit-line-clamp: 3;
                 -webkit-box-orient: vertical;
				 color:#828999;
             }
         }
    }
}
</style>