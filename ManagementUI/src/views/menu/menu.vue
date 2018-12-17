<!--乘机须知-->
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
                    <i class="fa fa-plus"></i> 新增菜单
                </el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%" >
            <el-table-column type="index" label="序号" width="50" align='center'> </el-table-column>
             <el-table-column label="操作" width="200" align='center'>
                <template slot-scope="scope">
                    <el-button @click="showInfo(2,scope.row)"  size="mini">编辑</el-button>
                    <el-button @click="getDeleteId(scope.index,scope.row)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="menuType"  label="菜单分类"  width="300" align='center'> </el-table-column>
            <el-table-column prop="name"  label="名称" :show-overflow-tooltip='tooltip' width="200" align='center'> </el-table-column>
            <el-table-column prop="eName" label="英文名称" width="200" align='center'></el-table-column>
             <el-table-column prop="icon" label="图标"   align='center'></el-table-column>
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
                        menuType: '前来接人',
                        name: '乘机须知',
                        eName: 'help',
                        icon:'https://blog.csdn.net'
                    }, {
                        menuType: '前来接人',
                        name: '乘机须知，酒店查询，商圈查询',
                        eName: 'help',
                        icon:'https://blog.csdn.net'
                    }, {
                        menuType: '准备出发',
                        name: '乘机须知，酒店查询，商圈查询',
                        eName: 'help',
                        icon:'https://blog.csdn.net'
                    }, {
                        menuType: '全部功能',
                        name: '乘机须知，酒店管理，商圈管理，景点管理，航班管理',
                        eName: 'all',
                        icon:'https://blog.csdn.net'
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