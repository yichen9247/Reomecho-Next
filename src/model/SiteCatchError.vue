
<script setup>
    import { useRoute } from 'vue-router'
    import { useTitle } from 'vue-hooks-plus'
    import { onMounted, ref, onUnmounted } from 'vue'

    let route = useRoute();
    const messageInfo = ref("");
    const showErrorInfo = ref(false);
    const globalError = defineProps({ errorInfo: Error });

    onMounted(() => {
        onerror = (message) => {
            messageInfo.value +=  message;
        };
    });
    onUnmounted(() => onerror = null);
    useTitle(route ? route.meta.errorInfo.name : "系统异常");
</script>

<template>
    <div class="site-error">
        <div class="error-container">
            <h1 class="error-title" v-if="route">{{ route.meta.errorInfo.name}}</h1>
            <h1 class="error-title" v-if="!route">系统异常</h1>
            <p class="error-message">抱歉，我们的系统出现了一些问题，请稍后再试或联系我们的支持团队。</p>
            <p class="error-info" v-if="route && showErrorInfo">{{ route.meta.errorInfo.message }}</p>
            <p class="error-info" v-if="!route && showErrorInfo && messageInfo !== ''">{{ messageInfo }}</p>
            <p class="error-info" v-if="globalError && !route && showErrorInfo">{{ globalError.errorInfo }}</p>
            <t-button class="button" theme="danger" @click="showErrorInfo = !showErrorInfo">{{ showErrorInfo ? '隐藏错误日志' : '查看错误日志'}}</t-button>
        </div>
    </div>
</template>

<style>
    @import url("./assets/SiteCatchError.css");
</style>