<!--统计管理-->
<template>
	<div>
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
                <el-button @click="exportExcel(props.obj.row)" type="primary">导出报表</el-button>
			</el-row>
		</el-form>
		<TablePagination :tableData="tableData" :tableCol="tableCol">
			<!-- 操作 -->
			<!-- <template slot-scope="props" slot="operation">
				<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
				<el-button @click="getDeleteId(props.obj.row)" type="danger">删除</el-button>
                <el-button @click="showInfo(3, props.obj.row)" type="info">详情</el-button>
                
			</template> -->
		</TablePagination>
		
	</div>
</template>

<script>
	import { authManagement } from "@/service/api";
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
                    hasSelect: false,
					operationWidth: 0,//操作宽度
					column: [
						{
							prop: 'moduleName',
							label: '终端功能',
                            minWidth: '200',
                            align: 'center',
						},
						{
							prop: 'clickNum',
							label: '点击次数(次)',
                            minWidth: '200',
                            align: 'center',
						},
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
			 * 跳转页码
			 */
			currentChange(val) {
				this.currentPage = val;
				this.getTableData();
            },
            exportExcel(data){
                // console.log(data);
            }

		},
		created() {
            // this.getTableData();
            this.tableData =  {
                totalNum: 2,
                totalPageNum: 2,
                pageSize: 20,
                currentPage: 1,
                returnDatas: [
                    { id: 1, moduleName: '酒店管理', clickNum: 12000},
                    { id: 2, moduleName: '商圈管理', clickNum: 1000},
                ]
            }
		}
	}
</script>
<style lang="less" scoped>
	.el-input {
		width: 200px;
	}
</style>