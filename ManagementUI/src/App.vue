<template>
	<div id="app">
		<router-view/>
		<!-- 预览图片 -->
		<lg-preview></lg-preview>
	</div>
</template>

<script>
	export default {
		name: 'App'
	}
</script>

<style>
	#app {
		height: 100%;
	}
</style>