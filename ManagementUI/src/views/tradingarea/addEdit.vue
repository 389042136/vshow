<!--测栏滑块组件-->
<template>
	<InfoPanle :propShow="propShow" :propType="propType" @close="panleClose()" @submit="submit">
		
		<el-form @submit.native.prevent :model="formData" :rules="rules" ref="formData" label-width="130px" :disabled="propType == 3">
			<el-form-item label="商家名称(中文)：" prop="businessNameCh">
				<el-input v-model.trim="formData.businessNameCh" placeholder="请输入商家名称"  clearable maxlength="20"></el-input>
			</el-form-item>
			
			<el-form-item label="英文名称(英文)：" prop="businessNameEn">
				<el-input v-model.trim="formData.businessNameEn" placeholder="请输入英文名称"  clearable maxlength="100"></el-input>
			</el-form-item>
			<el-form-item label="区域：" prop="businessAreaId">
				<el-select v-model="formData.businessAreaId" placeholder="请选择区域" clearable maxlength="20">
					<el-option :label="item.businessAreaNameCh" :value="item.businessAreaId" v-for="item in areaArr" :key="item.businessAreaId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="联系电话：" prop="businessMobile">
				<el-input v-model.trim="formData.businessMobile" placeholder="请输入联系电话"  clearable ></el-input>
			</el-form-item>
			<el-form-item label="类型：" prop="businessType">
			    <el-select v-model="formData.businessType" placeholder="请选择" clearable maxlength="20">
					<el-option :label="item.businessTypeNameCh" :value="item.businessType" v-for="item in typeArr" :key="item.businessType"></el-option>
				</el-select>
			</el-form-item>
			
			<el-row>
				<el-col :span="13">
					<el-form-item label="X坐标：" prop="businessPositionX">
						<el-input v-model.trim="formData.businessPositionX"  clearable />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="Y坐标：" prop="businessPositionY" label-width="96px">
						<el-input v-model.trim="formData.businessPositionY"  clearable />
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="营业时间：" prop="time">
				<el-time-picker
					is-range
					value-format='HH:mm'
					v-model="formData.time"
					range-separator="至"
					start-placeholder="开门时间"
					end-placeholder="关门时间"
					placeholder="选择时间范围"
					style="width:auto">
				</el-time-picker>
			</el-form-item>
			<el-form-item label="推荐商家：" prop="businessRecommand">
				 <el-checkbox v-model="checked"></el-checkbox>
			</el-form-item>
            <el-form-item label="商家介绍：" prop="businessContent">
				<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 7}"  placeholder="请输入描述信息，最多500个字符" 
				          v-model.trim="formData.businessContent" maxlength="500"></el-input>
			</el-form-item>
			<!-- logo图片 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="businessLogo"  label="logo：" >
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
							<img  @click="getName('businessLogo')" v-if="logo"
							      :src="logo" class="avatar">
							<i  v-else  @click="getName('businessLogo')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('businessLogo','logo')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片1  -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="businessPicOne"  label="图片1：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"	
							action=""	
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"			
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('businessPicOne')" v-if="pic1"
							     :src="pic1" class="avatar">
							<i v-else @click="getName('businessPicOne')"  class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('businessPicOne','pic1')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片2 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="businessPicTwo"  label="图片2：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"			
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('businessPicTwo')" v-if="pic2" 
							     :src="pic2" class="avatar">
							<i v-else @click="getName('businessPicTwo')"  
							   class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('businessPicTwo','pic2')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片3 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="businessPicThree"  label="图片3：" >
					    <el-col :span="18">   
							<el-upload
								class="avatar-uploader"
								action=""	
								:accept="'image/jpeg,image/png'"
								:auto-upload="false"		
								:show-file-list="false"
								:on-change="handleAvatarSuccess"
								:before-upload="beforeAvatarUpload">
								<img @click="getName('businessPicThree')" :src="pic3"
								      v-if="pic3"  class="avatar">
								<i v-else @click="getName('businessPicThree')"
								   class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('businessPicThree','pic3')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片4 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="businessPicFour"  label="图片4：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"	
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('businessPicFour')"  :src="pic4" 
							     v-if="pic4" class="avatar">
							<i v-else @click="getName('businessPicFour')"  
							   class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('businessPicFour','pic4')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片5 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="businessPicFive"  label="图片5：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"	
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('businessPicFive')"  :src="pic5"
							    v-if="pic5"  class="avatar">
							<i v-else @click="getName('businessPicFive')" 
							   class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('businessPicFive','pic5')" type="danger" 
							size="mini" title="删除" icon="el-icon-delete" ></el-button>
						</el-col> 
					</el-form-item>
				</el-col>
			</el-row>
			<!-- 图片6 -->
			<el-row type="flex" >	
				<el-col :span="24" align='bottom'>
					<el-form-item prop="businessPicSix"  label="图片6：" >
						<el-col :span="18">   
						<el-upload
							class="avatar-uploader"
							action=""	
							:accept="'image/jpeg,image/png'"
							:auto-upload="false"	
							:show-file-list="false"
							:on-change="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img @click="getName('businessPicSix')"  :src="pic6"
							    v-if="pic6"  class="avatar">
							<i v-else @click="getName('businessPicSix')" 
							   class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						</el-col>
						<el-col :span="3"> 
							<el-button  @click="removeContent('businessPicSix','pic6')" type="danger" 
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
	import { businessManagement } from "@/service/api";
	import InfoPanle from "@/components/infoPanle";
	import Password from '@/components/password';
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
			let businessPosition = (rules, value, callback) => {
				
				if(value) {
				  let reg =  /^([0]|[1-9]\d?|100)$/ ;
					if(reg.test(value)){
						callback();
					}else{						
					 return	callback(new Error("请输入[0, 100]之前的整数"));
					}
				} else {
					return callback(new Error("请输入坐标值"));
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
				timeArr: [],
				propShow: false,
				propType: 0,
				formData: {},
				disabled: false,
				passType: true,
				areaArr: [],
				typeArr:[],
				imgName:'',
				checked: false,
				logo:'',
				pic1:'',
				pic2:'',
				pic3:'',
				pic4:'',
				pic5:'',
				pic6:'',
				rules: {
					businessMobile: [{
						required: true,
						validator: checkTel,
						trigger: 'blur'
					}],
					businessNameCh:[{
						required: true,
						trigger: 'blur',
						message: '请输入商家名称'
					}],
					businessNameEn:[{
						required: true,
						trigger: 'blur',
						message: '请输入英文名称'
					},
					{validator: isEnglishName,  trigger: 'blur'},],
					businessAreaId:[{
						required: true,
						trigger: 'blur',
						message: '请选择区域'
					}],
					businessType:[{
						required: true,
						trigger: 'blur',
						message: '请输类型'
					}],
					time:[{
						required: true,
						trigger: 'blur',
						message: '请选择时间'
					}],
					businessLogo:[{
						required: true,
						trigger: 'blur',
						message: '请选择图片'
					}],
					businessPicOne:[{
						required: true,
						trigger: 'blur',
						message: '请选择图片'
					}],
					businessPositionX:[{
						required: true,
						trigger: 'blur',
						validator: businessPosition
					}],
					businessPositionY:[{
						required: true,
						trigger: 'blur',
						validator: businessPosition
					}],
					businessContent:[{
						required: true,
						trigger: 'blur',
						message: '请输入商家介绍'
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
				if(this.propType == 1 ){
					this.logo = '';
					this.pic1 = '';
					this.pic2 = '';
					this.pic3 = '';
					this.pic4 = '';
					this.pic5 = '';
					this.pic6 = '';
					this.checked = false;
				}else{
                    if(this.formData.businessOpenTime != null){
						this.timeArr = ['08:00','09:00']
						this.$set(this.formData,'time',[this.formData.businessOpenTime,this.formData.businessCloseTime]);
					}
					this.logo = this.formData.businessLogo;
					this.pic1 = this.formData.businessPicOne;
					this.pic2 = this.formData.businessPicTwo;
					this.pic3 = this.formData.businessPicThree;
					this.pic4 = this.formData.businessPicFour;
					this.pic5 =  this.formData.businessPicFive;
					this.pic6 =  this.formData.businessPicSix;
					 
				}
				if(this.formData.businessRecommand == "1"){
						this.checked = true;
					}else{
						this.checked = false;
					}
				this.getArea();
				this.getType();
			},
			/**
			 * 查询商家区域
			 */
			async getArea() {
				let res = await businessManagement.getBusinessArea();
				if(res && res.data == null) {
					return;
				}
				this.areaArr = res.data;
			},
			/**
			 * 查询商家类型
			 */
			async getType() {
				
				let res = await businessManagement.getBusinessType();
				if(res && res.data == null) {
					return;
				}
				this.typeArr = res.data;
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
				for(let i = 1; i< 7 ;i++){
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
					case 'businessLogo':
					this.logo = file.url;
					this.formData.businessLogo=file.raw;
					break;
					case 'businessPicOne':
					this.pic1 = file.url;
					this.formData.businessPicOne=file.raw;
					break;
					case 'businessPicTwo':
					this.pic2 = file.url;
					this.formData.businessPicTwo=file.raw;
					break;
					case 'businessPicThree':
					this.pic3 = file.url;
					this.formData.businessPicThree=file.raw;
					break;
					case 'businessPicFour':
					this.pic4 = file.url;
					this.formData.businessPicFour=file.raw;
					break;
					case 'businessPicFive':
					this.pic5 = file.url;
					this.formData.businessPicFive=file.raw;
					break;
					case 'businessPicSix':
					this.pic6 = file.url;
					this.formData.businessPicSix=file.raw;
					break;
				}

			},
			/**
			 * 图片的格式校验
			 */
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传图片只能是 JPG 格式!');
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
				// 处理日期

				if(this.formData.time){
					this.formData.businessOpenTime=this.formData.time[0];
					this.formData.businessCloseTime=this.formData.time[1];
				}
				if(this.checked){
					this.checked = '1';
				}else{
					this.checked = '0';
				}
				this.formData.businessRecommand = this.checked;
				/**
				 * 没有图片的转为'',有图片没有修改的转为null
				 */
				let tempFormData = null;
				tempFormData = Object.assign({}, this.formData);
				for (let key in this.formData) {
					if(key.indexOf("businessPic") != -1){
						if(typeof(this.formData[key]) === "string" && this.formData[key].length > 2){
							tempFormData[key] = null;
						} else if(this.formData[key] === null){
							tempFormData[key] = "0";
						}
					}
				}
				if(typeof(tempFormData.businessLogo)=== "string" &&  this.formData.businessLogo.length > 2){
					tempFormData.businessLogo = null;
				}
				let res, tittle;                                                     
				if(this.propType == 1) {
					res = await businessManagement.insertBusiness(tempFormData);
					tittle = '新增';
				}else if(this.propType == 2){
					res = await businessManagement.updateBusiness(tempFormData);
					tittle = '编辑';
				}
				if(!res) return;

				if(res.status == this.$successCode) {
					this.panleClose(true);
					this.$message.success(tittle + '商圈信息成功');
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
			// this.getAllRole();
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