<!--值机柜台-->
<template>
	<div id="account">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
                    <el-form-item label="柜台模式：" prop="checkinModelCounter">
					    <el-select v-model="formData.checkinModelCounter" placeholder="请选择柜台模式" clearable> 
							<el-option :label="item" :value="item" 
							v-for="item in checkModel" :key="item"></el-option>
                        </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
					<el-button class="query-btn" type="primary" @click="showInfo(1)">
						<i class="fa fa-plus"></i> 新增
					</el-button>
					<el-button class="query-btn" type="primary" @click="updateModle()">
						<i class="el-icon-setting"></i> 设定
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
				<el-button type="danger" @click="getDeleteId(props.obj.row)">删除</el-button>
			</template>
			<!-- 营业时间 -->
			<template slot-scope="props" slot="time">
				<span v-if="props.obj.row.scenicOpenTime">
			     {{props.obj.row.scenicOpenTime}} - {{props.obj.row.scenicCloseTime}}
				</span>
				<span v-else> - </span>
			</template>
		</TablePagination>
		<AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { checkManagement } from "@/service/api";
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
					operationWidth: 150,//操作宽度
					hasSelect:true,
					column: [
						{
							prop: 'checkinNumOfCounter',
							label: '柜台编号',
							minWidth: '50',
						},
						{
							prop: 'checkinInfoOfCounter',
							label: '柜台名称',
							minWidth: '190',
						},
						{
							prop: 'checkinNorthOrSouth',
							label: '柜台方位',
							width: '100',
							align: 'center',
						},
						{
							prop: 'checkinModelCounter',
							label: '柜台模式',
							minWidth: '50',
							align: 'center',
						},
						{
							prop: 'checkinAirlineIata',
							label: '所属航空公司',
							minWidth: '120',
						}
					]
				},
				currentPage: 1, //当前页码
				checkedVal: [], //多选
				editData: {}, 	//编辑
                editPanleShow: false,
                restData: {}, //重置密码
				dialogShow: true,
				checkModel: []
			}
		},
		methods: {
			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.currentPage = val;
				this.getTableData();
			},
			/**
			 * 查询
			 */
			async getTableData() {
				let params = {
						"data" : {
						"checkinModelCounter" : this.formData.checkinModelCounter
					},
					"pageSize" : 20,
					"currentPage" : this.currentPage
				};
				let res = await checkManagement.getCheckInList(params);
				if(res && res.data == null) {
					this.tableData.totalNum = 1;
					return;
				}
				this.tableData = Object.assign({}, res.data);
					this.$forceUpdate();		
			},
			/**
			 * 设定柜台模式
			 */
			async updateModle(){				
				let param = this.formData.checkinModelCounter;
				if(!param){
					this.$message.warning('请选择柜台模式');
					return;
				}
				let res = await checkManagement.updateCheckInModel(param);
				if(res.status == this.$successCode) {
						this.$message.success(res.message);
					}else {
						this.$message.error(res.message);
					}
			},
			/**
			 * 查询已有柜台模式
			 */
			async getModel(){
				let res = await checkManagement.getCheckModel();
				if(res && res.data == null) {
					return;
				}
				this.checkModel= res.data.checkinTypeOfModel;
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
				let idArr = this.checkedVal.map((val) => val.id) ;
				let params = data ? [data.id] : idArr;
				showPrompt( async () => {
					let res = await checkManagement.deleteOneCheckIn(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success(res.message);
						this.getTableData();
					}else {
						this.$message.error(res.message);
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
			this.getModel();
		}
	}
</script>
<style lang="less">
	
</style>