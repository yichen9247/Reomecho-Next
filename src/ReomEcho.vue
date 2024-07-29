<!-- eslint-disable no-undef -->
<script setup>
  import { onMounted } from "vue"
  import Cookies from "js-cookie"
  import utils from "@/scripts/utils"
  import { useRoute } from 'vue-router'
  import RouteHome from "@/pages/RouteHome.vue"
  import { Bell } from "@element-plus/icons-vue"
  import RouteAdmin from "@/pages/RouteAdmin.vue"
  import SiteCatchError from "./model/SiteCatchError.vue"
  import { SpeedInsights } from "@vercel/speed-insights/vue"
  
  const NextEchoStore = utils.useNextEchoStore();
  const route = useRoute(),ReomEchoStore = utils.useReomEchoStore();
  onresize = async () => await ReomEchoStore.resizeWindowInitConfig();

  onMounted(async () => {
    if (NextEchoStore.configCookie.cookie_notice) { 
      if (Cookies.get('policy') !== 'true' && ReomEchoStore.isDeviceMobilePhone) {
          await showDialog({ message: NextEchoStore.configCookie.cookie_mb_message, theme: 'round-button', confirmButtonText: NextEchoStore.configCookie.confirmButtonText}).then(() => Cookies.set('policy', true ,{ expires: 30 }));
      }
      if (Cookies.get('policy') !== 'true' && !ReomEchoStore.isDeviceMobilePhone) {
          Cookies.set('policy', true ,{ expires: 30 });
          await ElNotification({ icon: Bell,duration: 3000,title: '协议提醒助手',position: 'bottom-right',dangerouslyUseHTMLString: true,message: NextEchoStore.configCookie.cookie_pc_message });
      }
    }
  });
</script>

<template>
  <RouteHome v-if="route.meta.route === 'Home' && NextEchoStore.requestStatus"/>
  <RouteAdmin v-if="route.meta.route === 'Admin'"/>
  <SiteCatchError v-if="route.meta.route === 'Error' || NextEchoStore.siteCatchError"/>
  <SpeedInsights v-if="NextEchoStore.configDeploy.method === 'Vercel' && NextEchoStore.configDeploy.speedInsights"/>
</template>