<!--查看资源-->
<template>
	<div id="resources">
		<div class="multipleTable-con">
			<el-table class="multipleTable" :data="tableData" :span-method="arraySpanMethod" border>
				<el-table-column prop="module" label="模块" min-width="100"></el-table-column>
				<el-table-column prop="childModule" label="子模块" min-width="100"></el-table-column>
				<el-table-column prop="operation" label="操作功能" min-width="100"></el-table-column>
				<el-table-column prop="url" label="url地址" min-width="200" show-overflow-tooltip></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import { authManagement } from "@/service/api";
	export default {
		data() {
			return {
				tableData: [],
				arraySpan: {
					module: [1],
					childModule: [1]
				}
			}
		},
		methods: {
			/**
			 * 查询
			 */
			async getTableData() {
				let res = await authManagement.getResource();
				if(res) {
					this.tableData = res.data;
					this.calcNum();
				}
			},

			/**
			 * 计算需要合并行数
			 */
			calcNum() {
				let modulesIndex = 0,
					cModuleIndex = 0;
				this.tableData.forEach((item, index) => {
					if(index != 0) {
						if(item.moduleId == this.tableData[index - 1].moduleId) {
							this.arraySpan.module[modulesIndex]++;
							this.arraySpan.module.push(0);
						} else {
							this.arraySpan.module.push(1);
							modulesIndex = index;
						}

						if(item.childModuleId == this.tableData[index - 1].childModuleId) {
							this.arraySpan.childModule[cModuleIndex]++;
							this.arraySpan.childModule.push(0);
						} else {
							this.arraySpan.childModule.push(1);
							cModuleIndex = index;
						}
					}
				});
			},
			arraySpanMethod({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0) {
					let row = this.arraySpan.module[rowIndex];
					return [row, 1];
				} else if(columnIndex == 1) {
					let row = this.arraySpan.childModule[rowIndex];
					return [row, 1];
				}
			}
		},
		created() {
			this.getTableData();
		}
	}
</script>
<style lang="less">
	#resources {

		.multipleTable-con {
			padding: 0 50px;
			margin-top: 30px;
			height: calc(100% - 50px);
			box-sizing: border-box;
		}

		.multipleTable.el-table td{
			padding: 3px 5px;
		}
		
		.el-table--enable-row-hover .el-table__body tr:hover>td {
			background: none;
		}
	}
</style>