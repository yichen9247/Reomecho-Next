/* eslint-disable no-undef */

import Cookies from "js-cookie"
import siteConfig from "../../config/config.js"
import DisableDevtool from 'disable-devtool'
import developer from "@/scripts/developer.js"
import { useNextEchoStore } from '@/stores/NextEchoStore.js'

const NextEchoStore = useNextEchoStore();

if (NextEchoStore.configSundry.load_topline) {
    import('pace-js');
    import('@/assets/paces/pace.min.css');
}

if (NextEchoStore.configSundry.site_mourning) import('@/assets/styles/dao.css');
if (NextEchoStore.configSundry.click_effec) import('@/scripts/effect/effect_dianji.js');
if (NextEchoStore.configAside.aside_list.includes('sakanas')) import('sakana-widget/lib/index.css');

if (NextEchoStore.configSundry.is_cssinsert) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = siteConfig.insert_styles;
    document.body.appendChild(style);
}

if (NextEchoStore.configSundry.is_javainsert) {
    let script = document.createElement('script');
    script.setAttribute('nonce', 'uniquevalue');
    script.setAttribute('type', 'text/javascript');
    script.innerHTML = siteConfig.insert_javascript;
    document.body.appendChild(script);
}

if (NextEchoStore.configStyles.darkTheme == 2) {
    let Hours = new Date().getHours();
    let profile = document.querySelector(".main-layout");
    if ((Hours >= 0 && Hours <= 8) || (Hours >=22 && Hours <= 23) ) {
        profile.setAttribute("data-theme","dark");
        Cookies.set('darkTheme', true ,{ expires: 30 });
    } else {
        profile.setAttribute("data-theme","default");
        Cookies.set('darkTheme', false ,{ expires: 30 });
    }
}

document.body.className = "";
if (NextEchoStore.configSundry.site_secproduc && import.meta.env.MODE === 'production') DisableDevtool(developer);
onload = async () => console.log("\n %c ReomEcho" + " %c 轻量级博客系统", "color:#ffffff;background:#626aef;padding:5px 0;", "color:#626aef;background:#f8f8f8;padding:5px 10px 5px 0px;");