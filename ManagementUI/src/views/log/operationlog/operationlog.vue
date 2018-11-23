<!--操作日志-->
<template>
	<div class="operationlog">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
                    <el-form-item label="操作者账号：" prop="userName">
						<el-input v-model.trim="formData.userName" maxlength="30" placeholder="请输入账号" @keydown.enter.native="getTableData()" clearable></el-input>
					</el-form-item>
					<el-form-item label="类型：" prop="targetType" class="targetType">
                        <el-select v-model="formData.targetType" placeholder="请选择" clearable> 
                            <!-- <el-option label="查询" value="1"></el-option> -->
                            <el-option label="添加" value="2"></el-option>
							<el-option label="编辑" value="3"></el-option>
							<el-option label="删除" value="4"></el-option>
                            <el-option label="导入" value="5"></el-option>
							<el-option label="导出" value="6"></el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="模块：" prop="resId" class="modules">
                        <el-select v-model="formData.resId" placeholder="请选择" clearable> 
							 <el-option-group v-for="(items, index) in modules" :key="index" :label="items.label">
								<el-option v-for="(item, i) in items.children" :key="i" :label="item.label" :value="item.id"></el-option>
							</el-option-group>
                        </el-select>
                    </el-form-item>
					<el-form-item label="操作时间：" prop="startTime" class="input-time">
						<el-date-picker v-model="formData.startTime" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker>
					</el-form-item>	
					<el-form-item label="--" prop="endTime" class="input-time">
						<el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="2" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
				</el-col>
			</el-row>
		</el-form>
		<TablePagination :tableData="tableData" :tableCol="tableCol" @currentChange="currentChange">
			<!-- 操作 -->
			<template slot-scope="props" slot="operation">
				<el-button @click="showInfo(3, props.obj.row)">详情</el-button>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="editPanleShow = false"></AddEdit>
	</div>
</template>

<script>
	import { logManagement, authManagement } from "@/service/api";
	import TablePagination from "@/components/tablePagination";
	import AddEdit from "./addEdit";
	export default {
		components: {
			AddEdit,
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
					indexWidth: 80,		//序号宽度
					operationWidth: 70,	//操作宽度
					column: [
						{
							prop: 'userName',
							label: '操作者账号',
							minWidth: '60',
						},
						{
							prop: 'targetType',
							label: '类型',
							width: '80',
						},
						{
							prop: 'operatorTime',
							label: '操作时间',
							width: '160',
							align: 'center',
						},
						{
							prop: 'action',
							label: '模块',
							minWidth: '120',
							align: 'center',
						},
						{
							prop: 'ip',
							label: 'IP',
							width: '130',
							align: 'center',
						},
						{
							prop: 'remark',
							label: '备注',
							minWidth: '100',
							align: 'center',
						}
					]
				},

				//当前页码
				currentPage: 1,
				modules: [],

				//编辑
				editData: {},
                editPanleShow: false,
			}
		},
		methods: {
			/**
			 * 查询
			 */
			async getTableData() {
				if(this.formData.startTime > this.formData.endTime){
					this.$message.error('开始时间不能大于结束时间');
					return;
				}

				let params = {
					queryData: {
						userName: this.formData.userName || null,
						targetType: this.formData.targetType || null,
						resId: this.formData.resId || null,
						startTime: this.formData.startTime,
						endTime: this.formData.endTime,
					},
					currentPage: this.currentPage,
				};
				let res = await logManagement.operationlog(params);
				if(!res) return;
				this.tableData = res.data;

				//获取模块
				this.getModules();
			},

			/**
			 * 获取模块
			 */
			async getModules() {
				let res = await authManagement.getModules();
				if(!res) return;
				this.modules = res.data;
			},

			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.currentPage = val;
				this.getTableData();
			},

			/**
			 * type: 1: 新增  2: 编辑  3: 详情
			 */
			showInfo(type, data) {
				this.editData = {type, data};
				this.editPanleShow = true;
			},
		},
		created() {
			this.getTableData();
		}
	}
</script>
<style lang="less">
	
</style>