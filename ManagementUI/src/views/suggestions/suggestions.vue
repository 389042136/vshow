<!--留言板管理-->
<template>
	<div id="account">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
					<el-form-item label="日期：" prop="adviceCreateTime">
						<el-date-picker
					      v-model="formData.adviceCreateTime"
					      type="daterange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期"
						  value-format="yyyy-MM-dd"
						  format="yyyy-MM-dd">
					    </el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
					<!-- <el-button class="query-btn" type="primary" @click="showInfo(1)">
						<i class="fa fa-plus"></i> 新增留言
					</el-button> -->
					<el-button class="query-btn" type="danger" v-if="checkedVal.length > 0" @click="getDeleteId()">
						<i class="fa fa-trash"></i> 批量删除
					</el-button>
				</el-col>
			</el-row>
		</el-form>
		<TablePagination :tableData="tableData" :tableCol="tableCol" @currentChange="currentChange" @selectionChange="selectionChange">
			<!-- 操作 -->
			<template slot-scope="props" slot="operation">
				<!-- <el-button @click="showInfo(2, props.obj.row)">编辑</el-button> -->
				 <el-button @click="showInfo(3, props.obj.row)" type="info">详情</el-button>
				<el-button @click="getDeleteId(props.obj.row)" type="danger">删除</el-button>
               
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { advice } from "@/service/api";
	import { showPrompt } from "@/utils/utils";
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
                formData: {
					adviceCreateTime: [],
				},

				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
                    hasSelect: true,
					operationWidth: 150,//操作宽度
					column: [
						{
							prop: 'adviceContent',
							label: '内容',
							// minWidth: '200',
						},
						{
							prop: 'adviceCreateTime',
							label: '日期',
							minWidth: '200',
							align: 'center',
						},
						// {
						// 	prop: 'deviceSource',
						// 	label: '来源',
						// 	width: '120',
						// 	align: 'center',
						// },
						{
							prop: 'adviceContact',
							label: '联系方式',
							width: '170',
							align: 'center',
                        },

					]
				},

				//当前页码
				currentPage: 1,
				//每页显示条数
				pageSize: 20,

				//多选
				checkedVal: [],

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
				let params = {
					queryData: {
						data: this.formData.adviceCreateTime || [],
					},
					currentPage: this.currentPage,
					pageSize: this.pageSize,
				};
				let res = await advice.getAdviceList(params);
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
				let idArr = this.checkedVal.map((val) => val.adviceId);
				let params = data ? [data.adviceId] : idArr;
				showPrompt( async () => {
					let res = await advice.deleteAdvice(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除留言成功');
						this.getTableData();
					}else {
						this.$message.error('删除留言失败');
					}
				}, '删除');
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