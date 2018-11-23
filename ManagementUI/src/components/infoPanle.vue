<!--测栏滑块组件-->
<template>
	<div class="infoPanle-mask" :class="{show: show}" @click.self="close">
		<div class="infoPanle">
			<el-row class="title">
				<el-col :span="12">{{title}}</el-col>
				<el-col :span="12" class="flex-j-right">
					<el-button size="medium" @click="close">返回</el-button>
					<el-button size="medium" @click="submit" type="primary" :disabled="type == 3">保存</el-button>
				</el-col>
			</el-row>
			<div class="panleMain">
				<slot></slot>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['propShow', 'propType'],
		data() {
			return {
				show: false,
				type: 0,
				title: '',
			}
		},
		methods: {
			init() {
				this.show = this.propShow;
				this.type = this.propType;
				this.typeFn(this.type);
			},

			/**
			 * 判断类型
			 * 1: 新增  2: 编辑  3: 详情
			 */
			typeFn(type) {
				switch(type) {
					case 1:
						this.title = '新增';
						break;
					case 2:
						this.title = '编辑';
						break;
					case 3:
						this.title = '详情';
						break;
					case 4:
						this.title = '绑定';
						break;
				}
			},

			/**
			 * 关闭
			 */
			close() {
				this.show = false;
				this.$emit('close');
			},

			/**
			 * 确定
			 */
			submit() {
				this.$emit('submit');
			}
		},
		watch: {
			propShow(val) {
				this.init();
			}
		}
	}
</script>
<style lang="less">
	@infoPanleWidth: 450px;
	.infoPanle-mask {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 10;
		transition: all .3s;
		background: rgba(0, 0, 0, .6);
		opacity: 0;
		&.show {
			opacity: 1;
			left: 0;
			right: 0 !important;
		}

		right: -(@infoPanleWidth + 100);
		.infoPanle {
			width: @infoPanleWidth;
		}
	}
	
	.infoPanle {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: #fff;
		box-shadow: -5px 0 18px rgba(0, 0, 0, .2);
		.title {
			padding: 20px 30px;
			background-color: #f9f9f9;
			font-size: 24px;
			border-bottom: 1px solid #ddd;
		}
		.panleMain {
			width: 100%;
			padding: 20px;
			height: calc(100% - 77px);
			overflow-x: hidden;
			box-sizing: border-box;
		}
		.el-select, .el-tree {
			width: 100%;
		}

		//时间
		.datetime-inline .el-form-item__content {
			display: flex;
		}
		.time-line {
			width: 29px;
			text-align: center;
		}
	}
</style>