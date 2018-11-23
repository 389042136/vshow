<!--账号管理-->
<template>
	<div id="account">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
                    <el-form-item label="状态：" prop="status">
                        <el-select v-model="formData.status" placeholder="请选择" clearable> 
                            <el-option label="禁用" :value="0"></el-option>
                            <el-option label="启用" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色名称：" prop="roleName">
						<el-input v-model.trim="formData.roleName" placeholder="请输入角色名称" @keydown.enter.native="getTableData()" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
					<el-button class="query-btn" type="primary" @click="showInfo(1)">
						<i class="fa fa-plus"></i> 新增账号
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
				<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
				<el-button @click="resetPass(props.obj.row)" type="primary" plain>重置密码</el-button>
				<el-button @click="onOrOff(props.obj.row)" :type="props.obj.row.status ? 'warning' : 'success'" plain>
					{{ !props.obj.row.status ? '启用' : '禁用' }}
				</el-button>
				<el-button type="danger" @click="getDeleteId(props.obj.row)" v-if="!props.obj.row.lastLoginTime">删除</el-button>
			</template>

			<!-- 状态 -->
			<template slot-scope="props" slot="status">
				<span v-if="props.obj.row.status">启用</span>
				<span v-else class='el-c-danger'>禁用</span>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
		<ResetPass :dialogData="restData" :dialogShow="dialogShow"  @dialogClose="dialogClose"></ResetPass>
	</div>
</template>

<script>
	import { authManagement } from "@/service/api";
	import { showPrompt } from "@/utils/utils";
	import TablePagination from "@/components/tablePagination";
	import AddEdit from "./addEdit";
	import ResetPass from "./resetPass";
	export default {
		components: {
            AddEdit,
			ResetPass,
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
					operationWidth: 290,//操作宽度
					column: [
						{
							prop: 'account',
							label: '账号',
							minWidth: '100',
						},
						{
							prop: 'roleName',
							label: '角色名称',
							minWidth: '100',
						},
						{
							prop: 'name',
							label: '姓名',
							minWidth: '100',
						},
						{
							prop: 'mobile',
							label: '手机',
							width: '125',
							align: 'center',
						},
						{
							prop: 'email',
							label: 'Email',
							minWidth: '120',
						},
						{
							prop: 'lastLoginTime',
							label: '最后登录时间',
							width: '160',
							align: 'center',
						},
						{
							prop: 'status',
							label: '状态',
							width: '60',
							align: 'center',
							slotScope: true,
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
                
                //重置密码
                restData: {},
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
						status: this.formData.status,
						roleName: this.formData.roleName,
					},
					currentPage: this.currentPage,
				};
				let res = await authManagement.getAccount(params);
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
					let res = await authManagement.deleteAccount(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除账号成功');
						this.getTableData();
					}else {
						this.$message.error('删除账号失败');
					}
				}, '删除');
			},

            /**
             * 启用、禁用
             */
         	onOrOff(data){
				showPrompt( async () => {
					let status, tittle;
					if(data.status) {
						status = 0;
						tittle = '禁用';
					}else {
						status = 1;
						tittle = '启用';
					}

					let params = {
						id: data.id,
						status
					};
					let res = await authManagement.updateAccount(params);
					if(!res) return;
					
					if(res.status == this.$successCode) {
						this.$message.success('账号' + tittle + '成功');
						data.status = status;
					}else {
						this.$message.error('账号' + tittle + '失败');
					}
				});
			},

            /**
             * 重置密码弹框
             */
            resetPass(data){
                this.restData = data;
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
			 * 重置密码弹框关闭
			 */
			dialogClose(flag) {
				this.dialogShow = false;
				if(flag) this.getTableData();
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
<style lang="less">
	
</style>