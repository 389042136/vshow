<template>
    <div id="mapContainer">
		<!-- 1. 地图底图 -->
		<img :src="mapSrc" alt="" />

		<!-- 2. 路线层 -->
		<div class="map-line-con">
			<div class="lineArrow" hidden></div>
		</div>

		<!-- 3. 设施位置 + 当前位置 -->
		<div class="airport-facilities">
			<div v-for="item in facilitiesData" 
				:key="item.lead_point_id" 
				class="action"
				:style="{
					left: fliter(item.lead_point_x, 'x'),
					top: fliter(item.lead_point_y, 'y')
				}">
			</div>
		</div>

		<!-- 4. 障碍物层 -->
		<div class="fence-con">
			<div class="fencePoint" hidden></div>
		</div>

		<div class="facilitie-dialog">
			<select id="sendSybol" v-model="facTypeId">
				<option v-for="(item, index) in facilitiesData" :value="item.leadPointCategoryId" :key="index">{{ item.leadPointCategoryName }}</option>
			</select>
			<input type="text" v-model="facName">
			<div class="btn save" @click="saveFac()">保存</div>
			<div class="btn cancel">取消</div>
			<div class="btn delete" @click="deleteFac()">删除</div>
		</div>
	</div>
</template>

<script>
	import $ from '../../../static/js/zepto.min.js';
	import v_touch from '@/utils/v_touch.js';
	import { Map_fun, map_config} from './map_main.js';
	import { facilities } from "@/service/api";
	export default {
		computed: {
			facilitiesData() {
				let arr = this.allFacilitiesData.filter(item => {
					return item.enum_id == this.facilitiesTypeId && item.map_id == this.mapArr[this.mapIndex].map_id;
				});
				return arr;
			},
			mapSrc() {
				let mapObj = this.mapArr[this.mapIndex];
				if(mapObj) return mapObj.map_url;
			}
		},
		props: ['mapIndex'],
		data() {
			return {
				mapArr: [],
				allFacilitiesData: [],
				facilitiesTypeId: '',

				facTypeId: '',
				facName: ''
			};
		},
		methods: {
			/**
			 * 获取设施数据
			 */
			getMapData() {
				facilities.getMap().then(data => {
					this.mapArr = data.data;
					this.$emit('getMapArr', data.data);
				});
				facilities.getDevices().then(data => {
					this.allFacilitiesData = data.data;
					this.initMap();
				});
				this.receiveType();
            },
			
			/**
			 * 初始化地图数据
			 * @param {*} nowPoint 		// 当前设备位置
			 * @param {*} facilities 	// 设施数据
			 */
			initMap() {
				//拖动缩放地图
				v_touch.init($('#mapContainer'));
				
				//初始化地图数据
				//Map_fun.init(mapContainer, {lead_point_x: 80, lead_point_y: 45}, this.facilitiesData);
			},

			/**
			 * 接收点击设施类型id
			 * obj：设施点对象，包括id，xy坐标
			 * 计算最佳路径，并返回目的地id
			 */
			receiveType() {
				this.$transfer.$on('navigationTo', id => this.facilitiesTypeId = id);
			},

			/**
			 * 保存设施
			 */
			async saveFac() {
				let param = {
					leadPointName: this.facName,
					leadPointType: this.facTypeId,
					leadPointX: Map_fun.leadPointX,
					leadPointY: Map_fun.leadPointY
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
				let res = await facilities.delete(Map_fun.facTypeId);
				if(res.status == this.$successCode) {
					this.getMapData();
					Map_fun.facObj.hide();
				}
			},

			fliter(a, b) {
				return Map_fun.tranPer(a, b == 'x' ? map_config.iCol : map_config.iRow);
			},
		},
		mounted() {
			this.getMapData();
		},
		destroyed() {
			this.$transfer.$off('navigationTo');
		},
	}
</script>

<style lang='less'>
	@import './mapNavigation.less';
</style>