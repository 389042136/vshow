<!--默认显示首页内容-->
<template>
	<div id="home">
		首页
		<!-- <div class="home-row" v-for="(parent, index) in menuList" :key="index" v-if="index">
        <p class="index-heading">{{ parent.name }}</p>
        <ul class="index-menu">
            <li v-for="(child, index) in parent.children" :key="index">
              <span @click="linkTo(child.path)">{{ child.name }}</span>
            </li>
        </ul>
    </div> -->
	</div>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import { dateFormat } from "@/utils/utils"
	export default {
		data() {
			return {}
		},
		methods: {
			init() {
				
			}
		},
		created() {
			this.init();
		}
	}
</script>
<style lang="less">
	#home {
		padding-top: 40px;
		padding-left: 50px;
		.index-heading {
			color: #409EFF;
			padding-left: 10px;
			font-size: 16px;
		}
		.index-menu {
			margin: 5px 0 30px;
			li {
				width: 150px;
				display: inline-block;
				font-size: 14px;
				span {
					display: inline-block;
					line-height: 30px;
					padding: 0 10px;
					border-radius: 15px;
					color: #606266;
				}
				span:hover {
					background: #409EFF;
					color: #fff;
					cursor: pointer;
				}
			}
		}
	}
</style>