<!--测栏滑块组件-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="110px" :disabled="propType == 3">
			<!-- 绑定时，不显示 -->
			<template v-if="propType != 4">	
				<el-form-item label="编号：" prop="dvcNo">
					<el-input v-model.trim="formData.dvcNo" placeholder="请输入编号" maxlength="30" :disabled="disabled" clearable></el-input>
				</el-form-item>
				<el-form-item label="名称：" prop="dvcName">
					<el-input v-model.trim="formData.dvcName" placeholder="请输入名称" maxlength="30" clearable></el-input>
				</el-form-item>
			</template>
			
			<el-form-item label="区域：" prop="zoneId">
				<el-select v-model="formData.zoneId" placeholder="请选择区域" disabled>
					<el-option :label="item.zoneName" :value="item.zoneId" v-for="item in zoneArr" :key="item.zoneId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="分组名称：" prop="groupId">
				<el-select v-model="formData.groupId" placeholder="请选择分组" @change="getDeviceList" filterable clearable>
					<el-option :label="item.groupName" :value="item.groupId" v-for="item in groupData" :key="item.groupId"></el-option>
				</el-select>
			</el-form-item>
			
			<!-- 绑定时，显示设备 -->
			<template v-if="propType == 4">
				<el-form-item label="选择设备：" prop="dvcId">
					<el-select v-model="formData.dvcId" placeholder="请选择设备" filterable clearable>
						<el-option :label="item.dvcName" :value="item.dvcId" v-for="item in deviceList" :key="item.dvcId"></el-option>
					</el-select>
				</el-form-item>
			</template>

			<template v-if="propType != 4">
				<el-form-item label="IP地址：" prop="dvcIp" v-if="!isInternet">
					<el-input v-model.trim="formData.dvcIp" placeholder="请输入编号" clearable></el-input>
				</el-form-item>
				<template v-else>
					<el-form-item label="登录账号：" prop="loginAccount">
						<el-input v-model.trim="formData.loginAccount" placeholder="请输入账号" clearable></el-input>
					</el-form-item>
					<el-form-item label="登录密码：" prop="loginPassword" class="password">
						<Password :password="formData.loginPassword" @getPassword="getPassword"></Password>
					</el-form-item>
				</template>
				<el-form-item label="MAC地址：" prop="dvcMac">
					<el-input v-model.trim="formData.dvcMac" placeholder="请输入名称" clearable></el-input>
				</el-form-item>
				<el-form-item label="备注：" prop="dvcRemark">
					<el-input type="textarea" :rows="6" v-model.trim="formData.dvcRemark" maxlength="100" placeholder="请输入设备描述信息"></el-input>
				</el-form-item>
			</template>
			
			<el-form-item label="位置描述：" prop="locationDesc">
				<el-input type="textarea" :rows="6" v-model.trim="formData.locationDesc" maxlength="100" placeholder="请输入位置描述信息"></el-input>
			</el-form-item>
			<el-form-item label="X坐标：" prop="coordinateX">
				<el-input v-model.trim="formData.coordinateX" disabled></el-input>
			</el-form-item>
			<el-form-item label="Y坐标：" prop="coordinateY">
				<el-input v-model.trim="formData.coordinateY" disabled></el-input>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import { formatCheck } from '@/utils/utils';
	import { device } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	import Password from '@/components/password';
	export default {
		components: {
			InfoPanle,
			Password
		},
		props: ['service'],
		computed: {
			...mapState({
				isInternet: state => Number(state.globalParams.is_internet),
			}),

			groupData() {
				return this.groupArr.filter((val) => val.zoneId == this.formData.zoneId);
			},
		},
		data() {
			//设备编号校验
			let checkDvcNo= (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请输入设备编号'));
				}
				let patrn = /^[a-zA-Z][0-9a-zA-Z-_]{0,29}$/;
				if(!patrn.test(value)) {
					callback(new Error('由1-30位的字母/数字/_/-组成，以字母开头'));
				} else {
					callback();
				}
			};
			//账号校验
			let checkAccount = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请输入登录账号'));
				}
				let reg = formatCheck.account(value);
				if(!reg) {
					callback(new Error('由6-30位的字母/数字/_/-组成，以字母开头'));
				} else {
					callback();
				}
			};
			//密码校验
			let checkPassword = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请输入登录密码'));
				}
				let reg = formatCheck.password(value);
				if(!reg) {
					callback(new Error('由6-30位数字、字母组成，不允许为纯数字或纯字母, 不允许输入空格'));
				} else {
					callback();
				}
			};
			//IP校验
			let checkIP = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('请输入设备IP'));
				}
				let reg = formatCheck.isIP(value);
				if(!reg) {
					callback(new Error('IP格式不正确'));
				} else {
					callback();
				}
			};
			//MAC校验
			let checkMAC = (rule, value, callback) => {
				if(!value) {
					return callback();
				}
				let reg = formatCheck.isMAC(value);
				if(!reg) {
					callback(new Error('MAC格式不正确'));
				} else {
					callback();
				}
			};
			return {
				propShow: false,
				propType: 0,
				passType: true,
				disabled: true,

				formData: {},	//表单
				zoneArr: [],	//区域
				groupArr: [],	//分组
				deviceList: [],	//设备
				
				rules: {
					dvcNo: [
						{	 
							required: true,
							validator: checkDvcNo,
							trigger: 'blur'
						}
					],
					dvcName: [
						{
							required: true,
							message: '请输入设备名称',
							trigger: 'blur'
						}
					],
					zoneId: [
						{
							required: true,
							message: '请选择设备区域',
							trigger: 'change'
						}
					],
					groupId: [
						{
							required: true,
							message: '请选择设备分组',
							trigger: 'change'
						}
					],
					dvcId: [
						{
							required: true,
							message: '请选择设备',
							trigger: 'change'
						}
					],
					dvcIp: [
						{
							required: true,
							validator: checkIP,
							trigger: 'blur'
						}
					],
					loginAccount: [
						{
							required: true,
							validator: checkAccount,
							trigger: 'blur'
						}
					],
					loginPassword: [
						{
							required: true,
							validator: checkPassword,
							trigger: 'blur'
						}
					],
					dvcMac: [
						{
							required: false,
							validator: checkMAC,
							trigger: 'blur'
						}
					],
				},
			}
		},
		methods: {
			init(data) {
				this.formData = Object.assign({}, data.data);
				this.formData.zoneId = this.$parent.deviceGroup.zoneId;

				this.propType = data.type;
				this.disabled = this.propType == 2 ? true : false;
				this.propShow = true;
			},

			/**
			 * 绑定，选择分组获取设备
			 */
			async getDeviceList(groupId) {
				if(this.propType == 4) {
					this.$set(this.formData, 'dvcId', null);
					let params = {
						queryData: { groupId },
						currentPage: 1,
						pageSize: 1000,
					};
					let res = await device.getDeviceList(params);
					if(!res) return;
					this.deviceList = res.data.returnDatas;
				}
			},

			/**
			 * 获取下拉框数据
			 */
			async getAllData() {
				let res = await device.getSelect();
				if(!res) return;

				this.zoneArr = res.data.zone;
				this.groupArr = res.data.deviceGroup;
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;

				let res, tittle;
				if(this.propType == 1) {
					res = await this.service.add(this.formData);
					tittle = '新增';
				}else if(this.propType == 2 || this.propType == 4){
					res = await this.service.updata(this.formData);
					tittle = this.propType == 2 ? '编辑' : '绑定';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.$message.success(tittle + '设备成功');
					this.panleClose(true);
				}else {
					this.$message.error(tittle + '设备失败');
				}
			},

			/**
			 * 接收密码
			 */
			getPassword(val) {
				this.$set(this.formData, 'loginPassword', val);
			},

			/**
			 * 关闭弹框
			 */
			panleClose(flag) {
				this.$emit('panleClose', flag);
				this.propShow = false;
				this.$refs.formData.resetFields();
				this.deviceList = [];
			},
		},
		created(){
			this.getAllData();
		},
		mounted() {
			this.$transfer.$on('panleShow', data => this.init(data));
		},
	}
</script>
<style lang="less">
	.position .is-error.password {
		margin-bottom: 28px;
	}
</style>