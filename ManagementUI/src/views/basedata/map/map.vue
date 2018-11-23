<!--地图管理-->
<template>
	<div class="baseData">
		<TablePagination :tableData="tableData" :tableCol="tableCol" @selectionChange="selectionChange" :operationBtn="true">
			<!-- 新增按钮 -->
			<template slot="operationBtn">
				<el-button class="query-btn" type="primary" @click="showInfo(1)" >
					<i class="fa fa-plus"></i> 新增地图
				</el-button>
				<el-button class="query-btn" type="danger" v-if="checkedVal.length > 0" @click="getDeleteId()">
					<i class="fa fa-trash"></i> 批量删除
				</el-button>
			</template>

			<!-- 操作 -->
			<template slot-scope="props" slot="operation">
				<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
				<el-button @click="getDeleteId(props.obj.row)" type="danger">删除</el-button>
			</template>

			<!-- 预览地图 -->
			<template slot-scope="props" slot="mapUrl">
				<span v-preview="props.obj.row.mapUrl" class="el-c-blue mapUrl">{{ props.obj.row.mapUrl }}</span>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { airBasedata } from "@/service/api";
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
				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
					operationWidth: 150,//操作宽度
					column: [
						{
							prop: 'mapName',
							label: '地图名称',
							minWidth: '100',
						},
						{
							prop: 'mapUrl',
							label: '预览地图',
							minWidth: '200',
							slotScope: true,
						},
						{
							prop: 'remark',
							label: '备注',
							minWidth: '150',
						},
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
					currentPage: this.currentPage,
					pageSize: 1000
				};
				let res = await airBasedata.getMap(params);
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
				let idArr = this.checkedVal.map((val) => val.mapId);
				let params = data ? [data.mapId] : idArr;
				showPrompt( async () => {
					let res = await airBasedata.deleteMap(params);
					if(!res) return;
					
					if(res.status == this.$successCode) {
						this.$message.success('删除地图成功');
						this.getTableData();
					}else {
						this.$message.error('删除地图失败');
					}
				}, '删除');
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
	
</style>