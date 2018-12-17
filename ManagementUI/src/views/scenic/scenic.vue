<!--景点管理-->
<template>
	<div id="account">
		<el-form @submit.native.prevent :inline="true" :model="formData" ref="formData">
			<el-row type="flex" justify="space-between" class="form-query">
				<el-col>
                    <el-form-item label="景点名称：" prop="scenicNameCh">
					    <el-select v-model="formData.scenicNameCh" placeholder="请选择" clearable> 
							<el-option :label="item.scenicNameCh" :value="item.scenicNameCh" 
							v-for="item in select" :key="item.scenicId"></el-option>
                        </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4" class="button-group flex-j-right">
					<el-button class="query-btn" type="primary" @click="getTableData()">
						<i class="fa fa-search"></i> 查询
					</el-button>
					<el-button class="query-btn" type="primary" @click="showInfo(1)">
						<i class="fa fa-plus"></i> 新增景区
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
	import { scenicManagement } from "@/service/api";
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
							prop: 'scenicNameCh',
							label: '景点名称',
							minWidth: '100',
						},
						{
							prop: 'scenicPosition',
							label: '所在城市',
							// minWidth: '100',
						},
						{
							prop: 'scenicPrice',
							label: '价格(元)',
							// width: '125',
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
							prop: 'scenicMobile',
							label: '联系电话',
							minWidth: '100',
						},
						{
							prop: 'scenicAddress',
							label: '地址',
							minWidth: '100',
						}
					]
				},
				currentPage: 1, //当前页码
				checkedVal: [], //多选
				editData: {}, 	//编辑
                editPanleShow: false,
                restData: {}, //重置密码
				dialogShow: true,
				flag: true,
				select: []
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
			 * 查询景点名称
			 */
			async getSelectScenicList() {
				let res = await scenicManagement.getSelectScenicList();
				if(res && res.data == null) {
					return;
				}
				this.select = res.data
				this.$forceUpdate();		
			},
			/**
			 * 查询
			 */
			async getTableData() {
				let params = {
						"data" : {
						"scenicNameCh" : this.formData.scenicNameCh
					},
					"pageSize" : 20,
					"currentPage" : this.currentPage
				};
				let res = await scenicManagement.getScenicList(params);
				if(res && res.data == null) {
					this.tableData.totalNum = 1;
					return;
				}
				this.tableData = Object.assign({}, res.data);
					this.$forceUpdate();		
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
				let idArr = this.checkedVal.map((val) => val.scenicId);
				let params = data ? [data.scenicId] : idArr;
				showPrompt( async () => {
					let res = await scenicManagement.deleteOneScenic(params);
					if(!res) return;
					if(res.status == this.$successCode) {
						this.$message.success(res.message);
						this.getTableData();
						this.getSelectScenicList()
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
				if(flag){
					this.getTableData();
					this.getSelectScenicList();

				} 
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
			this.getSelectScenicList()
		}
	}
</script>
<style lang="less">
	
</style>