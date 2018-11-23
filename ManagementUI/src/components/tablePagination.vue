<!--表格 + 分页组件-->
<template>
    <div class="tablePagination">
        <el-row type="flex" justify="end" align="middle" class="pagination">
			<p>共查询到<span class="pagination-text">{{ tableData.totalNum }}</span>条记录 </p>
			<p>共<span class="pagination-text">{{ tableData.totalPageNum }}</span>页</p>
			<slot name="operationBtn" v-if="operationBtn"></slot>
			<el-pagination 
				v-else
				background
				@current-change="currentChange" 
				:page-size="tableData.pageSize" 
				:current-page="tableData.currentPage" 
				:total="tableData.totalNum"
				layout="prev, pager, next, jumper">
			</el-pagination>
		</el-row>
		<div class="multipleTable-con">
			<el-table class="multipleTable" :data="tableData.returnDatas"  @selection-change="selectionChange" ref="multipleTable" stripe highlight-current-row>
				<el-table-column
					v-if="tableCol.hasSelect"
					type="selection"
					width="44">
				</el-table-column>
				<el-table-column 
					type="index" 
					label="序号" 
					:width="tableCol.indexWidth || 50"
					:index="indexMethod"
					show-overflow-tooltip
					align="center">
				</el-table-column>
				<el-table-column 
					v-if="tableCol.operationWidth"
					label="操作" 
					:width="tableCol.operationWidth">
					<template slot-scope="scope">
						<slot name="operation" :obj="scope"></slot>
					</template>
				</el-table-column>
				<template v-for="(item, index) in tableCol.column" >
					<el-table-column
						v-if="item.slotScope"
						:key="index"
						:align="item.align"
						:prop="item.prop"
						:label="item.label"
						:width="item.width"
						:min-width="item.minWidth"
						show-overflow-tooltip >
						<template slot-scope="scope">
							<slot :name="item.prop" :obj="scope"></slot>
						</template>
					</el-table-column>
					<el-table-column
						v-else
						:key="index"
						:align="item.align"
						:prop="item.prop"
						:label="item.label"
						:width="item.width"
						:min-width="item.minWidth"
						show-overflow-tooltip >
					</el-table-column>
				</template>
			</el-table>
		</div>
    </div>
</template>

<script>
    export default {
		props: ['tableData', 'tableCol', 'operationBtn'],
		data() {
			return {
				
			}
		},
		methods: {
			/**
			 * 跳转页码
			 */
			currentChange(val) {
				this.$emit('currentChange', val);
			},

			/**
			 * 序号
			 */
			indexMethod(index) {
				return index + 1 + (this.tableData.currentPage - 1) * this.tableData.pageSize;
			},

			/**
			 * 多选
			 */
			selectionChange(val){
				this.$emit('selectionChange', val);
			},
		}
    }
</script>

<style lang="less">
	
</style>


