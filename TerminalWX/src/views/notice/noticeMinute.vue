<template>
	<div>
        <x-header class="x-header" :title="dataInfo.enumName" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
        <div class="notice-main notice-detail">
            <div class="notice-div" >
                <h4>{{dataInfo.title}}</h4>
                <div class="div-p ">
                    <p class="p2" v-html="dataInfo.content"></p>
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
                dataInfo: {},
			}
        },
        methods: {
            callback(){
                switch(this.dataInfo.enumName) {
                    case '登机注意事项':
                        this.$router.push({name: 'noticeInfoBoarding'}); 
                        break;
                    case '安检注意事项':
                        this.$router.push({name: 'noticeInfoCheckin'}); 
                        break;
                    case '随身物品规定':
                        this.$router.push({name: 'noticeInfoHand'}); 
                        break;
                    case '行李托运规定':
                        this.$router.push({name: 'noticeInfoLuggage'}); 
                        break;
                    case '证件相关问题':
                        this.$router.push({name: 'noticeInfoCard'}); 
                        break;
                } 
			},
		},
		created(){
            if(this.$route.params.enumName) {
                this.dataInfo = this.$route.params;
                localStorage.setItem('dataInfo',JSON.stringify(this.dataInfo))
            } else {
                this.dataInfo = JSON.parse(localStorage.getItem('dataInfo'));
            }
            
            
        },
        mounted(){
			
        },
	}
</script>

<style lang='less' scoped>
.notice-main {
	// height: 100%;
	width: 100%;
	padding: 1.2rem 0.48rem 0;
	box-sizing: border-box;
    .notice-div{
        //  height: 100%;
         box-sizing: border-box;
         margin-top: 0.2rem;
         border-radius: 0.24rem;
         padding-bottom: 0.24rem;
         h4{
            min-height: 0.4rem;
            font-size: 0.32rem;
            font-weight: normal;
            color: #41a1f7;
            margin: 0rem 0.2rem 0 0.2rem ;
         }
         .div-p{
             width: 100%;
             margin-top: 0.32rem;
             .p2{
                 width: 95%;
                 text-align: left;
                 font-size: 0.28rem;
                 font-weight: normal;
                 line-height: 0.5rem;
                 padding-left: 0.2rem;
                 padding-right: 0.2rem;
				 color:#292c33;
                 text-align:justify;
             }
         }
    }
}
</style>