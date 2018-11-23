<!--测栏滑块组件-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="90px" :disabled="propType == 3">
			<el-form-item label="账号：" prop="account">
				<el-input v-model.trim="formData.account" placeholder="请输入账号" :disabled="disabled" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码：" prop="password" v-if="propType == 1">
				<Password :password="formData.password" @getPassword="getPassword"></Password>
			</el-form-item>
			<el-form-item label="角色：" prop="roleId">
				<el-select v-model="formData.roleId" placeholder="请选择" clearable>
					<el-option :label="item.roleName" :value="item.id" v-for="item in roleArr" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="姓名：" prop="name">
				<el-input v-model.trim="formData.name" placeholder="请输入姓名" @keydown.enter.native="submit" clearable maxlength="30"></el-input>
			</el-form-item>
			<el-form-item label="手机：" prop="mobile">
				<el-input v-model.trim="formData.mobile" placeholder="请输入手机号码" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
			<el-form-item label="Email：" prop="email">
				<el-input v-model.trim="formData.email" placeholder="请输入Email地址" maxlength="50" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { formatCheck } from '@/utils/utils';
	import { authManagement } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	import Password from '@/components/password';
import { debug } from 'util';
	export default {
		components: {
			InfoPanle,
			Password
		},
		props: ['panleShow', 'panleData'],
		data() {
			//账号校验
			let checkAccount = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请输入账号'));
				}
				let reg = formatCheck.account(value);
				if(!reg) {
					callback(new Error('账号由6-30位的字母、数字、下划线或中间线组成，并以字母开头'));
				} else {
					callback();
				}
			};
			//密码校验
			let checkPassword = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请输入密码'));
				}
				let reg = formatCheck.password(value);
				if(!reg) {
					callback(new Error('密码由6-30位数字、字母组成，不允许为纯数字或纯字母, 不允许输入空格'));
				} else {
					callback();
				}
			};
			//手机号校验
			let checkTel = (rule, value, callback) => {
				let reg = formatCheck.isTel(value);
				if(value && !reg) {
					callback(new Error("手机号格式不正确"));
				} else {
					callback();
				}
			};
			return {
				propShow: false,
				propType: 0,
				formData: {},
				disabled: false,
				passType: true,
				roleArr: [],
				rules: {
					account: [{
						required: true,
						validator: checkAccount,
						trigger: 'blur'
					}],
					password: [{
						required: true,
						validator: checkPassword,
						trigger: 'blur'
					}],
					roleId: [{
						required: true,
						message: '请选择角色',
						trigger: 'change'
					}],
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					mobile: [{
						required: false,
						validator: checkTel,
						trigger: 'blur'
					}],
					email: [{
						required: false,
						type: 'email',
						message: 'Email格式不正确',
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			init() {
				this.$refs.formData.resetFields();
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.disabled = this.propType == 2 ? true : false;
				this.propShow = this.panleShow;
			},

			/**
			 * 获取所有角色
			 */
			async getAllRole() {
				let res = await authManagement.getAllRole();
				if(res) this.roleArr = res.data;
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;
				
				if(!(this.formData.mobile || this.formData.email)) {
					this.$message.warning('手机号和Email至少填写一项');
					return;
				} 

				let res, tittle;
				if(this.propType == 1) {
					res = await authManagement.addAccount(this.formData);
					tittle = '新增';
				}else if(this.propType == 2){
					delete this.formData.password;
					res = await authManagement.updateAccount(this.formData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '账号成功');
				}else {
					this.$message.error(tittle + '账号失败');
				}
			},

			/**
			 * 接收密码
			 */
			getPassword(val) {
				this.$set(this.formData, 'password', val);
			},

			/**
			 * 关闭弹框
			 */
			panleClose(flag) {
				this.$emit('panleClose', flag);
				this.propShow = false;
				this.$refs.formData.resetFields();
			},
		},
		watch: {
			panleShow(val) {
				if(val) {
					this.init();
				}
			}
		},
		created(){
			this.getAllRole();
		}
	}
</script>
<style lang="less">
	#account .infoPanle .el-form-item {
		margin-bottom: 32px;
	}
</style>