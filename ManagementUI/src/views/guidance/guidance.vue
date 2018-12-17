<!--设施引导-->
<template>
	<div>
        <el-row  class="form-query">
             <el-col :span="22" class="flex-j-right">
                 <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes='pagesizes'
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='total'>
                    </el-pagination>
                </div>
            </el-col>
            <el-col :span="2" class="flex-j-right">
                <el-button class="query-btn" type="primary" @click="showInfo(1)">
                    <i class="fa fa-plus"></i> 新增引导设施
                </el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%" >
            <el-table-column type="index" label="序号" width="50"> </el-table-column>
             <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button @click="showInfo(2,scope.row)"  size="mini">编辑</el-button>
                    <el-button @click="getDeleteId(scope.index,scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="guidanceType"  label="引导点分类"   > </el-table-column>
            <el-table-column prop="name"  label="名称"  > </el-table-column>            
            <el-table-column prop="location" label="位置"   ></el-table-column>
            <el-table-column prop="remark" label="备注"    ></el-table-column>
         </el-table>
        <AddEdit :panleData="editData" :panleShow="editPanleShow" @panleClose="panleClose"></AddEdit>
	</div>
</template>

<script>
	import { authManagement } from "@/service/api";
    import { showPrompt } from "@/utils/utils";
    import AddEdit from "./addEdit";
	export default {
		components: {AddEdit},
		data() {
			return {
				formData: {}, //查询表单
                tableData: {}, //表格数据
                pagesizes:[10, 20, 30, 40],
                pagesize: 1,
                currentPage: 1, //当前页码
                total:0,
				checkedVal: [], //多选
				editData: {}, //编辑
				editPanleShow: false,
				authData: {}, //授权
                dialogShow: false,
                tooltip: true
			}
		},
		methods: {
			/**
			 * 查询
			 */
			getTableData(){
                this.tableData=[{
                        guidanceType: '卫生间',
                        name: '东区卫生间',
                        location:'（22.0,30.8）',
                         remark: '公共设施',
                    }, {
                      guidanceType: '商店',
                        name: '东区商店',
                        location:'（12.0,370.8）',
                         remark: '公共设施',
                    }, {
                        guidanceType: '出租车乘车点',
                        name: '出租车乘车点',
                        location:'（72.0,52.8）',
                         remark: '公共设施',
                    }, {
                       guidanceType: '茶水间',
                        name: '东区茶水间',
                        location:'（32.0,45.3）',
                         remark: '公共设施',
                  }, {
                       guidanceType: '茶水间',
                        name: '西区卫生间',
                        location:'（212.0,89.8）',
                         remark: '公共设施',
                  }]
                this.total=this.tableData.length;
            },
            handleSizeChange(val) {
                this.pagesize=val;
                this.getTableData();
            },
            handleCurrentChange(val) {
                this.currentPage=val;
                this.getTableData();
            },
            /**
			 * type: 1: 新增  2: 编辑  3: 详情
			 */
			showInfo(type, data) {
				this.editData = {type, data};
				this.editPanleShow = true;
			},
			/**
			 * 新增、编辑弹框关闭
			 */
			panleClose(flag) {
				this.editPanleShow = false;
				if(flag) this.getTableData();
			},

			/**
			 * 删除
			 */
			getDeleteId(index,data) {
                this.$confirm('是否删除该条记录?', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                    this.tableData.splice(index,1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
			},

			/**
			 * 授权弹框
			 */
			authorization(data) {
				this.authData = data;
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