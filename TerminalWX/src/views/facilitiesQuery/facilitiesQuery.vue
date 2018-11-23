<template>
	<div @click="typeHide = false" class="map-navigation">
        <x-header class="x-header" title="设施引导" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main">
            <MapNavigation :mapIndex="mapIndex" @getMapArr="getMapArr"></MapNavigation>
            <FacBottom :typeHide="typeHide" @typeShow="typeShow"></FacBottom>

            <!-- 放大、楼层 -->
            <div class="floor-zoom">
                <div class="zoom">
                    <div @click="clickZoom(true)"><img src="../../assets/images/icon_map_zoom_in.png" alt=""></div>
				    <div @click="clickZoom()"><img src="../../assets/images/icon_map_zoom_out.png" alt=""></div>
                </div>
                <div>
                    <div v-for="(item, index) in mapArr"
                        :key="index"
                        class="floor" 
                        :class="{'active-floor': index == mapIndex}"
                        @click="clickFloor(index)">
                        {{ item.map_name }}
                    </div>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
    import MapNavigation from './mapNavigation.vue';
    import FacBottom from './facBottom.vue';
    import v_touch from '@/utils/v_touch.js';

    export default {
        components: {
            MapNavigation,
            FacBottom
        },
        data() {
            return {
                mapArr: [],
                mapIndex: 0,
                typeHide: false,
            }
        },
        methods: {
            callback(){
                this.$router.back(-1);
            },
            getMapArr(data) {
                this.mapArr = data;
            },
            typeShow() {
                this.typeHide = true;
            },
            clickZoom(flag) {
                v_touch.clickZoom(flag);
            },
            clickFloor(index) {
                this.mapIndex = index;
            },
        }
    }
</script>

<style lang="less" scoped>
    .map-navigation {
        width: 100%;
        height: 100%;  
    }
    .index-header {
        width: 100%;
        height: 1rem;
        padding: 0 0.32rem;
        font-size: 0.36rem;
        box-sizing: border-box;
        .icon-back {
            width: 0.44rem;
            height: 0.44rem;
            img {
                width: 100%;
            }
        }
    }
    .notice-main {
        height: calc(100% - 1rem);
        width: 100%;
        top: 1rem;
        position: fixed;
    }
    .floor-zoom {
        z-index: 4;
        position: absolute;
		right: 0.34rem;
		top: 0.27rem;
		left: auto;
		color: #333;
		> div {
			background: #fff;
			padding: 0.1rem 0.2rem;
			border-radius: 0.1rem;
		}
		.zoom {
			margin-bottom: 0.2rem;
			text-align: center;
            height: 50%;
			border-radius: 0.12rem;
            background-color: #fff;
            > div {
                height: 0.7rem;
            }
            img {
                margin: 0 auto;
                width: 1rem;
                transform: translateY(-0.1rem);
            }
		}
		.floor {
            font-size: 0.3rem;
			line-height: 0.5rem;
			&.active-floor {
				color: #3FA4FD;
			}
		}
    }
</style>

