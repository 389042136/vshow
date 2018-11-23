<!--重置密码-->
<template>
	<el-dialog title="重置密码" :close-on-click-modal="false" :visible.sync="propDialogShow" width="600px" :before-close="dialogClose">
		<el-form @submit.native.prevent :model="dialogForm" :rules="rules" ref="dialogForm" label-width="80px">
			<el-form-item label="账号：">
				<el-input v-model.trim="dialogForm.account" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<Password :password="dialogForm.password" @getPassword="getPassword" @keydown.enter.native="submit"></Password>
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
	import { formatCheck } from '@/utils/utils';
	import { authManagement } from "@/service/api";
	import Password from '@/components/password';
	export default {
		props: ['dialogShow', 'dialogData'],
		components: {
			Password
		},
		data() {
			//密码校验
			let checkPassword = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请输入密码'));
				}
				let reg = formatCheck.password(value);
				if(!reg) {
					callback(new Error('密码由6-30位数字、字母组成，不允许为纯数字或纯字母，不允许输入空格'));
				} else {
					callback();
				}
			};
			return {
				dialogForm: {
					id: null,
					account: '',
					password: '',
				},
				propDialogShow: false,
				passType: true,
				rules: {
					password: [{
						required: true,
						validator: checkPassword,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			init() {
				let dialogData = Object.assign({}, this.dialogData);
				this.dialogForm.id = dialogData.id;
				this.dialogForm.account = dialogData.account;
				this.propDialogShow = this.dialogShow;
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'dialogForm');
				if(!flag) return;
				
				let params = {
					id: this.dialogForm.id,
					password: this.dialogForm.password,
				};
				let res = await authManagement.updateAccount(params);
				if(!res) return;
				
				if(res.status == this.$successCode) {
					this.$message.success('重置密码成功');
					this.dialogClose(true);
				}else {
					this.$message.error('重置密码失败');
				}
			},

			/**
			 * 接收密码
			 */
			getPassword(val) {
				this.$set(this.dialogForm, 'password', val);
			},

			/**
			 * 关闭弹框
			 */
			dialogClose(flag) {
				this.$emit("dialogClose", flag);
				this.propDialogShow = false;
				this.$refs.dialogForm.resetFields(); 
			}
		},
		watch: {
			dialogShow(val) {
				if(val) {
					this.init();
				}
			}
		}
	};
</script>
<style lang="less" scoped>

</style>