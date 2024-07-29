<script setup>
    import { onMounted } from "vue"
    import utils from "@/scripts/utils"
    import { useRouter } from 'vue-router'
    import { useTitle } from 'vue-hooks-plus'

    const router = useRouter();
    const backHist = async () => router.go(-1);
    const backHome = async () => router.push("/");
    const NextEchoStore = utils.useNextEchoStore();
    const config = defineProps({ description: String });

    onMounted(async () => {
        if (config.description != null) {
            useTitle(config.description + " - " + NextEchoStore.configGlobal.site_title);
        } else useTitle("页面找到 - " + NextEchoStore.configGlobal.site_title);
    });
</script>

<template>
    <div class="notfound-box">
        <div class="notfound">
            <img class="background" v-lazy="NextEchoStore.configStyles.notfoundImg" draggable="false">
            <p class="not-title">{{ config.description != null ? config.description : '页面未找到' }}</p>
        </div>

        <el-button class="go-button go-home n-button" size="large" @click="backHome">返回到首页</el-button>
        <el-button class="go-button go-hist n-button" size="large" @click="backHist">返回上一页</el-button>
    </div>
</template>

<style>
    @import url("./assets/SiteNotFounds.css");
</style>