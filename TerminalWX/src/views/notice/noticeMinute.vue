<template>
	<div>
        <x-header class="x-header" :title="param.enumName" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		
		</x-header>
        <div class="menu-box flex flex-column">
            <div class="notice-main notice-detail">
                <div class="notice-div" >
                    <h4>{{param.title}}：</h4>
                    <div class="div-p ">
                        <p class="p2">
                            {{param.one}}<br/> 
                            {{param.two}}<br/>
                            {{param.three}}<br/>
                            {{param.four}}<br/>
                            {{param.five}}
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
			}
        },
        methods: {
            callback(){
               this.$router.push({name: 'noticeInfo',params:this.param});
			},
		},
		created(){
           this.param = this.$route.query;
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
	padding: 1.2rem 0.48rem 0;
	box-sizing: border-box;
    .notice-div{
         height: 100%;
         box-sizing: border-box;
         margin-top: 0.2rem;
         border-radius: 0.24rem;
         padding-bottom: 0.24rem;
         h4{
            height: 0.4rem;
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