<!--设备列表-->
<template>
	<div class="deviceList position">
		<!-- 设备树 -->
		<div class="device-tree border">
			<el-tree ref="deviceTree"
				node-key="id" 
				highlight-current 
				:data="deviceGroup.data" 
				:props="deviceGroup.defaultProps"
				:expand-on-click-node="false"
				@node-click="clickNode">
			</el-tree>
		</div>

		<!-- 地图 -->
		<div class="deviceList-right border">
			<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
				<el-row type="flex" justify="space-between" class="form-query">
					<el-col>
						<el-form-item label="设备：" prop="dvcName" class="dvcName">
							<el-input v-model.trim="formData.dvcName" placeholder="请输入设备名称或编号" maxlength="50" @keydown.enter.native="getDeviceList()" clearable></el-input>
						</el-form-item>
						<el-form-item label="IP地址：" prop="ip">
							<el-input v-model.trim="formData.ip" placeholder="请输入IP地址" maxlength="30" @keydown.enter.native="getDeviceList()" clearable></el-input>
						</el-form-item>
						<el-form-item label="组合屏：" prop="groupFlag" class="groupFlag">
							<el-select v-model="formData.groupFlag" placeholder="请选择" clearable> 
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4" class="button-group flex-j-right">
						<el-button class="query-btn" type="primary" @click="getDeviceList()">
							<i class="fa fa-search"></i> 查询
						</el-button>
					</el-col>
				</el-row>
			</el-form>

			<div class="deviceList-right-map">
				<DeviceMap :mapData="mapData" :mapUrl="mapUrl" :service="service" :type="1" v-if="mapUrl"></DeviceMap>
				<div class="el-tree__empty-text" v-else>暂无地图</div>
			</div>
		</div>
		<AddEdit :service="service" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { device } from "@/service/api";
	import DeviceMap from "@/components/deviceMap";
	import AddEdit from "./addEdit";
	export default {
		components: {
			DeviceMap,
			AddEdit,
		},
		data() {
			return {
				//查询表单
				formData: {},

				/**
				 * 设备分组
				 */
				deviceGroup: {
					data: [],
					groupId: '',
					zoneId: '',
					defaultProps: {
						label: 'name'
					}
				},

				mapUrl: '',

				/**
				 * 地图
				 */
				mapData: [],
				service: {
					//删除
					delete:	params => device.deleteDevice(params),

					//新增
					add: params => device.addDevice(params),

					//修改坐标、编辑
					updata: params => device.updateDevice(params),
				},
			}
		},
		methods: {
			/**
			 * 获取设备分组
			 */
			async getDeviceGroup() {
				let res = await device.getGroup();
				if(!res) return;
				this.deviceGroup.data = res.data;
				this.deviceGroup.zoneId = res.data[0].id;
				this.initFirstZone();
			},

			/**
			 * 默认第一个区域
			 */
			initFirstZone() {
				this.getZoneMap();
				this.getDeviceList();
				this.$nextTick(() => this.$refs.deviceTree.setCurrentKey(this.deviceGroup.zoneId));	//选中节点
			},

			/**
			 * 点击节点
			 */
			clickNode(data, node) {
				if(data.pId) {
					this.deviceGroup.groupId = data.id;
					this.deviceGroup.zoneId = data.zId;
				}else {
					this.deviceGroup.groupId = '';
					this.deviceGroup.zoneId = data.id;
				}
				this.getZoneMap();
				this.getDeviceList();
			},

			/**
			 * 获取区域地图
			 */
			async getZoneMap() {
				let params = {
					zoneId: this.deviceGroup.zoneId,
				};
				let res = await device.getZoneMap(params);
				if(!res) return;
				this.mapUrl = res.data.map ? res.data.map.mapUrl : '';
			}, 

			/**
			 * 获取设备列表
			 */
			async getDeviceList() {
				let params = {
					queryData: {
						dvcName : this.formData.dvcName,
						dvcIp : this.formData.ip,
						groupId : this.deviceGroup.groupId,
						zoneId: this.deviceGroup.zoneId || null,
						groupFlag : this.formData.groupFlag || null,
					},
					currentPage: 1,
					pageSize: 1000,
				};
				let res = await device.getDeviceList(params);
				if(!res) return;
				this.mapData = res.data.returnDatas;
			},

			/**
			 * 新增、编辑弹框关闭
			 */
			panleClose(flag) {
				if(flag) this.getDeviceList();
			},
		},
		created() {
			this.getDeviceGroup();
		}
	}
</script>
<style lang="less">
	
</style>