
<script setup>
    import { onMounted } from 'vue'
    import utils from "@/scripts/utils"
    import { useTitle } from 'vue-hooks-plus'
    import HomeArtic from '@/model/HomeArticle.vue'
    import { homeInit } from '@/stores/NextEchoStore'

    const NextEchoStore = utils.useNextEchoStore();
    onMounted(async () => {
        useTitle(NextEchoStore.configGlobal.site_title);
        if (NextEchoStore.configIndex === null) await homeInit();
    });
</script>

<template>
    <div class="frame-container frame-home" id="frame-home">
        <div class="hitokoto-box" v-if="NextEchoStore.configIndex !== null && NextEchoStore.configIndex.hitokoto">
            <van-notice-bar left-icon="volume-o" :scrollable="false">
                <van-swipe vertical class="notice-swipe" :autoplay="3000" :touchable="false" :show-indicators="false">
                    <van-swipe-item v-for="(item, index) in NextEchoStore.configIndex.index_hitokoto" :key="index">{{ item }}</van-swipe-item>
                </van-swipe>
            </van-notice-bar>
        </div>
        <HomeArtic v-if="NextEchoStore.configIndex !== null"/>
    </div>
</template>

<style>
    @import url("./assets/HomeFrame.css");
</style>