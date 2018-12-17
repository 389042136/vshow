<!--修改密码-->
<template>
	<el-dialog title="修改密码" :close-on-click-modal="false" :visible.sync="dialogShow" width="600px" :before-close="dialogClose">
		<el-form @submit.native.prevent :model="dialogForm" :rules="rules" ref="dialogForm" label-width="130px">
			<el-form-item label="原密码" prop="oldPass">
				<Password :password="dialogForm.oldPass" @getPassword="getOldPass" placeholder="请输入原密码" @keydown.enter.native="submit"></Password>
			</el-form-item>
			<el-form-item label="新密码" prop="newPass">
				<Password :password="dialogForm.newPass" @getPassword="getNewPass" placeholder="请输入6-30位数字和字母" @keydown.enter.native="submit"></Password>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPass">
				<Password :password="dialogForm.checkPass" @getPassword="getCheckPass" placeholder="请再次输入密码" @keydown.enter.native="submit"></Password>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
            <el-button @click="dialogClose()">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
	</el-dialog>
</template>

<script>
	import { formatCheck, logout } from "@/utils/utils";
	import { indexFn } from "@/service/api";
	import Password from '@/components/password';
	export default {
		props: ['dialogShow'],
		components: {
			Password
		},
		data() {
			//密码校验
			let checkOldPass = (rule, value, callback) => {
				if(!value){
					return callback(new Error('请输入原密码'));
				}
				let reg = formatCheck.password(value);
				if(!reg) {
					callback(new Error('密码由6-30位数字、字母组成，不允许为纯数字或纯字母, 不允许输入空格'));
				} else {
					callback();
				}
			};
			//密码校验
			let checkNewPass = (rule, value, callback) => {
				if(!value){
					return callback(new Error('请输入新密码'));
				}
				let reg = formatCheck.password(value);
				if(!reg) {
					callback(new Error('密码由6-30位数字、字母组成，不允许为纯数字或纯字母, 不允许输入空格'));
				} else if(value == this.dialogForm.oldPass){
					callback(new Error('新旧密码不允许相同'));
                }else {
					callback();
				}
			};
			//确认密码校验
			let validatePass = (rule, value, callback) => {
				if(!value){
					return callback(new Error('请输入确认密码'));
				}
				if(value != this.dialogForm.newPass) {
					callback(new Error('两次输入密码不一致'));
				} else {
					callback();
				}
			};
			return {
				dialogForm: {
					oldPass: "",
					newPass: "",
					checkPass: ""
				},
				passType: {
					oldPass: true,
					newPass: true,
					checkPass: true
				},
				rules: {
					oldPass: [
						{
							required: true,
							validator: checkOldPass,
							trigger: "blur"
						}
					],
					newPass: [
						{
							required: true,
							validator: checkNewPass,
							trigger: "blur"
						}
					],
					checkPass: [
						{
							required: true,
							validator: validatePass,
							trigger: "blur"
						}
					]
				}
			};
		},
		methods: {
			async submit() {
				let flag = formatCheck.form(this, "dialogForm");
				if(!flag) return;
				
				let params = {
					oldPassword: this.dialogForm.oldPass,
					newPassword: this.dialogForm.newPass,
				};
				let res = await indexFn.updatePassword(params);
				if(res.status == '2001') {
					this.$message.error('原密码不正确');
					return;
				}
				if(res.status == this.$successCode) {
					this.$message.success('密码修改成功，请重新登录');
					logout();
				}else {
					this.$message.error('密码修改失败');
				}
			},

			/**
			 * 原密码
			 */
			getOldPass(val) {
				this.dialogForm.oldPass = val;
			},

			/**
			 * 新密码
			 */
			getNewPass(val) {
				this.dialogForm.newPass = val;
			},

			/**
			 * 确认密码
			 */
			getCheckPass(val) {
				this.dialogForm.checkPass = val;
			},

			/**
			 * 关闭弹框
			 */
			dialogClose() {
				this.$emit("dialogClose");
				this.$refs.dialogForm.resetFields(); 
			}
		},
	};
</script>

<style lang="less">

</style>