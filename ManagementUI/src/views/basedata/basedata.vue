<!--基础数据管理-->
<template>
    <router-view/>
</template>

<script>
</script>
<style lang="less">
    @infoPanleWidth: 500px;
    .baseData {
		.multipleTable-con{
			height: calc(100% - 53px);
        }

		.infoPanle-mask {
			right: -(@infoPanleWidth + 100);
			.infoPanle {
				width: @infoPanleWidth;
			}
		}

		.mapUrl {
			cursor: pointer;
		}
	}
</style>