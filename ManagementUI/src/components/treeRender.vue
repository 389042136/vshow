<template>
	<div class="tree-content flex-a-center">
		<div class="tree-label" :title="data.name">{{ data.name }}</div>
		<div class="tree-icon" v-if="node.level > 1">
			<el-button type="text" @click="AddEdit(node, data, 1)">
				<i class="el-icon-plus"></i>
			</el-button>
			<template v-if="node.level > 2">
				<el-button type="text" @click="AddEdit(node, data, 2)">
					<i class="el-icon-edit"></i>
				</el-button>
				<el-button type="text" @click="Delete(node, data)">
					<i class="el-icon-delete"></i>
				</el-button>
			</template>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['node', 'data'],
		methods: {
			//添加节点事件
			AddEdit(n, d, type) {
				this.$emit('AddEdit', n, d, type);
			},
			//删除节点事件
			Delete(n, d) {
				this.$emit('Delete', n, d);
			}
		}
	}
</script>

<style lang="less">
	.tree-content {
		width: calc(100% - 24px);
		display: flex;
		.tree-label {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.tree-icon {
			width: 80px;
			display: none;

			span {
				border: 1px solid #409efe;
				border-radius: 3px;
			}
		}
		&:hover .tree-icon {
			display: block;
		}
	}
</style>