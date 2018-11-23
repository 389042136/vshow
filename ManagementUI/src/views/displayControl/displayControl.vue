<!--显示设备控制管理-->
<template>
    <router-view class="displayControl"/>
</template>

<script>
</script>
<style lang="less">
    @infoPanleWidth: 500px;
    .displayControl {
		.infoPanle-mask {
			right: -(@infoPanleWidth + 100);
			.infoPanle {
				width: @infoPanleWidth;
			}
		}
	}
</style>