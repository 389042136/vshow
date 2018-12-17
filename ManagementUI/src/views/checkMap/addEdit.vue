<!--设施类型编辑，新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit" class="uploadMap">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="柜台编号:" prop="checkinNumOfCounter">
				<el-input :disabled="propType == 2" v-model.trim="formData.checkinNumOfCounter" placeholder="请输入柜台编号" clearable maxlength="20"></el-input>
			</el-form-item>
			<el-form-item label="柜台名称:" prop="checkinInfoOfCounter">
				<el-input v-model.trim="formData.checkinInfoOfCounter"  placeholder="请输入柜台名称"  maxlength="20"></el-input>
			</el-form-item>
			<el-form-item label="柜台方位:" prop="checkinNorthOrSouth">
			    <el-select v-model="formData.checkinNorthOrSouth" placeholder="请选择柜台方位" clearable> 
					<el-option :label="item" :value="item" 
					v-for="item in checkDirection" :key="item"></el-option>
                 </el-select>
			</el-form-item>
			<el-form-item label="柜台模式:" prop="checkinModelCounter">
			    <el-select v-model="formData.checkinModelCounter" placeholder="请选择柜台模式" clearable> 
					<el-option :label="item" :value="item" 
					   v-for="item in checkModel" :key="item"></el-option>
                 </el-select>
			</el-form-item>
			<el-form-item label="所属航空公司:" prop="checkinAirlineIata">
				<el-input v-model.trim="formData.checkinAirlineIata" clearable
				  placeholder="请输入航空公司IATA码"  maxlength="2"></el-input>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>
<script> 
	import { mapState } from 'vuex';
	import { checkManagement } from "@/service/api";
	import { formatCheck } from "@/utils/utils";
	import InfoPanle from "@/components/infoPanle";
	export default {
		components: {
			InfoPanle
		},
		computed: {
			...mapState({
				maxFileSize: state => Number(state.globalParams.upload_type_icon_maxsize),
			}),
		},
		props: ['panleShow', 'panleData'],
		data() {
			let checkinNumOfCounter = (rules, value, callback) => {
				if(!value){
					return callback("请输入柜台编码"); 
				}
				var regu = /(^[0-9]+[\~][0-9]+$)|(^[0-9]+$)/;
                if(regu.test(value)){
					 callback();
				}
				else{
					return callback('只能输入数字或"数字~数字"格式'); 
				}
			}
			let	checkinAirlineIata = (rules, value, callback) =>{
				if(!value) {
					return 
				}
				var regu = /^[0-9A-Z]{2}$/; 
				if (regu.test(value)) { 
					return callback(); 
				} else { 
					return callback("只能输入两位大写字母、数字组合"); 
				} 
			}
			return {
				formData: {},
				propShow: false,
				propType: 0,
				checkModel: [],
				checkDirection:[],
				rules: {
					checkinNumOfCounter: [{
						required: true,
						trigger: 'blur',
						validator: checkinNumOfCounter
					}],
					checkinInfoOfCounter: [{
						required: true,
						message: '请输入柜台名称',
						trigger: 'blur'
					}],
					checkinNorthOrSouth: [{
						required: true,
						message: '请选择柜台方位',
						trigger: 'blur'
					}],
					checkinModelCounter: [{
						required: true,
						message: '请选择柜台模式',
						trigger: 'blur'
					}],
					checkinAirlineIata: [{
						trigger: 'blur',
						validator: checkinAirlineIata
					}]
				},
			}
		},
		methods: {
			init() {
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
				 this.getModel();
			},
			/**
			 * 查询已有柜台模式
			 */
			async getModel(){
				let res = await checkManagement.getCheckModel();
				if(res && res.data == null) {
					return;
				}
				this.checkModel = res.data.checkinTypeOfModel;
				this.checkDirection = res.data.checkinTypeOfDirection;
			},
			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;
				
				let res, tittle;
				if(this.propType == 1) {
					if(this.formData.checkinAirlineIata == ''){
					this.formData.checkinAirlineIata = null; 
				}
					res = await checkManagement.insertCheckIn(this.formData);
					tittle = '新增';
				}else {	
					res = await checkManagement.updateCheckIn(this.formData);
					tittle = '编辑';
				}
				if(!res) return;
				//res.status == this.$successCode
				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '值机柜台成功');
				}else {
					this.$message.error(res.message);
				}
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
		}
	}
</script>
<style lang="less">
	.uploadMap {
		.uploadFile {
			.el-form-item__content {
				position: relative;
			}
			.el-form-item__error{
				position: absolute;
				top: 9px;
				left: 92px;
			}
		}
	}
</style>