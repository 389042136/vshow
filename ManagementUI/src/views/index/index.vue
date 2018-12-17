<template>
	<el-container id="c-index">
		<!-- Aside -->
		<Aside class="c-el-aside"></Aside>
		<el-container direction="vertical">
			<!-- Header -->
			<Header></Header>
			<el-main class="c-main-con">
				<router-view class="c-router-view"></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import Header from "./header/header";
	import Aside from "./menuAside/menuAside";
	export default {
		components: { 
			Header,
			Aside,
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang='less'>
	@headerH: 53px;
	#c-index {
		height: 100%;
		.c-main-con {
			padding: 0;
			height: calc(100% - @headerH);
		}
	}
</style>