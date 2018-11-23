<!--设备：新增、编辑、详情-->
<template>
	<div class="addEditDevice">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" size="medium" :disabled="propType == 3">
			<!-- 基础信息 -->
			<div class="border">
				<div class="tittle">基础信息</div>
				<el-row :gutter="50">
					<el-col :span="8">
						<el-form-item label="编号：" prop="dvcNo">
							<el-input v-model.trim="formData.dvcNo" placeholder="请输入设备编号" maxlength="30" :disabled="propType == 2"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="名称：" prop="dvcName">
							<el-input v-model.trim="formData.dvcName" placeholder="请输入设备名称" maxlength="30" :clearable="propType != 3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="区域：" prop="zoneId">
							<el-select v-model="formData.zoneId" placeholder="请选择区域" filterable @change="zoneChange" :clearable="propType != 3">
								<el-option :label="item.zoneName" :value="item.zoneId" v-for="item in zoneArr" :key="item.zoneId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="分组：" prop="groupId">
							<el-select v-model="formData.groupId" placeholder="请选择分组" filterable :clearable="propType != 3">
								<el-option :label="item.groupName" :value="item.groupId" v-for="item in groupArr" :key="item.groupId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<!-- 非互联网 -->
					<el-col :span="8" v-if="!isInternet">
						<el-form-item label="IP地址：" prop="dvcIp">
							<el-input v-model.trim="formData.dvcIp" placeholder="请输入IP地址" maxlength="30" :clearable="propType != 3"></el-input>
						</el-form-item>
					</el-col>
					
					<!-- 互联网 -->
					<template v-if="isInternet">
						<el-col :span="8">
							<el-form-item label="登录账号：" prop="loginAccount">
								<el-input v-model.trim="formData.loginAccount" placeholder="请输入登录账号" :clearable="propType != 3"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="登录密码：" prop="loginPassword" class="password">
								<Password :password="formData.loginPassword" @getPassword="getPassword" placeholder="请输入登录密码"></Password>
							</el-form-item>
						</el-col>
					</template>

					<el-col :span="8">
						<el-form-item label="MAC地址：" prop="dvcMac">
							<el-input v-model.trim="formData.dvcMac" placeholder="请输入MAC地址" maxlength="30" :clearable="propType != 3"></el-input>
						</el-form-item>
					</el-col>
					
					<el-col :span="8">
						<el-form-item label="备注：" prop="dvcRemark" >
							<el-input v-model.trim="formData.dvcRemark" placeholder="请输入备注" maxlength="50" :clearable="propType != 3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>

			<!-- 资源与数据 -->
			<div class="border">
				<div class="tittle">资源与数据</div>
				<el-row :gutter="50">
					<el-col :span="8">
						<el-form-item label="交通类型：" prop="trafficTypeId">
							<el-select v-model="formData.trafficType" placeholder="请选择" filterable :clearable="propType != 3">
								<el-option :label="item" :value="index" v-for="(item, index) in trafficType" :key="index"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="动态页面：" prop="pageId">
							<el-select v-model="formData.pageId" placeholder="请选择" filterable :clearable="propType != 3">
								<el-option :label="item.pageName" :value="item.pageId" v-for="item in dvcGroupArr" :key="item.pageId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="数据源一：" prop="groupName">
							<el-select v-model="formData.roleNameId" placeholder="请选择" filterable :clearable="propType != 3">
								<el-option :label="item.roleName" :value="item.roleNameId" v-for="item in dvcGroupArr" :key="item.roleNameId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="显示自定义页面：">
							<el-select v-model="formData.customFid" placeholder="请选择" filterable :clearable="propType != 3">
								<el-option :label="item.fileDescription" :value="item.fileId" v-for="item in DIYPage" :key="item.fileId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="显示背景文件：">
							<el-select v-model="formData.backgroundFid" placeholder="请选择" filterable :clearable="propType != 3">
								<el-option :label="item.fileDescription" :value="item.fileId" v-for="item in background" :key="item.fileId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="数据源二：" prop="groupName">
							<el-select v-model="formData.roleNameId" placeholder="请选择" filterable :clearable="propType != 3">
								<el-option :label="item.roleName" :value="item.roleNameId" v-for="item in dvcGroupArr" :key="item.roleNameId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</div>

			<!-- 其他 -->
			<div class="border">
				<div class="tittle">其他</div>
				<el-row :gutter="50">
					<el-col :span="8">
						<el-form-item label="组合屏：" prop="groupFlag">
							<el-radio v-model="formData.groupFlag" label="1">是</el-radio>
  							<el-radio v-model="formData.groupFlag" label="0">否</el-radio>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="组内序号：" prop="groupIndex" v-if="formData.groupFlag == '1'">
							<el-input v-model.trim="formData.groupIndex" placeholder="请输入组内序号" maxlength="2" :clearable="propType != 3"></el-input>
						</el-form-item>
					</el-col>
					<template v-if="propType == 3">
						<el-col :span="8">
							<el-form-item label="位置描述：">
								<el-input v-model.trim="formData.locationDesc" placeholder="请输入位置描述信息"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="X坐标：">
								<el-input v-model.trim="formData.coordinateX" placeholder="请输入X坐标"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="Y坐标：">
								<el-input v-model.trim="formData.coordinateY" placeholder="请输入Y坐标"></el-input>
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</div>
		</el-form>
		<el-row type="flex" justify="center">
			<el-button @click="close">返回</el-button>
			<el-button @click="submit" type="primary" :disabled="propType == 3">保存</el-button>
		</el-row>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import { formatCheck } from '@/utils/utils';
	import { device } from "@/service/api";
	import Password from '@/components/password';
	export default {
		components: {
			Password
		},
		computed: {
			...mapState({
				isInternet: state => Number(state.globalParams.is_internet),
			}),

			/**
			 * 区域下的分组
			 */
			groupArr() {
				return this.groupAll.filter((val) => val.zoneId == this.formData.zoneId);
			}
		},
		data() {
			//设备编号校验
			let checkDvcNo = (rule, value, callback) => {
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
			//组内序号校验
			let checkGroupIndex = (rule, value, callback) => {
				if(!value) {
					return callback(new Error("请输入组内序号"));
				}
				let reg = formatCheck.isInteger(value);
				if(value != '0' && reg) {
					callback();
				}else {
					callback(new Error("请输入正整数"));
				}
			};
			return {
				propType: this.$route.query.type,
				formData: {},
				zoneArr: [],	//全部区域
				groupAll: [],	//全部分组
				trafficType: {},//交通类型
				DIYPage: [],	//自定义页面
				background: [],	//背景文件


				dvcGroupArr: [],

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
							validator: checkMAC,
							trigger: 'blur'
						}
					],
					groupIndex: [
						{	 
							required: true,
							validator: checkGroupIndex,
							trigger: 'blur'
						}
					],
				},
			}
		},
		methods: {
			...mapMutations(['POP_BREAD']),

			/**
			 * 获取下拉框数据
			 */
			async init() {
				//获取设备信息
				if(this.propType != 1) {
					this.getDeviceInfo();
				}

				this.disabled = this.propType == 2 ? true : false;
				let res = await device.getSelect();
				if(!res) return;

				this.zoneArr = res.data.zone;
				this.groupAll = res.data.deviceGroup;
				this.trafficType = res.data.trafficType;
				this.DIYPage = res.data.customPage;
				this.background = res.data.staticPage;
			},

			/**
			 * 获取设备信息
			 */
			async getDeviceInfo() {
				let res = await device.getDeviceInfo({
					dvcId: this.$route.query.id
				});
				if(!res) return;
				this.formData = res.data;
			},

			/**
			 * 选择区域 
			 */
			zoneChange(val) {
				this.$set(this.formData, 'groupId', null);
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;

				let res, tittle;
				if(this.propType == 1) {
					res = await device.addDevice(this.formData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await device.updateDevice(this.formData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.$message.success(tittle + '设备成功');
					this.close();
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
			 * 返回
			 */
			close() {
				this.$router.go(-1);
				this.POP_BREAD();
			}
		},
		created() {
			this.init();
		}
	}
</script>
<style lang="less">
	.addEditDevice {
		.border {
			margin: 60px 50px;
			position: relative;
			padding: 30px 50px 10px 30px;

			.tittle {
				position: absolute;
				top: -11px;
				left: 20px;
				background: #fff;
				padding: 0 10px;
			}
			.el-form-item {
				display: flex;
			}

			.el-form-item__content {
				flex: 1;
			}

			.el-form-item__label {
				width: 130px;
			}
		}
		
		.is-error:not(.password) .el-form-item__error {
			white-space: nowrap;
		}

		//自适应
		@media screen and (max-width: 1300px) {
			.border .el-form-item__label {
				width: 100px;
			}
		}

		@media screen and (max-height: 850px) {
			.border {
				margin-top: 50px;
				margin-bottom: 30px;
			}
		}

		.el-select {
			width: 100%;
		}

		.el-button {
			width: 130px;
			margin-right: 50px;
			margin-bottom: 20px;
		}

		.el-form-item__content {
			height: 36px;
		}
	}
</style>