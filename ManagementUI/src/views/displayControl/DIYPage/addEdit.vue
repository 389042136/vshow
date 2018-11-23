<!--自定义页面编辑、新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="110px" :disabled="propType == 3">			
			<el-form-item label="文件描述：" prop="fileDescription">
				<el-input placeholder="请输入描述内容" maxlength="50" v-model.trim="formData.fileDescription"></el-input>
			</el-form-item>
			<el-form-item label="显示时间：" required class="datetime-inline">
				<el-date-picker v-model="formData.startTime" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm"></el-date-picker>
				<span class="time-line">--</span>
				<el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm"></el-date-picker>
			</el-form-item>
			<el-form-item label="备注：" prop="remark">
				<el-input type="textarea" :rows="6" placeholder="请输入备注，最多100个字符" maxlength="100" v-model.trim="formData.remark"></el-input>
			</el-form-item>
			<el-form-item label="上传文件：" ref="mapUrl" class="uploadFile" :required="propType == 1 ? true : false">
				<el-upload action="" :show-file-list="false" :auto-upload="false" :on-change="handleChange">
					<el-button slot="trigger" type="primary">选取文件</el-button>
					<span class="file-name">{{ fileName }}</span>
					<div class="el-c-danger">
						<p>注意：</p>
						<p>1. 文件大小限制为 {{ maxFileSize }} M；</p>
						<p>2. 所有文件压缩到一个 {{ fileType[0] }} 文件中，并且在压缩文件中均处于第一级别；</p>
						<p>3. 若有多个页面，主页面名称须为 'index.html'。</p>
					</div>
				</el-upload>
			</el-form-item>
			<el-form-item label="选择显示设备：">
				<DeviceTree ref="deviceTree" :checked="formData.dvcIds"></DeviceTree>
			</el-form-item>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { mapState } from 'vuex';
	import { formatCheck, fileCheck } from "@/utils/utils";
	import { displayControlManagement } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	import DeviceTree from "../deviceTree";
	export default {
		components: {
			InfoPanle,
			DeviceTree
		},
		computed: {
			...mapState({
				maxFileSize: state => Number(state.globalParams.upload_staticpage_maxsize),
			}),
		},
		props: ['panleShow', 'panleData'],
		data() {
			return {
				//上传参数
				fileType: ['zip'],

				propShow: false,
				propType: 0,

				formData: {},
				fileName: '',
				rules: {
					fileDescription: [
						{
							required: true,
							message: '请输入文本内容',
							trigger: 'blur'
						}
					],
				},
			}
		},
		methods: {
			init() {
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
			},

			/**
			 * 选择文件，检验文件名、大小
			 */
			handleChange(file, fileList) {
				if(file.status != 'ready'){
					return;
				}
				
				//校验文件格式
				let flag = fileCheck(file, this.fileType, this.maxFileSize);
				if(!flag) return;

				this.fileName = file.name;
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;

				if(!this.formData.startTime || !this.formData.endTime) {
					this.$message.warning('请选择显示的开始和结束时间');
					return;
				}
				
				if(this.formData.startTime > this.formData.endTime){
					this.$message.error('开始时间不能大于结束时间');
					return;
				}

				let res,
					tittle,
					file = document.querySelector('.el-upload__input[type="file"]').files[0],
					groupArr = this.$refs.deviceTree.$refs.deviceTree.getCheckedKeys(true).filter((val) => val >= 20000),
					params = {
						fileDescription: this.formData.fileDescription,
						startTime: this.formData.startTime,
						endTime: this.formData.endTime,
						remark: this.formData.remark || '',
						file: file || null,
						dvcIds: groupArr,
						type: 2
					};
				if(this.propType == 1) {
					if(this.fileName == '') {
						this.$message.warning('请选择上传文件');
						return;
					}
					res = await displayControlManagement.addStatciFile(params);
					tittle = '新增';
				}else if(this.propType == 2){
					params.fileId = this.formData.fileId;
					res = await displayControlManagement.updateStatciFile(params);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '自定义页面成功');
				}else {
					this.$message.error(tittle + '自定义页面失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			panleClose(flag) {
				this.$emit('panleClose', flag);
				this.propShow = false;
				this.$refs.formData.resetFields();
				this.fileName = '';
				document.querySelector('.el-upload__input[type="file"]').value = '';
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
	
</style>