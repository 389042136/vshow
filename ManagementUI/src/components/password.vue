<template>
    <div>
        <el-input :type="passType ? 'password' : 'text' " :prefix-icon="icon ? 'fa fa-key' : ''" :placeholder="placeholder" v-model.trim="psw" maxlength="30"></el-input>
        <i class="fa showPass" :class="passType ? 'fa-eye-slash' : 'fa-eye'" @mousedown="show()" @mouseup="hide()" @mouseout="hide()"></i>
    </div>
</template>

<script>
export default {
    props: {
        password: String,
        icon: {
            default: false
        },
        placeholder: {
            default: '请输入密码'
        }
    },
    data() {
        return {
            passType: true,
            psw: this.password,
        }
    },
    methods: {
        show() {
            this.passType = false;
        },

        hide() {
            this.passType = true;
        }
    },
    watch: {
        psw(val) {
            this.$emit('getPassword', val);
        },
        password(val) {
            this.psw = val;
        }
    }
}
</script>


<style lang="less" scoped>
    .showPass {
        position: absolute;
        width: 25px;
        line-height: 32px;
        top: 0;
        right: 0;
        cursor: pointer;
    }
</style>
