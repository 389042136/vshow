<template>
    <div class="menu-box flex flex-column">
        <x-header :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback" class="x-header menu-header">
            <div slot="overwrite-title">
                <tab
                    :line-width= 0.04
                    active-color="#000"
                    default-color="#999"
                    custom-bar-width="0.5rem"
                    bar-active-color="linear-gradient(to right,#3990f6, #4ab5f9)"
                    v-model="tabIndex">
                    <tab-item @on-item-click="tabHandler" v-for="(item,index) in tabDatas" :key="index">
                        {{item.name}}
                    </tab-item>
                </tab>
            </div>
		</x-header>
        <!-- 国内航班 -->
        <div class="menu-main" v-if="tabIndex==0">
            <div class="menu-list-item">
                <!-- 热门城市 -->
                <h3>热门城市</h3>
                <ul class="menu-list-box flex flex-wrap">
                    <li v-for="(item, index) in menudatasD.HotDomesticAirport" :key="index" :class="childIndexActive == index&& parentIndexActive == -1?'menu-data-active':''"  @click="toSelectAirport(item,index,-1)">
                       {{item.arpt_brief_c}}
                    </li>
                </ul>
            </div>
            <div class="menu-list-item" v-for="(item, index) in menudatasD.DomesticAirport" :key="index">
                <!-- 城市列表 -->
                <h3>{{item.letter}}</h3>
                <ul class="menu-list-box flex flex-wrap">
                    <li v-for="(child, childIndex) in item.list" :key="childIndex" :class="childIndexActive == childIndex&& parentIndexActive == index?'menu-data-active':''"  @click="toSelectAirport(child,childIndex,index)">
                       {{child.arpt_brief_c}}
                    </li>
                </ul>
            </div>
        </div>
        <!-- 国际、地区航班 -->
        <div class="menu-main" v-if="tabIndex==1">
            <div class="menu-list-item" v-if="menudatasI.HotInternationalAirport&&menudatasI.HotInternationalAirport.length">
                <!-- 热门城市 -->
                <h3>热门城市</h3>
                <ul class="menu-list-box flex flex-wrap">
                    <li v-for="(item, index) in menudatasI.HotInternationalAirport" :key="index" :class="childIndexActive == index&& parentIndexActive == -1?'menu-data-active':''"  @click="toSelectAirport(item,index,-1)">
                       {{item.arpt_brief_c}}
                    </li>
                </ul>
            </div>
            <div class="menu-list-item" v-for="(item, index) in menudatasI.InternationalAirport" :key="index">
                <!-- 城市列表 -->
                <h3>{{item.letter}}</h3>
                <ul class="menu-list-box flex flex-wrap">
                    <li v-for="(child, childIndex) in item.list" :key="childIndex" :class="childIndexActive == childIndex&& parentIndexActive == index?'menu-data-active':''"  @click="toSelectAirport(child,childIndex,index)">
                       {{child.arpt_brief_c}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
	
</template>

<script>
    import { Tab, TabItem } from '../../components/vux/tab/index';
    import { flights } from '../../service/api';
	export default {
		components: {
            Tab,
            TabItem,
        },
		data() {
			return {
                childIndexActive: null,   //选中机场时进行样式标记
                parentIndexActive: null,
                data: null,   //获取选中的机场信息
                tabIndex: 0,      
                tabDatas: [
                    {name: '国内航班', nameE: 'Domestic'},
                    {name: '国际/港澳台', nameE: 'International'},
                ],
                menudatasD: {},
                menudatasI: {},
			}
        },
        methods: {
            callback(){
                this.$router.push({name:'flights'});
			},
            // 点击标题tab切换
            tabHandler(val){
                if(val == 1){
                    this.getAirportListI();
                }
            },
            // 国内机场数据
            getAirportListD(){
                flights.getDomesticAirport().then(res=>{
                    this.menudatasD = {};
                    if(res.status == 0 && res.data){
                        this.menudatasD.HotDomesticAirport = res.data.HotDomesticAirport;
                        let dAirportList = [];
                        let str = null;
                        if(res.data.DomesticAirport && res.data.DomesticAirport.length){
                            res.data.DomesticAirport.forEach((item,index)=>{
                                if(str != item.letter){
                                    str = item.letter;
                                    let itemTem = {};
                                    itemTem.letter = item.letter;
                                    itemTem.list = [];
                                    res.data.DomesticAirport.forEach(secondItem => {
                                        if(secondItem.letter == itemTem.letter) {
                                            itemTem.list.push(secondItem);
                                        }
                                    })
                                    dAirportList.push(itemTem)
                                } 
                            })
                        }
                        this.menudatasD.DomesticAirport = dAirportList;
                    }
                })
            },
            // 国际机场数据
            getAirportListI(){
                flights.getInternationalAirport().then(res=>{
                    this.menudatasI = {};
                    if(res.status == 0 && res.data){
                        this.menudatasI.HotInternationalAirport = res.data.HotInternationalAirport;
                        let dAirportList = [];
                        let str = null;
                        if(res.data.InternationalAirport && res.data.InternationalAirport.length){
                            res.data.InternationalAirport.forEach((item,index)=>{
                                if(str != item.letter){
                                    str = item.letter;
                                    let itemTem = {};
                                    itemTem.letter = item.letter;
                                    itemTem.list = [];
                                    res.data.InternationalAirport.forEach(secondItem => {
                                        if(secondItem.letter == itemTem.letter) {
                                            itemTem.list.push(secondItem);
                                        }
                                    })
                                    dAirportList.push(itemTem)
                                } 
                            })
                        }
                        this.menudatasI.InternationalAirport = dAirportList;
                    }
                })
            },
            toSelectAirport(data,childIndex,parentIndex){
                this.childIndexActive = childIndex;
                this.parentIndexActive = parentIndex;
                // this.data = data;
                let tempData = null;
                tempData = JSON.parse(localStorage.getItem('flightsData'));
                tempData.flightPlace = data.arpt_brief_c;
                tempData.flightIata = data.arpt_iata;
                localStorage.setItem('flightsData',JSON.stringify(tempData));
                setTimeout(()=>{
                    this.$router.push({name:'flights'});
                },150)
            },
            
            
        },
		created(){
            this.getAirportListD();
            this.getAirportListI();
        },
        mounted(){
            
        },
        watch:{

        }
		

		
	}
</script>

<style lang='less'>
@import '../../style/definition.less';
.menu-box {
    width: 100%;
    height: 1.04rem;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    .menu-header {
        .vux-header-title-area {
            margin: 0 1.4rem!important;
        }
    }
    .vux-tab {
        height: 0.6rem;
        padding-top: 0.14rem!important;
        .vux-tab-item {
            line-height: 0.6rem;
        }
    }

}
.menu-main {
    margin-top:1rem;
    padding: 0 0.32rem 0.2rem;
    box-sizing: border-box;
    .menu-list-item {
        >h3 {
            font-size: 0.24rem;
            font-weight: normal;
            color: @gray-color;
            height: 0.64rem;
            line-height: 0.64rem;
            margin-top: -0.16rem;
        }
        >ul {
            li {
                padding: 0 0.2rem;
                font-size: 0.28rem;
                text-align: center;
                height: 0.65rem;
                line-height: 0.65rem;
                color: @dark-color;
                background-color: #fff;
                border-radius: 0.12rem;
                margin: 0 0.16rem 0.16rem 0;
                &.menu-data-active {
                    background-color: @theme-color;
                    color: #fff;
                }
            }
        }
        &:first-child {
            >h3 {
                margin-top: 0;
            }
        }
    }
}

</style>