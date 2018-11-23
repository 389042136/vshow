<!--角色管理-->
<template>
	<div>
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
					<el-form-item label="角色名称：" prop="roleName">
						<el-input v-model.trim="formData.roleName" placeholder="请输入角色名称" maxlength="50" @keydown.enter.native="getTableData()" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
					<el-button class="query-btn" type="primary" @click="showInfo(1)">
						<i class="fa fa-plus"></i> 新增角色
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
				<el-button @click="authorization(props.obj.row)">授权</el-button>
				<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
				<el-button @click="getDeleteId(props.obj.row)" v-if="props.obj.row.accountNum < 1" type="danger">删除</el-button>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
		<Authorization :dialogData="authData" :dialogShow="dialogShow" @dialogClose="dialogClose"></Authorization>
	</div>
</template>

<script>
	import { authManagement } from "@/service/api";
	import { showPrompt } from "@/utils/utils";
	import TablePagination from "@/components/tablePagination";
	import AddEdit from "./addEdit";
	import Authorization from "./authorization";
	export default {
		components: {
			AddEdit,
			Authorization,
			TablePagination
		},
		data() {
			return {
				//查询表单
				formData: {},

				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
					operationWidth: 200,//操作宽度
					column: [
						{
							prop: 'roleName',
							label: '角色名称',
							minWidth: '100',
						},
						{
							prop: 'describe',
							label: '描述',
							minWidth: '200',
						},
						{
							prop: 'createDate',
							label: '创建时间',
							width: '170',
							align: 'center',
						},
						{
							prop: 'accountNum',
							label: '账号个数',
							width: '90',
							align: 'center',
						}
					]
				},

				//当前页码
				currentPage: 1,

				//多选
				checkedVal: [],

				//编辑
				editData: {},
				editPanleShow: false,

				//授权
				authData: {},
				dialogShow: false,
			}
		},
		methods: {
			/**
			 * 查询
			 */
			async getTableData() {
				let params = {
					queryData: {
						roleName: this.formData.roleName,
					},
					currentPage: this.currentPage,
				};
				let res = await authManagement.getRole(params);
				if(!res) return;
				this.tableData = res.data;
			},

			/**
			 * type: 1: 新增  2: 编辑  3: 详情
			 */
			showInfo(type, data) {
				this.editData = {type, data};
				this.editPanleShow = true;
			},

			/**
			 * 删除
			 */
			getDeleteId(data) {
				let idArr = this.checkedVal.map((val) => val.id);
				let params = data ? [data.id] : idArr;
				showPrompt( async () => {
					let res = await authManagement.deleteRole(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除角色成功');
						this.getTableData();
					}else {
						this.$message.error('删除角色失败');
					}
				}, '删除');
			},

			/**
			 * 授权弹框
			 */
			authorization(data) {
				this.authData = data;
				this.dialogShow = true;
			},

			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.currentPage = val;
				this.getTableData();
			},

			/**
			 * 新增、编辑弹框关闭
			 */
			panleClose(flag) {
				this.editPanleShow = false;
				if(flag) this.getTableData();
			},

			/**
			 * 授权弹框关闭
			 */
			dialogClose(flag) {
				this.dialogShow = false;
				if(flag) {
					this.getTableData();
					this.$transfer.$emit('updataMenu'); //更新菜单
				}
			},

			/**
			 * 显示批量删除按钮
			 */
			selectionChange(val) {
				this.checkedVal = val;
			},
		},
		created() {
			this.getTableData();
		}
	}
</script>
<style lang="less" scoped>
	.el-input {
		width: 200px;
	}
</style>