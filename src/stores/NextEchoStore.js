
import { ref } from "vue"
import { defineStore } from "pinia"
import axiostool from "@/scripts/axiostool"
import siteConfig from "../../config/config.js"
import { useFavicon } from 'vue-hooks-plus'

const setMetaDescription = async (description) => {
    let meta = document.querySelector('meta[name=description]');
    if (meta) {
        meta.setAttribute('content', description);
    } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        meta.setAttribute('content', description);
        document.head.appendChild(meta);
    }
}

export const nextInit = async () => {
    let dataConfig = null;
    const NextReomecho = useNextEchoStore();
    await axiostool.sendHttpGet(`${siteConfig.system.server_adress}/api/config/getAll`).then(res => {

        useFavicon(res.data.configGlobalData.site_icons);
        setMetaDescription(res.data.configGlobalData.siteDescription);

        NextReomecho.setApplication(res.data.application);
        NextReomecho.setConfigAside(res.data.configAsideData);
        NextReomecho.setConfigGlobal(res.data.configGlobalData);
        NextReomecho.setConfigStyles(res.data.configStylesData);
        NextReomecho.setConfigCookie(res.data.configCookieData);
        NextReomecho.setConfigDeploy(res.data.configDeployData);
        NextReomecho.setConfigAuthor(res.data.configAuthorData);
        NextReomecho.setConfigFooter(res.data.configFooterData);
        NextReomecho.setConfigHeader(res.data.configHeaderData);
        NextReomecho.setConfigSocial(res.data.configSocialData);
        NextReomecho.setConfigDrawer(res.data.configDrawerData);
        NextReomecho.setConfigStatis(res.data.configStatisData);
        NextReomecho.setConfigSundry(res.data.configSundryData);
        NextReomecho.setConfigSystem(res.data.configSystemData);
        NextReomecho.setConfigFunction(res.data.configFunctionData);
        
        if (res.data.configStylesData.fontStyle == 1) import('@/assets/styles/font1.css');
        if (res.data.configStylesData.fontStyle == 2) import('@/assets/styles/font2.css');
        document.body.style.setProperty('--dominColor', res.data.configStylesData.dominColor);
        document.body.style.setProperty('--buttoColor', res.data.configStylesData.buttoColor);
        document.body.style.setProperty('--transition', res.data.configStylesData.transition);
        document.body.style.setProperty('--dotted_color1', res.data.configStylesData.dottedColor1);
        document.body.style.setProperty('--dotted_color2', res.data.configStylesData.dottedColor2);
        document.body.style.setProperty('--background', `url(${res.data.configStylesData.background})`);

        dataConfig = res.data;
    }).then(async () => NextReomecho.setRequestStatus(true));
    return dataConfig;
}

export const getQequestStatus = () => {
    return useNextEchoStore().requestStatus;
}

export const homeInit = async () => {
    const NextReomecho = useNextEchoStore();
    await axiostool.sendHttpGet(`${siteConfig.system.server_adress}/api/config/getIndex`).then(res => NextReomecho.setConfigIndex(res.data));
}

export const postInit = async () => {
    const NextReomecho = useNextEchoStore();
    await axiostool.sendHttpGet(`${siteConfig.system.server_adress}/api/config/getArticle`).then(res => NextReomecho.setConfigArticle(res.data));
}

export const lovesInit = async () => {
    const NextReomecho = useNextEchoStore();
    await axiostool.sendHttpGet(`${siteConfig.system.server_adress}/api/config/getLoves`).then(res => NextReomecho.setConfigLoves(res.data));
}

export const circleInit = async () => {
    const NextReomecho = useNextEchoStore();
    await axiostool.sendHttpGet(`${siteConfig.system.server_adress}/api/config/getCircle`).then(res => NextReomecho.setConfigCircle(res.data));
}

export const commentInit = async () => {
    const NextReomecho = useNextEchoStore();
    await axiostool.sendHttpGet(`${siteConfig.system.server_adress}/api/config/getComment`).then(res => NextReomecho.setConfigComment(res.data));
}

export const useNextEchoStore = defineStore('NextEchoStore',() => {

    const application = ref(null);
    const requestStatus = ref(false);

    const configAside = ref(null);
    const configIndex = ref(null);
    const configLoves = ref(null);
    const configGlobal = ref(null);
    const configDeploy = ref(null);
    const configStyles = ref(null);
    const configCookie = ref(null);
    const configAuthor = ref(null);
    const configFooter = ref(null);
    const configHeader = ref(null);
    const configSocial = ref(null);
    const configSundry = ref(null);
    const configDrawer = ref(null);
    const configStatis = ref(null);
    const configSystem = ref(null);
    const configCircle = ref(null);
    const configArticle = ref(null);
    const configComment = ref(null);
    const configFunction = ref(null);

    const setApplication = (data) => { application.value = data; };
    const setRequestStatus = (data) => { requestStatus.value = data; };

    const setConfigIndex = (data) => { configIndex.value = data; };
    const setConfigAside = (data) => { configAside.value = data; };
    const setConfigLoves = (data) => { configLoves.value = data; };
    const setConfigGlobal = (data) => { configGlobal.value = data; };
    const setConfigDeploy = (data) => { configDeploy.value = data; };
    const setConfigStyles = (data) => { configStyles.value = data; };
    const setConfigFooter = (data) => { configFooter.value = data; };
    const setConfigAuthor = (data) => { configAuthor.value = data; };
    const setConfigDrawer = (data) => { configDrawer.value = data; };
    const setConfigHeader = (data) => { configHeader.value = data; };
    const setConfigSocial = (data) => { configSocial.value = data; };
    const setConfigSundry = (data) => { configSundry.value = data; };
    const setConfigStatis = (data) => { configStatis.value = data; };
    const setConfigSystem = (data) => { configSystem.value = data; };
    const setConfigCookie = (data) => { configCookie.value = data; };
    const setConfigCircle = (data) => { configCircle.value = data; };
    const setConfigArticle = (data) => { configArticle.value = data; };
    const setConfigComment = (data) => { configComment.value = data; };
    const setConfigFunction  = (data) => { configFunction.value = data; };

    return ({
        configGlobal,configStyles,configIndex,configCookie,configDeploy,configAuthor,configFooter,configHeader,
        configSocial,configDrawer,configStatis,configArticle,configCircle,configAside,configFunction,configSundry,
        configSystem,configComment,configLoves,requestStatus,application,
        setConfigGlobal,setConfigStyles,setConfigIndex,setConfigCookie,setConfigDeploy,setConfigAuthor,setConfigFooter,
        setConfigHeader,setConfigSocial,setConfigDrawer,setConfigStatis,setConfigArticle,setConfigCircle,setConfigAside,
        setConfigFunction,setConfigSundry,setConfigSystem,setConfigComment, setConfigLoves,setRequestStatus,setApplication
    });
});