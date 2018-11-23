<!--设备监控-->
<template>
	<div class="deviceList mapMonitor">
		<div class="device-top">
			<!-- 设备树 -->
			<div class="device-tree border">
				<!-- <el-row type="flex" justify="space-around" class="operation">
					<el-button type="primary" icon="el-icon-refresh">重启</el-button>
					<el-button type="primary" icon="fa fa-power-off">关机</el-button>
					<el-button type="primary" icon="el-icon-plus">亮度</el-button>
					<el-button type="primary" icon="el-icon-minus">亮度</el-button>
				</el-row> -->
				<el-tree ref="deviceTree"
					node-key="id" 
					highlight-current 
					:data="deviceGroup.data" 
					:props="deviceGroup.defaultProps"
					:expand-on-click-node="false"
					:default-expanded-keys="deviceGroup.expandedArr" 
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
							<el-form-item label="连接状态：" prop="status" class="groupFlag">
								<el-select v-model="formData.status" placeholder="请选择" clearable> 
									<el-option label="未连接" value="0"></el-option>
									<el-option label="已连接" value="1"></el-option>
									<el-option label="已离线" value="2"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="组合屏：" prop="groupFlag" class="groupFlag">
								<el-select v-model="formData.groupFlag" placeholder="请选择" clearable> 
									<el-option label="是" value="1"></el-option>
									<el-option label="否" value="0"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="2" class="button-group flex-j-right">
							<el-button class="query-btn" type="primary" @click="getDeviceList()">
								<i class="fa fa-search"></i> 查询
							</el-button>
						</el-col>
					</el-row>
				</el-form>

				<div class="deviceList-right-map">
					<div class="map-status-con" v-if="mapUrl">
						<DeviceMap :mapData="deviceArr" :mapUrl="mapUrl" :devControl="control" :type="0"></DeviceMap>

						<!-- 提示 -->
						<div class="map-status">
							<div><i class="fa fa-map-marker normal"></i>已连接</div>
							<div><i class="fa fa-map-marker break"></i>已离线</div>
							<div><i class="fa fa-map-marker unNormal"></i>未连接</div>
						</div>
					</div>
					<div class="el-tree__empty-text" v-else>暂无地图</div>
				</div>
			</div>
		</div>
		
		<div class="device-bottom">
			<DeviceList :tableData="deviceArr"></DeviceList>
		</div>
	</div>
</template>

<script>
	import { device, deviceMonitor } from "@/service/api";
	import { showPrompt } from "@/utils/utils";
	import TreeRender from '@/components/treeRender';
	import DeviceMap from "@/components/deviceMap";
	import DeviceList from './deviceList';
	export default {
		components: {
			TreeRender,
			DeviceMap,
			DeviceList
		},
		data() {
			return {
				//查询表单
				formData: {},

				/**
				 * 设备分组
				 */
				deviceGroup: {
					data: [{
						id: 0,
						name: '全部',
						children: []
					}],
					expandedArr: [0],
					groupId: '',
					zoneId: '',
					defaultProps: {
						label: 'name'
					}
				},

				mapUrl: '',

				//设备数据
				deviceArr: [],

				checkedVal: [],
			}
		},
		methods: {
			/**
			 * 获取设备分组
			 */
			async getDeviceGroup() {
				let res = await device.getGroup();
				if(!res) return;
				this.deviceGroup.data[0].children = res.data;
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
			 * 获取区域地图
			 */
			async getZoneMap() {
				//选择全部
				if(this.deviceGroup.zoneId == 0) {
					this.mapUrl = '';
					return;
				}

				let params = {
					zoneId: this.deviceGroup.zoneId,
				};
				let res = await device.getZoneMap(params);
				if(!res) return;
				this.mapUrl = res.data.map ? res.data.map.mapUrl : '';
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
						status : this.formData.status || null,
					},
					currentPage: 1,
					pageSize: 1000,
				};
				let res = await deviceMonitor.getDevice(params);
				if(!res) return;
				this.deviceArr = res.data.returnDatas;
			},
			
			/**
			 * 远程操作
			 * type: 1 重启， 2 关机， 3 亮度
			 */
			control(type, ip, data) {
				let ipArr = ip ? [ip] : this.checkedVal;
				if(ipArr.length < 1) {
					this.$message.warning('请选择设备');
					return;
				};
				
				if(type == 0) {
					window.open('http://' + ip + ':9000/');
					return;
				}
				
				showPrompt( async () => {
					let res;
					switch(type) {
						case 1:
							res = await deviceMonitor.restart(ipArr);
							break;
						case 2:
							res = await deviceMonitor.colse(ipArr);
							break;
						case 3:
							res = await deviceMonitor.open(ipArr);
							break;
						case 4:
							res = await deviceMonitor.setLight({
								list: ipArr,
								value: data
							});
							break;	
					}
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('操作成功');
					}else {
						this.$message.error('操作失败');
					}
				});
			},
		},
		created() {
			this.getDeviceGroup();
		}
	}
</script>
<style lang="less">
	.mapMonitor.deviceList {
		display: block;
		padding: 0;

		.deviceList-right {
			min-width: 940px;
		}

		.device-top {
			display: flex;
			box-sizing: border-box;
			padding: 30px 30px 10px;
			height: 60%;
		}

		.device-bottom {
			height: 40%;
		}
	}
</style>