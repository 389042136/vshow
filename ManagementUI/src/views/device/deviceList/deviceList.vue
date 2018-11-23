<!--设备列表-->
<template>
	<div class="deviceList">
		<!-- 设备树 -->
		<div class="device-tree border">
			<el-tree ref="deviceTree" highlight-current 
				node-key="id"
				:data="deviceGroup.data"
				:expand-on-click-node="false" 
				:render-content="renderContent" 
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
						<el-button class="query-btn" type="primary" @click="showInfo(1)">
							<i class="fa fa-plus"></i> 新增
						</el-button>
						<el-button class="query-btn" type="danger" v-if="checkedVal.length > 0" @click="getDeleteId()">
							<i class="fa fa-trash"></i> 批量删除
						</el-button>
					</el-col>
				</el-row>
			</el-form>
			<TablePagination :tableData="tableData" :tableCol="tableCol" @currentChange="currentChange" @selectionChange="selectionChange">
				<!-- 操作 -->
				<template slot-scope="props" slot="operation">
					<el-button @click="showInfo(3, props.obj.row)">详情</el-button>
					<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
					<el-button @click="getDeleteId(props.obj.row)" type="danger">删除</el-button>
				</template>

				<!-- 设备名称 -->
				<template slot-scope="props" slot="dvcNo">
					{{ props.obj.row.dvcName }} ({{ props.obj.row.dvcNo }})
				</template>

				<!-- 组合屏 -->
				<template slot-scope="props" slot="groupFlag">
					<span class="el-c-success" v-if="props.obj.row.groupFlag == '1'">是</span>
					<span v-else>否</span>
				</template>

				<!-- 组内序号 -->
				<template slot-scope="props" slot="groupIndex">
					{{ props.obj.row.groupFlag == '1' ? props.obj.row.groupIndex : '' }}
				</template>
			</TablePagination>
		</div>
		<AddEditGroup :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEditGroup>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { device } from "@/service/api";
	import { showPrompt } from "@/utils/utils";
	import TablePagination from "@/components/tablePagination";
	import TreeRender from '@/components/treeRender';
	import AddEditGroup from "./addEditGroup";
	export default {
		components: {
			TreeRender,
			AddEditGroup,
			TablePagination
		},
		data() {
			return {
				...mapMutations([
					'PUSH_BREAD',
				]),

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
				},
				editData: {},
				editPanleShow: false,

				//查询表单
				formData: {},

				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
					hasSelect: true,
					operationWidth: 200,//操作宽度
					column: [
						{
							prop: 'dvcNo',
							label: '设备名称(编号)',
							minWidth: '125',
							slotScope: true,
						},
						{
							prop: 'zoneName',
							label: '区域',
							minWidth: '90',
						},
						{
							prop: 'groupName',
							label: '分组',
							minWidth: '100',
						},
						{
							prop: 'dvcIp',
							label: 'IP地址',
							width: '125',
							align: 'center',
						},
						{
							prop: 'dvcMac',
							label: 'MAC地址',
							width: '155',
						},
						{
							prop: 'groupFlag',
							label: '组合屏',
							width: '80',
							align: 'center',
							slotScope: true,
						},
						{
							prop: 'groupIndex',
							label: '组内序号',
							width: '90',
							align: 'center',
							slotScope: true,
						}
					]
				},

				//当前页码
				currentPage: 1,

				//多选
				checkedVal: []
			}
		},
		methods: {
			/**
			 * 获取设备分组
			 */
			async getDeviceGroup() {
				let res = await device.getGroup();
				if(res && res.data.length > 0) {
					this.deviceGroup.data[0].children = res.data;
					this.deviceGroup.zoneId = res.data[0].id;
					this.initFirstZone();
				}
			},

			/**
			 * 默认第一个区域
			 */
			initFirstZone() {
				this.getDeviceList();
				this.$nextTick(() => this.$refs.deviceTree.setCurrentKey(this.deviceGroup.zoneId));	//选中节点
			},

			/**
			 * 自定义树结构
			 */
			renderContent(h, {node, data, store}) {
				let _this = this;
				return h(TreeRender, {
					props: {
						node,
						data
					},
					on: {
						//新增、编辑
						AddEdit: ((n, d, type) => _this.addEditEvent(n, d, type)),
						//删除节点
						Delete: ((n, d) => _this.removeEvent(n, d)),
					}
				});
			},

			/**
			 * 树形控件添加节点
			 */
			addEditEvent(node, data, type) {
				this.editData = {type, node};
				this.editPanleShow = true;
			},

			/**
			 * 树形控件删除节点
			 */
			removeEvent(node, data) {
				let parent = node.parent;
				let children = parent.data.children || parent.data;
				let index = children.findIndex(d => d.id === data.id);
				showPrompt( async () => {
					let res = await device.deleteGroup([data.id]);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除设备分组成功');
						children.splice(index, 1);
					}else {
						this.$message.error('删除设备分组失败');
					}
				}, '删除');
			},

			/**
			 * 关闭修改框
			 */
			async panleClose(data) {
				this.editPanleShow = false;
				if(!data) return;
				
				if(typeof data == 'number') {
					//新增
					await this.getDeviceGroup();				//刷新tree
					this.deviceGroup.expandedArr.push(data);	//展开节点
					this.$refs.deviceTree.setCurrentKey(data);	//选中节点
				}else {
					//修改
					let currentNode = this.$refs.deviceTree.getNode(data.groupId).data;
					currentNode.name = data.groupName;
					currentNode.describe = data.groupDesc;
				}
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
					currentPage: this.currentPage,
				};
				let res = await device.getDeviceList(params);
				if(!res) return;
				this.tableData = res.data;
			},

			/**
			 * type: 1: 新增  2: 编辑  3: 详情
			 */
			showInfo(type, data = {}) {
				this.$router.push({
					path: '/device/addEditDevice',
					query: {
						type,
						id: data.dvcId
					}
				});

				//修改面包屑
				this.PUSH_BREAD(type == 1 ? '新增' : (type == 2 ? '编辑' : '详情'));
			},

			/**
			 * 获取删除对象的id
			 */
			getDeleteId(data) {
				let idArr = this.checkedVal.map((val) => val.dvcId);
				let params = data ? [data.dvcId] : idArr;
				showPrompt( async () => {
					let res = await device.deleteDevice(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除设备成功');
						this.getDeviceList();
					}else {
						this.$message.error('删除设备失败');
					}
				}, '删除');
			},

			/**
			 * 显示批量删除按钮
			 */
			selectionChange(val){
				this.checkedVal = val;
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
	.device-tree {
		min-width: 220px;
	}
	.deviceList-right {
		min-width: 840px;
	}
</style>