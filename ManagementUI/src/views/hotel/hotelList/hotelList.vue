<!--酒店管理-->
<template>
	<div id="account">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
					<el-form-item label="酒店名称：" prop="hotelNameCh">
                        <el-select v-model="formData.hotelNameCh"  size="small"  placeholder="请选择酒店名称" filterable clearable>
							<!-- <el-option label="全部" :value="null" :key="0"></el-option> -->
                            <el-option v-for="(item,index) in hotelNameChList" :key="index + 1" :label="item.hotelNameCh" :value="item.hotelNameCh"></el-option>
                        </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
					<el-button class="query-btn" type="primary" @click="showInfo(1)">
						<i class="fa fa-plus"></i> 新增酒店
					</el-button>
					<!-- <el-button class="query-btn" type="danger" v-if="checkedVal.length > 0" @click="getDeleteId()">
						<i class="fa fa-trash"></i> 批量删除
					</el-button> -->
				</el-col>
			</el-row>
		</el-form>
		<TablePagination :tableData="tableData" :tableCol="tableCol" @currentChange="currentChange" @selectionChange="selectionChange">
			<!-- 操作 -->
			<template slot-scope="props" slot="operation">
				<el-button @click="showInfo(2, props.obj.row)">编辑</el-button>
                <el-button @click="showInfo(3, props.obj.row)" type="info">详情</el-button>
				<el-button @click="getDeleteId(props.obj.row)" type="danger">删除</el-button>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { hotel } from "@/service/api";
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
					hotelNameCh: null
				},
                hotelNameChList: [],

				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
                    hasSelect: false,
					operationWidth: 200,//操作宽度
					column: [
						{
							prop: 'hotelNameCh',
							label: '酒店中文名称',
							minWidth: '200',
						},
						{
							prop: 'hotelNameEn',
							label: '酒店英文名称',
							minWidth: '200',
						},
						{
							prop: 'hotelDistant',
							label: '到机场的距离(km)',
							minWidth: '140',
							align: 'center',
						},
						{
							prop: 'hotelAddress',
							label: '详细地址',
							minWidth: '200',
						},
						{
							prop: 'hotelPosition',
							label: '位置',
							// minWidth: '120',
						},
						{
							prop: 'hotelMobile',
							label: '联系电话',
							width: '140',
							// align: 'center',
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
			async init() {
				this.getTableData();
				this.getAllHotelDatas();
			},
			async getTableData() {
				let params = {
					data: {
						hotelNameCh: this.formData.hotelNameCh,
					},
					currentPage: this.currentPage,
					pageSize: this.pageSize,
				};
				let res = await hotel.getHotelList(params);
				// if(res && res.status == 0){
				// 	this.tableData = res.data;
				// } else {
				// 	this.$message.error(res.message);
				// }
				if(!res) return;
				this.tableData = res.data;

			},
			async getAllHotelDatas() {
				let res = await hotel.getAllHotelDatas();
				if(!res) return;
				this.hotelNameChList = res.data;
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
				// let idArr = this.checkedVal.map((val) => val.hotelId);
				// let params = data ? [data.hotelId] : idArr;

				let params = data.hotelId
				showPrompt( async () => {
					let res = await hotel.deleteHotel(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除酒店成功');
						this.init();
					}else {
						this.$message.error('删除酒店失败' + ' : ' + res.message);
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
				if(flag) this.init();
			},

			/**
			 * 显示批量删除按钮
			 */
			selectionChange(val) {
				this.checkedVal = val;
			},
		},
		created() {
			this.init();
		}
	}
</script>
<style lang="less" scoped>
	.el-input {
		width: 200px;
	}
</style>