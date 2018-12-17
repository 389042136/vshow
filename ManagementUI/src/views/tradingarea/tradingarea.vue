<!--商圈管理-->
<template>
	<div id="account">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
                    <!-- <el-form-item label="区域：" prop="status">
                        <el-select v-model="formData.status" placeholder="请选择" clearable> 
                            <el-option label="T2到达区" :value="0"></el-option>
                            <el-option label="T3到达区" :value="1"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="商家名称：" prop="businessNameCh">
					    <el-select v-model="formData.businessNameCh" placeholder="请选择商家名称" clearable> 
							<el-option :label="item.businessNameCh" :value="item.businessNameCh" 
							v-for="item in select" :key="item.businessNameCh"></el-option>
                        </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
					<el-button class="query-btn" type="primary" @click="showInfo(1)">
						<i class="fa fa-plus"></i> 新增商铺
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
				<el-button type="danger" @click="getDeleteId(props.obj.row)">删除</el-button>
			</template>
			<!-- 营业时间 -->
			<template slot-scope="props" slot="time">
			 {{props.obj.row.businessOpenTime}} - {{props.obj.row.businessCloseTime}}
			</template>
			<!-- 位置 -->
			<template slot-scope="props" slot="xy">
			 ({{props.obj.row.businessPositionX}},{{props.obj.row.businessPositionY}})
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { businessManagement } from "@/service/api";
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
				formData: {}, //查询表单
                tableData: {}, //表格，分页数据
				//表格列设置
				tableCol: {
					operationWidth: 200,//操作宽度
					hasSelect:true,
					column: [
						{
							prop: 'businessNameCh',
							label: '商家名称',
							// minWidth: '200',
						},
						{
							prop: 'businessNameEn',
							label: '英文名称',
							// minWidth: '200',
						},
						{
							prop: 'businessAreaNameCh',
							label: '区域',
							// minWidth: '100',
						},
						{
							prop: 'businessMobile',
							label: '联系电话',
							// minWidth: '100',
						},
						{
							prop: 'businessTypeNameCh',
							label: '类型',
							// width: '150',
							align: 'center',
						},
						{
							prop: 'time',
							label: '营业时间',
							// width: '125',
							align: 'center',
							slotScope: true,
						},						
						{
							prop: 'xy',
							label: '位置',
							slotScope: true,
							align: 'center',
						},
					]
				},
				currentPage: 1, //当前页码
				checkedVal: [], //多选
				editData: {}, 	//编辑
                editPanleShow: false,
                restData: {}, //重置密码
				dialogShow: false,
				select:[]
			}
		},
		methods: {
			
			/**
			 * 查询酒店名称
			 */
			async getSelectBusinessList() {
				let res = await businessManagement.getSelectBusinessList();
				if(res && res.data == null) {
					return;
				}
				  this.select = res.data;
				this.$forceUpdate();		
			},
			/**
			 * 查询
			 */
			async getTableData() {
					let params = {
						"data" : {
						"businessNameCh" : this.formData.businessNameCh
					},
					"pageSize" : 20,
					"currentPage" : this.currentPage
				};
				let res = await businessManagement.getBusinessList(params);
				// if(res && res.data == null) {
				// 	// this.tableData.totalNum = 1;
				// 	return;
				// }
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
				let idArr = this.checkedVal.map((val) => val.businessId);
				let params = data ? [data.businessId] : idArr;
				showPrompt( async () => {
					let res = await businessManagement.deleteOneBusiness(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success('删除账号成功');
						this.getTableData();
						this.getSelectBusinessList()
					}else {
						this.$message.error('删除账号失败');
					}
				}, '删除');
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
				if(flag) {
					this.getTableData();
				    this.getSelectBusinessList();
				}
			},

			/**
			 * 重置密码弹框关闭
			 */
			dialogClose(flag) {
				this.dialogShow = false;
				if(flag) {
					this.getTableData();
				    this.getSelectBusinessList();
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
			this.getSelectBusinessList();
		}
	}
</script>
<style lang="less">
	
</style>