<!--角色编辑、新增-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="酒店名称(中文)：" prop="hotelNameCh" >
				<el-input v-model.trim="formData.hotelNameCh" placeholder="请输入酒店中文名称" maxlength="20" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
			<el-form-item label="酒店名称(英文)：" prop="hotelNameEn">
				<el-input v-model.trim="formData.hotelNameEn" placeholder="请输入酒店英文名称" maxlength="100" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
			<el-form-item label="到机场的距离：" prop="hotelDistant">
				<el-input v-model.trim="formData.hotelDistant" placeholder="请输入到机场的距离" maxlength="20" @keydown.enter.native="submit" clearable>
					<i slot="suffix" class="icon-distant">km</i>
				</el-input>
			</el-form-item>
            <el-form-item label="详细地址：" prop="hotelAddress">
				<el-input v-model.trim="formData.hotelAddress" placeholder="请输入详细地址" maxlength="30" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
            <el-form-item label="联系电话：" prop="hotelMobile">
				<el-input v-model.trim="formData.hotelMobile" placeholder="请输入联系电话" @keydown.enter.native="submit" clearable></el-input>
			</el-form-item>
            <el-form-item label="位置：" prop="hotelPosition">
				<el-select v-model="formData.hotelPosition" placeholder="请选择位置">
					<el-option label="机场" value="机场"></el-option>
                	<el-option label="市区" value="市区"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="酒店介绍：" prop="hotelContent">
				<el-input type="textarea" :rows="7" placeholder="请输入描述信息，最多500个字符" maxlength="500" v-model.trim="formData.hotelContent"></el-input>
			</el-form-item>
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="hotelLogo"  label="logo：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""
							:accept="'image/jpeg,image/png'"	
							:show-file-list="false"
							:on-change="handleChange"
							:auto-upload="false"
							:before-upload="beforeAvatarUpload">
							<img v-if="imageUrl" :src="imageUrl" class="avatar">
							<i v-else @click="getName('hotelLogo')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('hotelLogo')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</InfoPanle>
</template>

<script>
	import { formatCheck } from '@/utils/utils';
	import { hotel } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	export default {
		components: {
			InfoPanle
		},
		props: ['panleShow', 'panleData'],
		data() {
			//手机号校验
			let checkTel = (rule, value, callback) => {
				let reg = formatCheck.isTel(value);
				if(value && !reg) {
					callback(new Error("手机号格式不正确"));
				} else {
					callback();
				}
			};
			//距离校验
			let checkNum = (rule, value, callback) => {
				if(value) {
					if(!(/^[0-9]+(\.[0-9]{1,3})?$/).test(value)){
						return callback(new Error("请输入整数或带1-3位小数的数值"));
					} else {
						callback();	
					}
				} else {
					callback();
				}
			};
			//英文名称校验
			let isEnglishName = (rule, value, callback) => {
				let reg = formatCheck.isEnglish(value);
				if(value && !reg) {
					callback(new Error("请输入英文名称"));
				} else {
					callback();
				}
			};
			return {
				propShow: false,
				propType: 0,
				formData: {},
				rules: {
					hotelNameCh: [
						{required: true, message: '请输入酒店名称', trigger: 'blur'}
					],
					hotelNameEn: [
						{required: true, message: '请输入英文名称', trigger: 'blur'},
						{validator: isEnglishName,  trigger: 'blur'},
					],
					hotelDistant: [
						{required: true, message: '请输入距离', trigger: 'blur'},
						{validator: checkNum, trigger: 'blur'},
					],
					hotelAddress: [
						{required: true, message: '请输入详细地址', trigger: 'blur'}
					],
					hotelMobile: [
						{required: true, message: '请输入联系电话', trigger: 'blur'},
						{validator: checkTel, trigger: 'blur'},
					],
					hotelPosition: [
						{required: true, message: '请选择位置', trigger: 'change'}
					],
					hotelLogo: [
						{required: true, message: '请上传图片', trigger: 'blur'}
					],
					hotelContent: [
						{required: true, message: '请输入酒店介绍', trigger: 'blur'}
					],
		
                },
                /*
                上传图片
				*/ 
				imageUrl: '',
				imgName: '',

			}
		},
		methods: {
			init() {
				this.$refs.formData.resetFields();
				this.formData = Object.assign({}, this.panleData.data);
				this.propType = this.panleData.type;
				this.propShow = this.panleShow;
				if(this.panleData.data && this.panleData.data.hotelLogo){
					this.imageUrl = this.panleData.data.hotelLogo;
				}
			},
			getName(name){
				this.imgName=name;
			},
			// 移除图片
			removeContent(val) {
				this.formData[val]="";
				this.imageUrl = "";
		        this.$forceUpdate();
		    },
			// 上传图片
			handleChange(file, fileList) {
				if(file.status != 'ready'){
					return;
				}
				if(!this.beforeAvatarUpload(file.raw)) {
					return;
				}
				this.imageUrl = file.url;
				this.formData.hotelLogo=file.raw;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg' || 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				  this.$message.error('上传图片只能是 JPG / png格式!');
				}
				if (!isLt2M) {
				  this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
				
			},

			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this, 'formData');
				if(!flag) return;
				
				let res, tittle;
				/**
				 * 对hotelLogo字段进行处理  如果图片没有修改则转为null  如果添加了图片原值返回
				 */
				let tempFormData = null;
				tempFormData = Object.assign({}, this.formData);
				if(typeof(this.formData.hotelLogo)=== "string" && this.formData.hotelLogo !== "") {
					tempFormData.hotelLogo = null;
				}
				
				if(this.propType == 1) {
					res = await hotel.addHotel(tempFormData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await hotel.updateHotel(tempFormData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '酒店成功');
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
				this.imageUrl = null;
			},
		},
		watch: {
			panleShow(val) {
				if(val) {
					this.init();
				}
			},
			imageUrl(val){
				this.imageUrl = val;
			}
		},
	}
</script>
<style lang="less">
	#account .infoPanle .el-form-item {
		margin-bottom: 32px;
	}
	.avatar-uploader {
		.el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 6px;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		.el-upload:hover {
			border-color: #409EFF;
		}
		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 100px;
			height: 100px;
			line-height: 100px;
			text-align: center;
		}
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
	i.icon-distant {
		font-style: normal;
	}
</style>