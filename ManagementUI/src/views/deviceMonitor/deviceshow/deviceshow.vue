<!--设备列表-->
<template>
	<div class="deviceList deviceShow">
		<!-- 设备树 -->
		<div class="device-tree border">
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

		<!-- 表单 -->
		<div class="deviceList-right border">
			<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
				<el-row type="flex" justify="space-between" class="form-query">
					<el-col>
						<el-form-item label="设备：" prop="dvcName" class="dvcName">
							<el-input v-model.trim="formData.dvcName" placeholder="请输入设备名称或编号" @keydown.enter.native="getDeviceList()" clearable></el-input>
						</el-form-item>
						<el-form-item label="IP地址：" prop="ip">
							<el-input v-model.trim="formData.ip" placeholder="请输入IP地址" @keydown.enter.native="getDeviceList()" clearable></el-input>
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
			<el-row type="flex" justify="end" align="middle" class="pagination">
				<p>共查询到<span class="pagination-text">{{ page.totalNum }}</span>条记录 </p>
				<p>共<span class="pagination-text">{{ page.totalPageNum }}</span>页</p>
				<el-pagination background 
					@size-change="sizeChange"
					@current-change="currentChange"
					:current-page="page.current" 
					:page-sizes="page.pageSizeArr" 
					:page-size="page.pageSize" 
					layout="prev, pager, next, jumper, sizes" 
					:total="page.totalNum">
				</el-pagination>
			</el-row>

			<!-- 远程监控 -->
			<div class="device-show-con">
				<div class="device-child border" v-for="item in tableData" :key="item.dvcId">
					<div class="tittle">
						<el-row type="flex" justify="space-between">
							<el-col :span="12">
								设备名称: {{ item.dvcName }}
							</el-col>
							<el-col :span="12">
								设备IP: {{ item.dvcIp }}
							</el-col>
						</el-row>
						<el-row type="flex" justify="space-between">
							<el-col :span="12">
								设备编号: {{ item.dvcNo }}
							</el-col>
							<el-col :span="12">
								<a target="_blank" class="el-c-blue" :href="'http://' + item.dvcIp + ':9000/'">远程桌面</a>
							</el-col>
						</el-row>
					</div>
					<iframe :src="'http://' + item.dvcIp + ':9000/'"></iframe>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { device, testApi } from "@/service/api";
	import TreeRender from '@/components/treeRender';
	export default {
		components: {
			TreeRender,
		},
		data() {
			return {
				//设备分组
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

				//查询表单
				formData: {},

				//分页
				page: {
					totalNum: 0,
					pageSize: 5,
					current: 1,
					pageSizeArr: [5, 10, 15],
					totalPageNum: 0,
				},
				tableData: [],
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
					},
					currentPage: this.page.current,
					pageSize: this.page.pageSize
				};
				let res = await device.getDeviceList(params);
				if(!res) return;

				this.tableData = res.data.returnDatas;
				this.page.totalNum = res.data.totalNum;
				this.page.totalPageNum = res.data.totalPageNum;
			},

			/**
			 * 修改每页显示条数
			 */
			sizeChange(val) {
				this.page.pageSize = val;
				this.getDeviceList();
			},

			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.page.current = val;
				this.getDeviceList();
			},
		},
		created() {
			this.getDeviceGroup();
		}
	}
</script>
<style lang="less">
	.deviceShow {
		.deviceList-right {
			min-width: 1110px;
		}

		/** 监控显示 **/
		.device-show-con {
			height: calc(100% - 125px);
			overflow: auto;
		}

		.device-child {
			width: 30%;
			float: left;
			box-sizing: border-box;
			margin-left: 2.6%;
			margin-bottom: 20px;
			overflow: hidden;

			.tittle {
				padding: 5px 10px;
				.el-col {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			iframe {
				width: 100%;
				height: 500px;
				border: none;
				display: block;
			}
		}
	}
	
</style>