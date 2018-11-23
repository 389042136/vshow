<template>
    <div class="weui_msg">
        <x-icon type="ios-information" size="100"></x-icon>
        <div class="weui_text_area">请在微信客户端打开链接</div>
    </div>
</template>

<script>
import { browser } from '@/utils/utils';
export default {
    beforeCreate() {
        if(browser().weixin) this.$router.replace('/');
    }
}
</script>


<style lang="less" scoped>
    .weui_msg {
        font-size: 20px;
        text-align: center;
    }
    .vux-x-icon-ios-information {
        margin: 36px 0 20px;
        fill: #10AEFF;
    }
</style>

