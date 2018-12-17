<!--测栏滑块组件-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3" enctype="multipart/form-data">
			<el-form-item label="景点名称(中文)：" prop="scenicNameCh">
				<el-input v-model.trim="formData.scenicNameCh" placeholder="请输入景点名称"  clearable maxlength="20"></el-input>
			</el-form-item>
			
			<el-form-item label="英文名称(英文)：" prop="scenicNameEn">
				<el-input v-model.trim="formData.scenicNameEn" placeholder="请输入英文名称"  clearable maxlength="100"></el-input>
			</el-form-item>
			
			<el-form-item label="所在城市(县区)：" prop="scenicPosition">

				<el-input v-model.trim="formData.scenicPosition" placeholder="请输入所在城市名称"  clearable maxlength="20"></el-input>
			</el-form-item>
			
			<el-form-item label="详细地址：" prop="scenicAddress">
				<el-input v-model.trim="formData.scenicAddress" placeholder="请输入详细地址"  clearable maxlength="20"></el-input>
			</el-form-item>
			
			<el-form-item label="门票价格：" prop="scenicPrice">
				<el-input v-model.trim="formData.scenicPrice" placeholder="请输入价格" clearable maxlength="10"></el-input>
			</el-form-item>
			<el-form-item label="联系电话：" prop="scenicMobile">
				<el-input v-model.trim="formData.scenicMobile" placeholder="请输入联系电话" clearable maxlength="30"></el-input>
			</el-form-item>
			
			<el-form-item label="营业时间：" prop="time">
				<el-time-picker
					is-range
					v-model="formData.time"
					value-format = 'HH:mm'
					range-separator="至"
					start-placeholder="开门时间"
					end-placeholder="关门时间"
					placeholder="选择时间范围"
					style="width:auto">
				</el-time-picker>
			</el-form-item>
			<el-form-item label="推荐景点：" prop="scenicRecommend">
				 <el-checkbox v-model="checked" ></el-checkbox>
			</el-form-item>
			<el-form-item label="景点介绍：" prop="scenicContent">
				<el-input type="textarea" :autosize="{ minRows: 3,maxRows: 7}" placeholder="最多500个字符" v-model.trim="formData.scenicContent" maxlength="500"></el-input>
			</el-form-item>
			<!-- logo图片 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="scenicLogo"  label="logo：" >
						<el-col :span="18" >   
							<div></div>
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"		
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img  @click="getName('scenicLogo')" v-if="formData.scenicLogo && logo.length>1" 
							      :src="logo" class="avatar">
							<i  v-else  @click="getName('scenicLogo')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('scenicLogo','logo')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片1 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="scenicPicOne"  label="图片1：" >
						<el-col :span="18" >   
							<div></div>
						<el-upload
							class="avatar-uploader"
							action=""
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"		
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img  @click="getName('scenicPicOne')" v-if="formData.scenicPicOne && pic1.length>1" 
							      :src="pic1" class="avatar">
							<i  v-else  @click="getName('scenicPicOne')"  
							     class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('scenicPicOne','pic1')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片2 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="scenicPicTwo"  label="图片2：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"			
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('scenicPicTwo')" v-if="formData.scenicPicTwo && pic2.length>1" 
							     :src="pic2" class="avatar">
							<i v-else @click="getName('scenicPicTwo')"  
							   class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('scenicPicTwo','pic2')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片3 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="scenicPicThree"  label="图片3：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"		
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('scenicPicThree')" v-if="formData.scenicPicThree && pic3.length>1" 
							     :src="pic3" class="avatar">
							<i v-else @click="getName('scenicPicThree','pic3')"  
							   class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('scenicPicThree','pic3')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片4 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="scenicPicFour"  label="图片4：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"	
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('scenicPicFour')" v-if="formData.scenicPicFour && pic4.length>1" 
							     :src="pic4" class="avatar">
							<i v-else @click="getName('scenicPicFour')" 
							    class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('scenicPicFour','pic4')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片5 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="scenicPicFive"  label="图片5：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							:accept="'image/jpeg,image/png'"
							action=""
							:auto-upload="false"	
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('scenicPicFive')" v-if="formData.scenicPicFive && pic5.length>1" 
							     :src="pic5" class="avatar">
							<i v-else @click="getName('scenicPicFive','pic5')" 
							   class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('scenicPicFive','pic5')" type="danger" 
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
	import { scenicManagement } from "@/service/api";
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
			//手机号校验
			let checkTel = (rule, value, callback) => {
				if(value) {
				   let reg = formatCheck.isTel(value);
					if(!reg){
						callback(new Error("手机号格式不正确"));
					}else{
						callback();
					}
				} else {
					return callback(new Error("请输入手机号"));
				}
			};
			//价格校验
			let checkPice= (rule, value, callback) => {
				if(value ) {
					if(!(/^[0-9]+(.[0-9]{2})?$/).test(value)){
						return callback(new Error("请输入整数或带两位小数的正实数"));
					} else {
						callback();
					}
				} else {
					return callback(new Error("请输入票价"));
				}
			};
			// //价格校验
			// let checkPice= (rule, value, callback) => {
			// 	if(value ) {
			// 		if(!(/^[A-Za-z0-9]+$/).test(value)){
			// 			return callback(new Error("只能输入整数"));
			// 		}			// 		
			// 	} else {
			// 		callback();
			// 	}
			// };
			//logo 图片一校验
			let checkPic= (rule, value, callback) => {
				if(value) {
					if(value == "0"){
						return callback(new Error("请上传图片"));
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
				disabled: false,
				passType: true,
				areaArr: [],
				typeArr:[],
				checked: false,
				logo:'',
				pic1:'',
				pic2:'',
				pic3:'',
				pic4:'',
				pic5:'',
				imgName:'',
				rules: {
					scenicMobile: [{
						required: true,
						validator: checkTel,
						trigger: 'blur'
					}],
					scenicNameCh:[{
						required: true,
						trigger: 'blur',
						message: '请输入景区名称'
					}],
					scenicNameEn:[{
						required: true,
						trigger: 'blur',
						message: '请输入英文名称'
					},
						{validator: isEnglishName,  trigger: 'blur'},
					],
					scenicPosition:[{
						required: true,
						trigger: 'blur',
						message: '请输入城市名称'
					}],
					scenicAddress:[{
						required: true,
						trigger: 'blur',
						message: '请输入景区地址'
					}],
					scenicPrice:[{
					
						required: true,
						trigger: 'blur',
						validator: checkPice
					}],
					time:[{
						required: true,
						trigger: 'blur',
						message: '请选择时间'
					}],
					scenicContent: [{
						required: true,
						trigger: 'blur',
						message: '请选输入景点简介'
					}],
					scenicLogo:[
						{required: true, message: '请上传图片', trigger: 'blur'},
						{validator: checkPic, message: '请上传图片', trigger: 'blur'},	
					],
					scenicPicOne:[
						{required: true, message: '请上传图片', trigger: 'blur'},
						{validator: checkPic, message: '请上传图片', trigger: 'blur'},	
					],
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
				if(this.propType == 1 ){
					this.logo = '';
					this.pic1 = '';
					this.pic2 = '';
					this.pic3 = '';
					this.pic4 = '';
					this.pic5 = '';
					this.checked = false;
				}else{
                    if(this.formData.scenicOpenTime != null){
						this.formData.time=[this.formData.scenicOpenTime,this.formData.scenicCloseTime]
					}
					this.logo = this.panleData.data.scenicLogo;
					this.pic1 = this.panleData.data.scenicPicOne;
					this.pic2 = this.panleData.data.scenicPicTwo;
					this.pic3 = this.panleData.data.scenicPicThree;
					this.pic4 = this.panleData.data.scenicPicFour;
					this.pic5 =  this.panleData.data.scenicPicFive;
					if(this.formData.scenicRecommand == "1"){
						this.checked = true;
					}else{
						this.checked = false;
					}
				}
			},
		    getName(name){
				this.imgName=name;
			},
			/**
			 * 删除方法
			 */
			removeContent (val,name) {
				this.formData[val] = "0";
				if(name == 'logo'){
					this.logo = '';
					return;
				}
				for(let i = 1; i< 6 ;i++){
					if(name.indexOf(i) != -1){
						this[name] ='';
						return;
					}
				}

				this.$forceUpdate();			
			},
			/**
			 * 图片选择后的数据处理
			 */
			handleAvatarSuccess(file,res ) {
				if(file.status != 'ready'){
					return;
				}
				if(!this.beforeAvatarUpload(file.raw)) {
					return;
				}
				switch (this.imgName) {
					case 'scenicLogo':
					this.logo = file.url;
					this.formData.scenicLogo=file.raw;
					break;
					case 'scenicPicOne':
					this.pic1 = file.url;
					this.formData.scenicPicOne=file.raw;
					break;
					case 'scenicPicTwo':
					this.pic2 = file.url;
					this.formData.scenicPicTwo=file.raw;
					break;
					case 'scenicPicThree':
					this.pic3 = file.url;
					this.formData.scenicPicThree=file.raw;
					break;
					case 'scenicPicFour':
					this.pic4 = file.url;
					this.formData.scenicPicFour=file.raw;
					break;
					case 'scenicPicFive':
					this.pic5 = file.url;
					this.formData.scenicPicFive=file.raw;
					break;
				}
				this.$forceUpdate();
			},
			/**
			 * 图片的格式校验
			 */
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 2MB!');
				}
				return isLt2M;
			},
			/**
			 * 确定
			 */
			async submit() {
				let flag = formatCheck.form(this,'formData');
				if(this.checked){
					this.checked = '1';
				}else{
					this.checked = '0';
				}
                this.formData.scenicRecommend = this.checked;
				if(!flag) return;
				if(this.formData.time){
					this.formData.scenicOpenTime=this.formData.time[0];
					this.formData.scenicCloseTime=this.formData.time[1];
				}
				/**
				 * 没有图片的转为'0',有图片没有修改的转为null
				 */
				let tempFormData = null;
				tempFormData = Object.assign({}, this.formData);
				for (let key in this.formData) {
					if(key.indexOf("scenicPic") != -1){
						if(typeof(this.formData[key]) === "string" && this.formData[key].length > 2){
							tempFormData[key] = null;
						} else if(this.formData[key] === null){
							tempFormData[key] = "0"
						} 

					}
				}

				if(typeof(this.formData.scenicLogo)=== "string" &&  this.formData.scenicLogo.length > 2){
					tempFormData.scenicLogo = null;
				}

				let res, tittle;
				if(this.propType == 1) {
					delete this.formData.time;
					res = await scenicManagement.insertScenic(tempFormData);
					tittle = '新增';
				}else if(this.propType == 2){
					delete this.formData.time;
					res = await scenicManagement.updateScenic(tempFormData);
					tittle = '编辑';
				}
				if(!res) return;
				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '景点信息成功');
				}else {
					this.$message.error(res.message);
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
				document.querySelector('.el-upload__input[type="file"]').value = '';
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
		}
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
</style>