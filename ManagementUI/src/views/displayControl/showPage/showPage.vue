<!--显示页面控制-->
<template>
	<div class="deviceList">
		<!-- 设备树 -->
		<div class="device-tree border">
			<el-tree ref="deviceTree"
				node-key="id" 
				highlight-current 
				:data="deviceGroup.data" 
				:props="deviceGroup.defaultProps"
				:default-expanded-keys="deviceGroup.expandedArr" 
				:expand-on-click-node="false"
				@node-click="clickNode">
			</el-tree>
		</div>

		<!-- 表单 -->
		<div class="deviceList-right border">
			<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
				<el-row type="flex" justify="space-between" class="form-query">
					<el-col>
						<el-form-item label="设备：" prop="dvcName" class="dvcName">
							<el-input v-model.trim="formData.dvcName" placeholder="请输入设备名称或编号" maxlength="30" @keydown.enter.native="getDeviceList()" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4" class="button-group flex-j-right">
						<el-button class="query-btn" type="primary" @click="getDeviceList()">
							<i class="fa fa-search"></i> 查询
						</el-button>
					</el-col>
				</el-row>
			</el-form>
			<TablePagination :tableData="tableData" :tableCol="tableCol" @currentChange="currentChange">
				<!-- 操作 -->
				<template slot-scope="props" slot="operation">
					<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
				</template>

				<!-- 设备名称 -->
				<template slot-scope="props" slot="dvcNo">
					{{ props.obj.row.dvcName }} ({{ props.obj.row.dvcNo }})
				</template>

				<!-- 自定义页面状态 -->
				<template slot-scope="props" slot="status">
					<span v-if="0 == props.obj.row.status">未开始</span>
					<span v-else-if="1 == props.obj.row.status" class="el-c-success">进行中</span>
					<span v-else-if="2 == props.obj.row.status" class="el-c-danger">已结束</span>
				</template>
			</TablePagination>
		</div>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { device, displayControlManagement } from "@/service/api";
	import TablePagination from "@/components/tablePagination";
	import AddEdit from "./addEdit";
	export default {
		components: {
			AddEdit,
			TablePagination
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
				editData: {},
				editPanleShow: false,

				//查询表单
				formData: {},

				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
					operationWidth: 70,//操作宽度
					column: [
						{
							prop: 'dvcNo',
							label: '设备名称(编号)',
							minWidth: '100',
							slotScope: true,
						},
						{
							prop: 'backgroundName',
							label: '背景资源',
							minWidth: '100',
							align: 'center',
						},
						{
							prop: 'customName',
							label: '自定义页面',
							minWidth: '100',
							align: 'center',
						},
						{
							prop: 'status',
							label: '自定义页面状态',
							width: '130',
							align: 'center',
							slotScope: true,
						}
					]
				},

				//当前页码
				currentPage: 1,
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
			 * type: 1: 新增  2: 编辑  3: 详情
			 */
			showInfo(type, data) {
				this.editData = {type, data};
				this.editPanleShow = true;
			},

			/**
			 * 新增、编辑弹框关闭
			 */
			panleClose(flag) {
				this.editPanleShow = false;
				if(flag) this.getDeviceList();
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
						groupId : this.deviceGroup.groupId,
						zoneId: this.deviceGroup.zoneId || null,
					},
					currentPage: this.currentPage,
				};
				let res = await displayControlManagement.getShowPageList(params);
				if(!res) return;
				this.tableData = res.data;
			},

			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.currentPage = val;
				this.getDeviceList();
			},
		},
		created() {
			this.getDeviceGroup();
		}
	}
</script>
<style lang="less" socped>
	
</style>