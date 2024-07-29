
<script setup>
    import "./assets/OverLaysView.css"
    import utils from "@/scripts/utils"
    const ReomEchoStore = utils.useReomEchoStore(),NextEchoStore = utils.useNextEchoStore();
</script>

<template>
    <van-overlay :show="ReomEchoStore.imageLightBoxSta" @click="ReomEchoStore.setImageLightBoxSta(false)">
        <div class="wrapper">
            <img :src="ReomEchoStore.imageLightBoxSrc">
        </div>
    </van-overlay>
    <van-overlay :show="ReomEchoStore.isSiLodingStatus && NextEchoStore.configSundry.load_fullscreen" @click="ReomEchoStore.setImageLightBoxSta(false)" class="full-screen" z-index="100">
        <img :src="NextEchoStore.configGlobal.site_loadingIcon" class="loading-icon" draggable="false">
        <div class="loading-image-dot"></div>
    </van-overlay>
</template>