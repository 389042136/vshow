<!--登录日志-->
<template>
	<div class="operationlog">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
                    <el-form-item label="账号：" prop="userName">
						<el-input v-model.trim="formData.userName" maxlength="30" placeholder="请输入账号" @keydown.enter.native="getTableData()" clearable></el-input>
					</el-form-item>
					<el-form-item label="类型：" prop="targetType" class="targetType">
                        <el-select v-model="formData.targetType" placeholder="请选择" clearable> 
                            <el-option label="登录" value="1"></el-option>
                            <el-option label="退出" value="2"></el-option>
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
		</TablePagination>
	</div>
</template>

<script>
	import { logManagement } from "@/service/api";
	import TablePagination from "@/components/tablePagination";
	export default {
		components: {
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
					column: [
						{
							prop: 'userName',
							label: '账号',
							minWidth: '100',
						},
						{
							prop: 'targetType',
							label: '类型',
							minWidth: '50',
						},
						{
							prop: 'operatorTime',
							label: '操作时间',
							minWidth: '100',
							align: 'center',
						},
						{
							prop: 'ip',
							label: 'IP',
							minWidth: '100',
							align: 'center',
						}
					]
				},

				//当前页码
				currentPage: 1,
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
						startTime: this.formData.startTime,
						endTime: this.formData.endTime,
					},
					currentPage: this.currentPage,
				};
				let res = await logManagement.loginLog(params);
				if(!res) return;
				this.tableData = res.data;
			},

			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.currentPage = val;
				this.getTableData();
			},
		},
		created() {
			this.getTableData();
		}
	}
</script>
<style lang="less">
	
</style>