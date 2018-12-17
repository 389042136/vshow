<!--客房管理-->
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
						<i class="fa fa-plus"></i> 新增客房
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
                <el-button @click="showInfo(3, props.obj.row)" type="info">详情</el-button>
				<el-button @click="getDeleteId(props.obj.row)" type="danger">删除</el-button>
			</template>
			<!-- 是否含早 -->
			<template slot-scope="props" slot="roomBreakfast">
				<span v-if="props.obj.row.roomBreakfast == 1">含早</span>
				<!-- <span v-else class='el-c-danger'>不含早</span> -->
				<span v-else>不含早</span>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" :devArr="roomDevList" :hotelArr="hotelNameChList" @panleClose="panleClose"></AddEdit>
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
					hotelNameCh: null,
				},
				hotelNameChList: [],
				roomDevList: [],

				//表格，分页数据
				tableData: {},

				//表格列设置
				tableCol: {
                    hasSelect: true,
					operationWidth: 200,//操作宽度
					column: [
						{
							prop: 'hotelNameCh',
							label: '酒店名称',
							minWidth: '200',
						},
						{
							prop: 'roomNameCh',
							label: '客房名称',
							minWidth: '120',
						},
						{
							prop: 'roomPrice',
							label: '价格(元/晚)',
							width: '100',
							align: 'center',
						},
						{
							prop: 'roomNumOfBed',
							label: '床位数(个)',
							minWidth: '100',
							align: 'center',
						},
						{
							prop: 'roomNumOfPerson',
							label: '住宿人数(人)',
							minWidth: '120',
							align: 'center',
						},
                        
						{
							prop: 'roomBreakfast',
							label: '是否含早',
							width: '100',
							align: 'center',
							slotScope: true,
						}
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
			 * 获取所有的酒店信息
			 */
			async getAllHotelDatas() {
				let res = await hotel.getAllHotelDatas();
				if(!res) return;
				this.hotelNameChList = res.data;
			},

			/**
			 * 获取所有的客房设施类型
			 */
			async getAllRoomDevs() {
				let res = await hotel.getAllRoomDevs();
				if(!res) return;
				res.data.forEach((item,index)=>{
					this.roomDevList[index] = item.roomDevNameCh
				})
			},

			/**
			 * 查询
			 */
			async getTableData() {
				let params = {
					data: {
						hotelNameCh: this.formData.hotelNameCh,
					},
					currentPage: this.currentPage,
					pageSize: this.pageSize,
				};
				let res = await hotel.getRoomList(params);
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
				let idArr = this.checkedVal.map((val) => val.roomId);
				let params = data ? [data.roomId] : idArr;
				showPrompt( async () => {
					let res = await hotel.deleteRoom(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除客房成功');
						this.getTableData();
					}else {
						this.$message.error('删除客房失败');
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
			this.getAllHotelDatas();
			this.getAllRoomDevs();
			this.getTableData();	
		}
	}
</script>
<style lang="less" scoped>
	.el-input {
		width: 200px;
	}
</style>