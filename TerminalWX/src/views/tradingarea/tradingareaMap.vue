<template>
	<div @click="typeHide = false" class="map-navigation">
        <x-header class="x-header" title="商家引导" :left-options="{backText:'',preventGoBack:true}" @on-click-back="callback">
		</x-header>
		<div class="index-main notice-main">
            <div id="mapContainer">
				<!-- 1. 地图底图 -->
				<img :src="business.businessMap" alt="" />

				<!-- 3. 设施位置 + 当前位置 -->
				<div class="airport-facilities">
					<div class="action destination"
						:style="{
							left: fliter(business.business_position_x, 'x'),
							top: fliter(business.business_position_y, 'y'),
						}">
						<img :src="business.business_logo">
					</div>
				</div>

				<!-- 4. 障碍物层 -->
				<div class="fence-con">
					<div class="fencePoint" hidden></div>
				</div>

				<div class="facilitie-dialog">
					<select id="sendSybol" v-model="facTypeId">
						<option v-for="(item, index) in tradingDataList" :value="item.business_type_id" :key="index">{{ item.business_type }}</option>
					</select>
					<input type="text" v-model="facName">
					<div class="btn save" @click="saveFac()">保存</div>
					<div class="btn cancel">取消</div>
					<div class="btn delete" @click="deleteFac()">删除</div>
				</div>
			</div>
			
			<!-- 放大、楼层 -->
            <div class="floor-zoom">
                <div class="zoom">
					<div @click="clickZoom(true)"><img src="../../assets/images/icon_map_zoom_in.png" alt=""></div>
				    <div @click="clickZoom()"><img src="../../assets/images/icon_map_zoom_out.png" alt=""></div>
					
                    <!-- <div @click="clickZoom(true)">
						<x-icon type="ios-plus-empty" size="30"></x-icon>
					</div>
                    <div @click="clickZoom()">
						<x-icon type="ios-minus-empty" size="30"></x-icon>
					</div> -->
                </div>
            </div>
		</div>
	</div>
</template>

<script>
	import v_touch from '@/utils/v_touch.js';
	import { facilities } from '../../service/api';
	import { Map_fun, map_config} from './map_main.js';
	export default {
		data() {
			return {
				business: {},
				tradingDataList: [],
				facTypeId: '',
				facName: ''
			};
		},
		methods: {
			init() {
				this.business = this.$route.params;

				// 初始化地图数据
				v_touch.init('#mapContainer');
			},

			/**
			 * 保存设施
			 */
			async saveFac() {
				let param = {
					leadPointName: this.facName,
					leadPointType: this.facTypeId,
					leadPointX: Map_fun.leadPointX,
					leadPointY: Map_fun.leadPointY,
					leadPointExtendOne: Map_fun.distance
				};
				let res = await facilities.add(param);
				if(res.status == this.$successCode) {
					this.getMapData();
					Map_fun.facObj.hide();
				}
			},

			/**
			 * 删除设施
			 */
			async deleteFac() {
				let res = await facilities.delete(Map_fun.business_id);
				if(res.status == this.$successCode) {
					this.getMapData();
					Map_fun.facObj.hide();
				}
			},

			fliter(a, b) {
				return Map_fun.tranPer(a, b == 'x' ? map_config.iCol : map_config.iRow);
			},

			callback(){
                this.$router.back(-1);
			},
			
			clickZoom(flag) {
                v_touch.clickZoom(flag);
            },
		},
		mounted() {
			this.init();
		},
	}
</script>

<style lang='less' scoped>
	@import '../../components/mapNavigation/mapNavigation.less';
	.action {
		position: relative;
		&.destination {
			background-image: url('../../assets/images/map/icon_des_location_bg.png');
		}
		img {
			position: absolute;
			left: 50%;
			top: 50%;
			-webkit-transform: translate(-50%, -30%);
			transform: translate(-50%, -75%);
			width: 0.58rem;
    		height: 0.58rem;
			border-radius: 50%;
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
		.zoom {
			margin-bottom: 0.2rem;
			text-align: center;
            height: 50%;
			border-radius: 0.12rem;
			background-color: #fff;
			padding: 0.1rem 0;
            > div {
                height: 0.7rem;
            }
            img {
                width: 1rem;
                transform: translateY(-0.1rem);
            }
		}
    }
</style>