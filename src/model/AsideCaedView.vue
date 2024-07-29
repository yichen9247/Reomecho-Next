
<script setup>
    import { ref } from 'vue'
    import utils from '@/scripts/utils.js'
    const ReomEchoStore = utils.useReomEchoStore(),props = defineProps({ class: String, wave: Boolean }),classList = ref('aside-card ' + props.class),NextEchoStore = utils.useNextEchoStore();
</script>

<template>
    <div :class="classList" v-if="!ReomEchoStore.isDeviceMobilePhone" v-wave="NextEchoStore.configSundry.moused_waves && wave">
        <slot name="content"></slot>
    </div>
</template>