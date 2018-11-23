<!--背景资源编辑、新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="110px" :disabled="propType == 3">			
			<el-form-item label="资源描述：" prop="fileDescription">
				<el-input v-model.trim="formData.fileDescription" placeholder="请输入资源描述" maxlength="50" clearable></el-input>
			</el-form-item>
			<el-form-item label="备注：" prop="remark">
				<el-input type="textarea" :rows="6" placeholder="请输入备注信息，最多100个字符" maxlength="100" v-model.trim="formData.remark"></el-input>
			</el-form-item>
			<el-form-item label="资源类型：" :required="propType == 1 ? true : false">
				<el-select v-model="selectType" @change="fileArr = []" placeholder="请选择">
					<el-option label="图片" value="1"></el-option>
					<el-option label="视频" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="上传资源：" ref="mapUrl" class="uploadFile" :required="propType == 1 ? true : false">
				<el-upload action="" :accept="fileLimit" :show-file-list="false" multiple :auto-upload="false" :on-change="handleChange">
					<el-button slot="trigger" type="primary">选取文件</el-button>

					<!-- 选取文件列表 -->
					<ul class="el-upload-list el-upload-list--text">
						<li class="el-upload-list__item" v-for="file in fileArr" :key="file.uid">
							<span class="el-upload-list__item-name">
								<i class="el-icon-document"></i>{{ file.name }}
							</span>
							<i class="el-icon-close" @click="handleRemove(file.uid)"></i>
						</li>
					</ul>
					
					<!-- 提示 -->
					<div class="el-c-danger">
						<p>注意：</p>
						<template v-if="selectType == '1'">
							<p>1. 图片仅支持 {{ img.fileType[0] }}、{{ img.fileType[1] }}；</p>
							<p>2. 图片大小限制为 {{ img.maxFileSize }} M；</p>
							<p>3. 最多上传 {{ img.limit }} 张。</p>
						</template>
						<template v-if="selectType == '3'">
							<p>1. 视频仅支持 {{ video.fileType[0] }}；</p>
							<p>2. 视频大小限制为 {{ video.maxFileSize }} M；</p>
							<p>3. 最多上传 {{ video.limit }} 个。</p>
						</template>
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
		props: ['panleShow', 'panleData'],
		computed: {
			//上传参数
			fileLimit() {
				return  this.selectType == '1' ?  `image/${ this.img.fileType[0] },image/${ this.img.fileType[2] }` : `video/${ this.video.fileType[0] }`;
			},

			...mapState({
				bg_maxsize: state => Number(state.globalParams.upload_bg_maxsize),
				imgs_limit: state => Number(state.globalParams.upload_imgs_maxnum),
				video_maxsize: state => Number(state.globalParams.upload_video_maxsize),
			}),
		},
		data() {
			return {
				//上传参数
				img: {
					fileType: ['png', 'jpg', 'jpeg'],
					maxFileSize: '',
					limit: '',
					name: '图片'
				},
				video: {
					fileType: ['mp4'],
					maxFileSize: '',
					limit: 1,
					name: '视频'
				},
				selectType: '1',
				fileArr: [],	//临时存储选取的文件

				propShow: false,
				propType: 0,

				formData: {},
				rules: {
					fileDescription: [
						{
							required: true,
							message: '请输入资源描述',
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

				if(this.propType != 1) {
					this.selectType = this.formData.resourceType == 'img' ? '1' : (this.formData.resourceType == 'imgs' ? '2' : '3'); 
				}
			},

			/**
			 * 设置上传参数
			 */
			setUploadParams() {
				this.img.maxFileSize = this.bg_maxsize;
				this.img.limit = this.imgs_limit;
				this.video.maxFileSize = this.video_maxsize;
			},

			/**
			 * 选择文件， 缓存选取文件
			 */
			handleChange(file) {
				if(file.status != 'ready'){
					return;
				}

				let fileObj = this.selectType == '1' ? this.img : this.video;
				let flag = fileCheck(file, fileObj.fileType, fileObj.maxFileSize);
				if(!flag) return;

				//图片数量限制
				if(this.selectType == '1' && this.fileArr.length >= fileObj.limit) {
					this.$message.warning(`最多上传 ${ fileObj.limit } 张图片`);
					return;
				}

				//视频数量限制
				if(this.selectType == '3' && this.fileArr.length >= fileObj.limit) {
					this.$message.warning(`最多上传 ${ fileObj.limit } 个视频`);
					return;
				}
				this.fileArr.push(file.raw);
			},

			/**
			 * 移除文件
			 */
			handleRemove(id) {
				this.fileArr.forEach((item, index) => {
					if(item.uid == id) {
						this.fileArr.splice(index, 1);
					}
				});
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;

				let res,
					tittle,
					groupArr = this.$refs.deviceTree.$refs.deviceTree.getCheckedKeys(true).filter((val) => val >= 20000),
					params = {
						fileDescription: this.formData.fileDescription,
						remark: this.formData.remark || '',
						files: this.fileArr,
						resourceType: this.selectType,
						dvcIds: groupArr,
						type: 1
					};

				if(this.propType == 1) {
					if(this.fileArr.length == 0) {
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
					this.$message.success(tittle + '背景资源成功');
				}else {
					this.$message.error(tittle + '背景资源失败');
				}
			},

			/**
			 * 关闭弹框
			 */
			panleClose(flag) {
				this.$emit('panleClose', flag);
				this.propShow = false;
				this.$refs.formData.resetFields();
				this.fileArr = [];
				this.selectType = '1';
			},
		},
		created() {
			this.setUploadParams();
		},
		watch: {
			panleShow(val) {
				if(val) {
					this.init();
				}
			},
		}
	}
</script>
<style lang="less">
	
</style>