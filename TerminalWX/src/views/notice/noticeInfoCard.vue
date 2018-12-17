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
                title: "证件相关问题",
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
                        enumName: "证件相关问题",
                        title: "有效乘机证件",
                        content: `1、有效身份证件：（临时）居民身份证、护照、军官证、文职干部证、义务兵证、士官证、文职人员证、职工证、武警警官证、武警士兵证、海员证，港澳地区居民的港澳居民来往内地通行证，台湾地区居民的台湾居民来往大陆通行证；外籍旅客的护照、外交部签发的驻华外交人员证、外国人永久居留证；民航局规定的其他有效乘机身份证件。<br />
                        2、十六周岁以下的中国大陆地区居民的有效乘机身份证件，还包括户口簿、学生证或户口所在地公安机关出具的身份证明、出生医学证明（仅限0-2岁的婴儿使用）。<br />`,
                    },
                    {
                        enumName: "证件相关问题",
                        title: "临时证件办理须知",
                        content: `申办人满足下列条件的，通过审查核实，为其签发《临时身份证明》（申办人需提供两张本人近期1寸证件照片）：<br />
                        1、申办人提供户口本或驾驶证、社保卡、暂住证、工作证、介绍信或过期的身份证、护照、《临时身份证明》等身份证明材料（原件或复印件）；<br />
                        2、无法提供上述身份证明材料的，申办人应提供本人姓名、身份证号、户籍所在地、家庭住址、同户籍亲属人员情况等相关信息；<br />
                        3、现役军人申办的，应提供所在单位保卫部门或政治部门出具的介绍信原件。<br />
                        办理地点：国内出发二楼警务办证室 <br />办理电话：0951-6912321`,
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