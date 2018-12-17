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
                title: "行李托运规定",
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
                        enumName: "行李托运规定",
                        title: "禁止托运的物品",
                        content: `1、枪支等武器（包括主要零部件）；能够发射弹药并造成人身严重伤害的装置或者可能被误认为是此类装置的物品，军用枪、民用枪、其他枪支及仿真枪支等；<br />
                        2、爆炸或者燃烧物质和装置；能够造成人身严重伤害或者危机航空器安全的爆炸或燃烧装置（物质）或者可能被误认为是此类装置的物品，弹药、爆破器材、烟火制品、上述物品的仿真品等；<br />
                        3、管制器具；能够造成人身伤害或对航空安全和运输秩序构成较大危害的管制器具，管制刀具、军警械具、其他属于国家规定的管制器具等；<br />
                        4、危险物品；能够造成人身伤害或对航空安全和运输秩序构成较大危害的危险物品，压缩气体、自燃物品、遇湿易燃物品、易燃液体、易燃固体、氧化剂和有机过氧化物、毒害品、腐蚀性物品、放射性物品等；<br />
                        5、其他物品；能够造成人身伤害或航空安全和运输秩序构成较大危害的物品，传染病病原体、火种、强磁化物等；<br />
                        6、国家法律、行政法规、规章规定的其他禁止运输的物品。<br />`,
                    },
                    {
                        enumName: "行李托运规定",
                        title: "可作为行李托运的物品",
                        content: `1、锐器:该类物品带有锋利边缘或锐利尖端，有金属或其他材料制成的、强度足以造成人身伤害的器械，日用刀具、专业用刀、用作武术文艺表演的刀、矛、剑、戟等；<br />
                        2、钝器:该类物品不带有锋利边缘或锐利尖端，由金属或其他材料制成、强度足以造成人身严重伤害的器械，棍棒、球棍、登山杖等；<br />
                        3、其他物品:能够造成人身伤害或者对航空安全和运输秩序构成较大危害的物品，工具及不在国家规定的管制范围内的电击器、催泪瓦斯等物品。<br />`,
                    },
                    {
                        enumName: "行李托运规定",
                        title: "随身携带或者作为托运行李有限定条件的物品",
                        content: `1、液态物品:随身携带液态物品应当盛放在单体容器容积不超过100ml的容器内，每种仅限带1件，且接受开瓶检查；<br />
                        2、婴儿在旅途中必需的液态乳制品、糖尿病或其他疾病的患者航空旅途中必需的液态药品，经安全检查确认后方可随身携带；<br />
                        3、旅客在机场控制区、航空器内购买或者取得的液态物品在离开机场控制区之前可随身携带；离开控制区再次安检时，需遵守液态物品携带规定。<br />`,
                    },
                    {
                        enumName: "行李托运规定",
                        title: "充电宝、锂电池 如何携带",
                        content: `禁止作为行李托运，随身携带时有限定条件：标识全面清晰，额定能量小于或等于100Wh;当额定能量大于100Wh、小于或等于160Wh时必须经航空公司批准且每人携带两块。<br />`,
                    },
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