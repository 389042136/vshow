<!--全局参数配置-->
<template>
	<div class="airportInfo">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="280px">
            <el-form-item label="秘钥：">
				<el-input v-model.trim="formData.secretKey" disabled></el-input>
            </el-form-item>
			<el-form-item label="设备数量（个）：">
				<el-input v-model.trim="formData.deviceNumber" disabled></el-input>
            </el-form-item>
			 <el-form-item label="支持的交通方式：">
				<el-checkbox disabled checked v-for="(item, index) in formData.trafficTypeArr" :key="index">{{ item }}</el-checkbox>
            </el-form-item>
            <el-form-item label="账号每天登录上限次数：" prop="loginMaxCount">
                <el-input v-model.trim="formData.loginMaxCount" placeholder="请输入账号每天登录上限次数" clearable maxlength="4"></el-input>
				<span class="el-c-info">0表示不受限制</span>
            </el-form-item>
            <el-form-item label="管理平台每页显示行数：" prop="pageSize">
                <el-input v-model.trim="formData.pageSize" placeholder="请输入每页显示行数" clearable maxlength="3"></el-input>
            </el-form-item>
            <el-form-item label="显示设备多语言切换时间（秒）：" prop="switchTime">
                <el-input v-model.trim="formData.switchTime" placeholder="请输入多语言切换时间" clearable maxlength="3"></el-input>
            </el-form-item>
			<el-form-item label="监控设备连接状态间隔时间（秒）：" prop="reconnectTime">
				<el-input v-model.trim="formData.reconnectTime" placeholder="请输入连接状态间隔时间" clearable maxlength="3"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button size="medium" @click="submit" type="primary">保存</el-button>
			</el-form-item>
        </el-form>
	</div>
</template>

<script>
	import { airportInfo } from "@/service/api";
	import { formatCheck } from '@/utils/utils';
	export default {
		data() {
			//整数校验
			let checkNum = (rule, value, callback) => {
				let reg = formatCheck.isInteger(value);
				if(!reg){
					callback(new Error("请输入非负整数"));
				}else{
					callback();
				}
			};
			//正整数校验
			let checkInteger = (rule, value, callback) => {
				let reg = formatCheck.isInteger(value);
				if(value == '0' || !reg){
					callback(new Error("请输入正整数"));
				}else{
					callback();
				}
			};
			return {
				//表单
				formData: {},
				rules: {
					loginMaxCount: [
						{ 
							required: true, 
							message: '请输入账号每天登录上限次数', 
							trigger: 'blur' 
						},
						{
							validator: checkNum,
							trigger: 'blur'
						}
					],
					pageSize: [
						{ 
							required: true, 
							message: '请输入每页显示行数', 
							trigger: 'blur' 
						},
						{
							validator: checkInteger,
							trigger: 'blur'
						}
					],
					switchTime: [
						{ 
							required: true, 
							message: '请输入多语言切换时间', 
							trigger: 'blur' 
						},
						{ 
							validator: checkInteger,
							trigger: 'blur' 
						}
					],
					reconnectTime: [
						{ 
							required: true, 
							message: '请输入连接状态间隔时间', 
							trigger: 'blur' 
						},
						{ 
							validator: checkInteger,
							trigger: 'blur' 
						}
					]
				}
			}
		},
		methods: {
			/**
			 * 查询
			 */
			async getData() {
				let res = await airportInfo.getConfig();
				if(res) {
					this.formData = res.data;
				}
			},

			/**
			 * 保存
			 */
			async submit(params) {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;

				let res = await airportInfo.setConfig(this.formData);
				if(!res) return;
				
				if(res.status == this.$successCode) {
					this.$message.success('修改成功');
				}else {
					this.$message.error('修改失败');
				}
			},
		},
		created() {
			this.getData();
		}
	}
</script>
<style lang="less" scoped>
	.airportInfo{
		padding-top: 50px;
		padding-left: 30px;
	}
	.el-input{
		width: 220px;
		margin-right: 10px;
	}
</style>