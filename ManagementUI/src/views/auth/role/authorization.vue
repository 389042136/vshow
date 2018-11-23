<!--角色授权-->
<template>
	<el-dialog title="角色授权" :close-on-click-modal="false" :visible.sync="propDialogShow" width="600px" :before-close="dialogClose">
		<el-form @submit.native.prevent :model="dialogForm" ref="dialogForm" label-width="100px">
			<el-form-item label="角色名称：" prop="roleName">
				<el-input v-model.trim="dialogForm.roleName" disabled></el-input>
			</el-form-item>
			<el-form-item class="authTree" label="授权：" required>
				<el-tree ref="authModules" show-checkbox
					node-key="id"  
					:data="dialogForm.modules" 
					:default-checked-keys="dialogForm.operationArr" 
					:default-expanded-keys="dialogForm.expandedArr">
				</el-tree>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
            <el-button @click="dialogClose()">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
	</el-dialog>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import { authManagement } from "@/service/api";

	export default {
		props: ['dialogShow', 'dialogData'],
		computed: {
			...mapState(['allAuth']),
		},
		data() {
			return {
				dialogForm: {
					id: null,
					roleName: '',
					expandedArr: [0],
					modules: [{
						id: 0,
						label: '全部',
						children: [],
					}],
				},
				propDialogShow: false,
			};
		},
		methods: {
			init() {
				let dialogData = Object.assign({}, this.dialogData);
				this.dialogForm.id = dialogData.id;
				this.dialogForm.roleName = dialogData.roleName;

				//复选框
				if(this.$refs.authModules) {
					this.$refs.authModules.setCheckedKeys(dialogData.operationArr);
				}else {
					this.dialogForm.operationArr = dialogData.operationArr;
				}
				this.propDialogShow = this.dialogShow;
				//默认第一级展开
				/* if(dialogData.operationArr.length > 0) {
					this.dialogForm.expandedArr = dialogData.operationArr;

					//二次复选
					if(this.$refs.authModules) {
						this.$refs.authModules.setCheckedKeys(dialogData.operationArr);
					}
				} else {
					this.dialogForm.expandedArr = [0];
				} */
			},

			/**
			 * 确定
			 */
			async submit() {
				let	operationArr = this.$refs.authModules.getCheckedKeys(true);
				if(operationArr.length < 1) {
					this.$message.warning('授权不允许为空');
					return;
				}
				let params = {
					id: this.dialogForm.id,
					operation: operationArr,
				};
				let res = await authManagement.setAuth(params);
				if(!res) return;
				
				if(res.status == this.$successCode) {
					this.$message.success('授权成功');
					this.dialogClose(true);
				}else {
					this.$message.error('授权失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			dialogClose(flag) {
				this.$emit("dialogClose", flag);
				this.propDialogShow = false;

				//清空勾选的节点
				//this.$refs.authModules.setCheckedKeys([]);

				//收缩tree
				//this.$refs.authModules.store._getAllNodes().forEach(item => item.expanded = false);
			}
		},
		created() {
			this.dialogForm.modules[0].children = this.allAuth;
		},
		watch: {
			dialogShow(val) {
				if(val) {
					this.init();
				}
			},
			allAuth(val) {
				this.dialogForm.modules[0].children = val;
			}
		},
	};
</script>
<style lang="less">
	.authTree {
		margin-bottom: 0;
		
		.el-form-item__content {
			max-height: 520px;
			min-height: 150px;
			overflow: auto;
		}
	}
</style>