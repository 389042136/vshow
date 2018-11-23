<!--自定义页面-->
<template>
	<div class="background">
		<!-- 查询-->
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
					<el-form-item label="文件描述：" prop="fileDescription" class="contentCn">
						<el-input v-model.trim="formData.fileDescription" maxlength="50" placeholder="请输入文件描述" @keydown.enter.native="getTableData()" clearable></el-input>
					</el-form-item>
					<el-form-item label="状态：" prop="status">
                        <el-select v-model="formData.status" placeholder="请选择" clearable> 
                            <el-option label="未开始" value="0"></el-option>
                            <el-option label="进行中" value="1"></el-option>
							<el-option label="已结束" value="2"></el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="选择时间：" prop="startTime" class="input-time">
						<el-date-picker v-model="formData.startTime" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm"></el-date-picker>
					</el-form-item>	
					<el-form-item label="--" prop="endTime" class="input-time">
						<el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm"></el-date-picker>
					</el-form-item>
				</el-col>	

				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
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
				<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
				<el-button @click="getDeleteId(props.obj.row)" type="danger">删除</el-button>
			</template>

			<!-- 设备名称 -->
			<template slot-scope="props" slot="url">
				<a :href="props.obj.row.url" target="_blank">{{ props.obj.row.url }}</a>
			</template>

			<!-- 状态 -->
			<template slot-scope="props" slot="status">
				<span v-if="0 == props.obj.row.status">未开始</span>
				<span v-else-if="1 == props.obj.row.status" class="el-c-success">进行中</span>
				<span v-else-if="2 == props.obj.row.status" class="el-c-danger">已结束</span>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { displayControlManagement } from "@/service/api";
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
				formData: {},

				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
					operationWidth: 150,//操作宽度
					column: [
						{
							prop: 'fileDescription',
							label: '文件描述',
							minWidth: '100',
						},
						{
							prop: 'url',
							label: '访问地址',
							minWidth: '150',
							align: 'center',
							slotScope: true,
						},
						{
							prop: 'lastUpdateTime',
							label: '最后更新时间',
							width: '160',
							align: 'center',
						},
						{
							prop: 'status',
							label: '状态',
							width: '80',
							align: 'center',
							slotScope: true,
						},
						{
							prop: 'remark',
							label: '备注',
							minWidth: '100',
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
			}
		},
		methods: {
			/**
			 * 查询
			 */
			async getTableData() {
				let params = {
					queryData: {
						fileDescription: this.formData.fileDescription || null,
						status: this.formData.status || null,
						startTime: this.formData.startTime,
						endTime: this.formData.endTime,
						type: 2,
					},
					currentPage: this.currentPage
				};
				let res = await displayControlManagement.getDIYPage(params);
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
			 * 获取删除对象的id
			 */
			getDeleteId(data) {
				let idArr = this.checkedVal.map((val) => val.fileId);
				let params = data ? [data.fileId] : idArr;
				showPrompt( async () => {
					let res = await displayControlManagement.deleteDIYPage(params);
					if(!res) return;
					
					if(res.status == this.$successCode) {
						this.$message.success('删除自定义页面成功');
						this.getTableData();
					}else {
						this.$message.error('删除自定义页面失败');
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
<style lang="less">
	.background {
		min-width: 1225px;
		.contentCn {
			.el-form-item__content {
				.el-input;
			}

			.el-input {
				width: 230px;
			}
		}
	}
</style>