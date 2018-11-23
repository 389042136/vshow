<template>
	<div id="login">
		<!-- 输入框 -->
		<div class="login-box">
			<h1>GTC后台管理系统</h1>
			<el-form @submit.native.prevent :label-position="'left'" :model="loginForm" class="login-from" :rules="rules" ref="loginForm" label-width="0px">
				<el-form-item label="" prop="userName" size="large">
					<el-input type="text" prefix-icon="fa fa-user-circle-o" placeholder="请输入用户名" v-model.trim="loginForm.userName"></el-input>
				</el-form-item>
				<el-form-item label="" prop="password" size="large">
					<Password :password="loginForm.password" :icon="true" @getPassword="getPassword"></Password>
				</el-form-item>
				<el-form-item label="" prop="verification" ref="verification" size="large">
					<el-input placeholder="请输验证码" prefix-icon="fa fa-code" v-model.trim="loginForm.verification" @keydown.enter.native="submit">
						<template slot="append">
							<div @click="createCode" class="verification">
								<SIdentify :identifyCode="loginForm.checkCode"></SIdentify>
							</div>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="login-but" type="primary" @click="submit">登录</el-button>
				</el-form-item>
				<el-form-item>
					<el-row type="flex" justify="space-between" class="password-con">
						<div>
							<el-switch v-model="rememberPwd" @change="isRememberPwd"></el-switch>
							<span class="rememberPwd">记住密码</span>
						</div>
						<div class="forgetPwd" @click="forgetPwd">忘记密码？</div>
					</el-row>
				</el-form-item>
			</el-form>
		</div>

		<!-- 轮播图 -->
		<el-carousel height="100%" :interval="background.time * 1000" class="slide">
			<el-carousel-item v-for="(item, index) in background.imgArr" :key="index">
				<img :src="require('@/assets/images/login/' + item)"/>
			</el-carousel-item>
		</el-carousel>
		
		<!-- navbar navbar-default -->
		<nav class="info">西安悦泰科技有限责任公司</nav>
	</div>
</template>
<script>
	import { formatCheck }from "@/utils/utils";
	import { indexFn } from "@/service/api";
	import SIdentify from './identify';
	import Password from '@/components/password';

	let Base64 = require('js-base64').Base64;
	export default {
		components: { 
			SIdentify,
			Password
		},
		data() {
			//账号校验
			let checkAccount = (rule, value, callback) => {
				if(!value){
					return callback(new Error('请输入账号'));
				}
				let reg = formatCheck.account(value);
				if(!reg) {
					callback(new Error('输入的帐号格式不正确'));
				} else {
					callback();
				}
			};
			//密码校验
			let checkPass = (rule, value, callback) => {
				if(!value){
					return callback(new Error('请输入密码'));
				}
				let reg = formatCheck.password(value);
				if(!reg) {
					callback(new Error('输入的密码格式不正确'));
				} else {
					callback();
				}
			};
			//验证码校验
			let checkVer = (rule, value, callback) => {
				if(!value){
					return callback(new Error('请输入4位的验证码'));
				}
				let reg = this.loginForm.checkCode.toLowerCase() == value.toLowerCase();
				if(!reg) {
					this.createCode();
					callback(new Error('验证码错误'));
				} else {
					callback();
				}
			};
			return {
				loginForm: {
					userName: '',
					password: '',
					verification: '',
					checkCode: '',
					codeLength: 4 //验证码的长度
				},
				background: {
					imgArr: ["bg_img_1.jpg", "bg_img_2.jpg", "bg_img_3.jpg"],
					time: 10,
				},
				rememberPwd: false,
				passType: true,
				rules: {
					userName: [
						{
							required: true,
							validator: checkAccount,
							trigger: "blur"
						}
					],
					password: [
						{
							required: true,
							validator: checkPass,
							trigger: "blur"
						}
					],
					verification: [
						{
							required: true,
							validator: checkVer,
							trigger: "blur"
						}
					]
				}
			};
		},
		methods: {
			/**
			 * 初始化
			 */
			init() {
				this.createCode();
				let accountInfo = localStorage.getItem('accountInfo');
				if(accountInfo) {
					let accountObj = JSON.parse(Base64.decode(accountInfo));
					this.loginForm.userName = accountObj.userName;
					this.loginForm.password = accountObj.password;
					this.rememberPwd = accountObj.rememberPwd;
				}
			},

			/**
			 * 登录
			 */
			async submit() {
				let flag = formatCheck.form(this, "loginForm");
				if(!flag) return;
				
				let params = {
					account: this.loginForm.userName,
					password: this.loginForm.password
				};
				let res = await indexFn.login(params);
				if(!res) {
					this.clear();
					return;
				};
				
				if(res.status == this.$successCode) {
					this.saveLocal(this.loginForm);
					this.$router.push("/");
				}else {
					this.$message.error('登录失败');
				}
			},

			/**
			 * 本地保存数据
			 */
			saveLocal(data) {
				localStorage.setItem("token", Base64.encode(data.password));
				if(this.rememberPwd) {
					let accountInfo =JSON.stringify({
						userName: data.userName,
						password: data.password,
						rememberPwd: this.rememberPwd
					});
					localStorage.setItem('accountInfo', Base64.encode(accountInfo));
				}else {
					localStorage.removeItem('accountInfo');
				}
			},

			/**
			 * 图片验证码
			 */
			createCode() {
				let code = "";
				let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; //随机数
				for(let i = 0; i < this.loginForm.codeLength; i++) {
					//循环操作
					let index = Math.floor(Math.random() * 62); //取得随机数的索引（0~61）
					code += random[index]; //根据索引取得随机数加到code上
				}
				this.loginForm.checkCode = code; //把code值赋给验证码
			},

			/**
			 * 接收密码
			 */
			getPassword(val) {
				this.$set(this.loginForm, 'password', val);
			},

			/**
			 * 记住密码
			 */
			isRememberPwd(val) {
				this.rememberPwd = val;
			},

			/**
			 * 忘记密码
			 */
			forgetPwd() {
				this.$message.warning('请您联系管理员重置登录密码！');
			},

			/**
			 * 重置密码，验证码
			 */
			clear() {
				this.$refs.loginForm.resetFields();
				this.createCode();
			}
		},
		created() {
			this.init();
		},
	}
</script>
<style lang="less">
	#login {
		height: 100%;
		overflow: hidden;
		position: relative;

		/* 轮播图  */
		.slide {
			width: 100%;
			height: 100%;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.info {
			width: 100%;
			position: absolute;
			z-index: 2;
			bottom: 25px;
			font-size: 16px;
			text-align: center;
		}
		.login-box {
			position: absolute;
			width: 320px;
			height: 400px;
			z-index: 99;
			border-radius: 8px;
			right: 17%;
			top: 20%;
			background: rgba(0, 0, 0, 0.4);
			padding: 40px 30px;
			box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
			h1 {
				font-size: 22px;
				padding-bottom: 10px;
				color: #fff;
				border-bottom: 2px solid #c0c4cc;
			}
		}
		.login-from {
			margin-top: 34px;
			.showPass {
				line-height: 40px;
			}
		}
		.el-form-item {
			margin-bottom: 29px;
		}
		.el-input {
			font-size: 16px;
		}
		.login-but {
			width: 100%;
			margin-top: 10px;
			line-height: 20px;
			border-radius: 5px;
			box-shadow: 0 5px 20px rgba(5, 126, 255, 0.3);
		}
		.el-input-group__append {
			padding: 0;
		}
		.verification {
			width: 140px;
			height: 38px;
			cursor: pointer;
		}
		.password-con {
			color: #ffffff;
		}
		.rememberPwd {
			margin-left: 5px;
		}
		.forgetPwd {
			border-bottom: 1px solid #fff;
			cursor: pointer;
		}
	}
</style>