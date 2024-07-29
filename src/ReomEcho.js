import "@/assets/index.css"

import VWave from 'v-wave'
import routers from '@/router'
import ReomEcho from '@/ReomEcho.vue'
import Toast from "vue-toastification"
import ActionCaptcha from "vue3-action-captcha"
import SiteCatchError from "./model/SiteCatchError.vue"

import { Lazyload } from 'vant'
import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { nextInit, getQequestStatus } from "./stores/NextEchoStore.js"

const toastOptions = {
    maxToasts: 2,
    closeOnClick: true,pauseOnHover: true,
    closeButton: "button",position: "top-right",
    draggablePercent: 0.6,pauseOnFocusLoss: true,
    icon: true,rtl: false,timeout: 2000,draggable: true,
};
let Reomecho = createApp(ReomEcho);

(async () => {
    const initPromises = [
        Reomecho.use(VWave),
        Reomecho.use(ActionCaptcha),
        Reomecho.use(createPinia()),
        Reomecho.use(Toast, toastOptions),
        routers.createDynamicRoutes().then(router => {
            Reomecho.use(router);
        }),
        nextInit().then(async (res) => {Reomecho.use(Lazyload, {attempt: 3,lazyComponent: res.configStylesData.lazyloadImg,loading: res.configStylesData.lazyloadImg,error: res.configStylesData.lazyloadErr})})
    ];
    await Promise.all(initPromises).then(() => {
        Reomecho.mount('#Reomecho');
        if (getQequestStatus()) import("@/scripts/config.min.js");
    });
})().catch((error) => {
    Reomecho = createApp({
        render() {
            return h(SiteCatchError, { errorInfo: error });
        },
    });
    Reomecho.mount('#Reomecho');
});
