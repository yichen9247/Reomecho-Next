/* eslint-disable no-undef */
import axios from 'axios'
import Valine from 'valine'
import Swal from 'sweetalert2'
import Cookies from "js-cookie"
import ColorThief from 'colorthief'
import siteConfig from "../../config/config.js"
import { useToast } from 'vue-toastification'
import prettyLog from "@/scripts/prettylog.min.js"
import { useNextEchoStore } from '@/stores/NextEchoStore.js'
import { useReomEchoStore } from "@/stores/ReomEchoStore.js"
import { useMusicEchoStore } from "@/stores/MusicEchoStore.js"
import { usePostsEchoStore } from "@/stores/PostsEchoStore.js"

const toast = useToast();

const readUserCopyOption = async () => {
    const NextEchoStore = useNextEchoStore();
    document.querySelector("#section").addEventListener('copy',async () => {
        if (isMobile()) {
            await useDeviceMsg('复制成功');
        } else {
            await import("vue-toastification/dist/index.css").then(async () => {
                toast.success(NextEchoStore.configArticle.copy_noticeText);
            });
        }
    });
}

const openAdminPage = async () => {
    const NextEchoStore = useNextEchoStore();
    if (NextEchoStore.configSystem.admin.open) {
        open(`/${NextEchoStore.configSystem.admin.path}`);
    } else useDeviceMsg("博主未开启此功能");
}

const openRssFeedPage = async () => {
    const NextEchoStore = useNextEchoStore();
    if (NextEchoStore.configSundry.site_openrss) {
        open(`/${NextEchoStore.configGlobal.site_rssPath}`);
    } else useDeviceMsg("博主未开启此功能");
}

const useDeviceMsg = async (message) => {
    const NextEchoStore = useNextEchoStore();
    if (NextEchoStore.setConfigStyles.msgStyle == 1) {
        await showToast(message);
    } else 
    if (NextEchoStore.setConfigStyles.msgStyle == 2) {
        Promise.all([
            await import("layui"),
            await import("layui/dist/css/layui.css")
        ]).then(async () => {
            await layer.msg(message);
        });
    }
}

const writeClipBoardLink = async () => {
    try {
        if (!isSecureContext) {
            await ElMessage({type: 'error',message: "未部署安全证书！"});
        } else 
        if (navigator.clipboard) {
            navigator.clipboard.writeText(location.href).then(async () => {
                await useDeviceMsg('复制链接成功');
            }).catch(async () => {
                await useDeviceMsg('复制链接失败');
            });
        } else {
            await ElMessage({type: 'error',message: "浏览器不支持！"});
        }
    } catch (e) {
        await ElMessage({type: 'error',message: "系统功能异常！"});
    }
}

const isDeveloper = async () => {
    if (isMobile()) {
        await useDeviceMsg('功能正在开发中');
    } else {
        await ElMessage({ message: '功能正在开发中', type: 'warning', duration: 2000 })
    }
};

const getRandomIntInclusiveInter = (mins,maxs) => {
    let min = Math.ceil(mins);
    let max = Math.floor(maxs);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isMobile = () => {
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true;
    } else return false;
}

const toRenderDominColor = async (image) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        const NextEchoStore = useNextEchoStore();
        if (NextEchoStore.configSundry.dynamic_color) {
            const imgElement = new Image();
            imgElement.src = image;
            imgElement.crossOrigin = 'anonymous';
    
            imgElement.onload = async () => {
                const colorThief = await new ColorThief();
                const palette = await colorThief.getPalette(imgElement, 2);
                const hexPalette = await palette.map((rgb) => {
                    return '#' + rgb.map((value) => {
                        return value.toString(16).padStart(2, '0');
                    }).join('');
                });
                resolve([hexPalette[0],palette]);
            };
        }
    });
};

const reloadSystemStyles = async () => {
    document.body.className = "";
    const NextEchoStore = useNextEchoStore();
    document.body.style.setProperty('--dominColor', NextEchoStore.configStyles.dominColor);
    document.body.style.setProperty('--buttoColor', NextEchoStore.configStyles.buttoColor);
    document.body.style.setProperty('--transition', NextEchoStore.configStyles.transition);
    document.body.style.setProperty('--dotted_color1', NextEchoStore.configStyles.dottedColor1);
    document.body.style.setProperty('--dotted_color2', NextEchoStore.configStyles.dottedColor2);
    document.body.style.setProperty('--background', `url(${siteConfig.system.server_adress}/api${NextEchoStore.configStyles.background})`);
}

const secondToDate = (second) => {
    if (!second) return 0;
    let time = new Array(0, 0, 0, 0, 0);
    if (second >= 365 * 24 * 3600) {
        time[0] = parseInt(second / (365 * 24 * 3600));
        second %= 365 * 24 * 3600;
    }
    if (second >= 24 * 3600) {
        time[1] = parseInt(second / (24 * 3600));
        second %= 24 * 3600;
    }
    if (second >= 3600) {
        time[2] = parseInt(second / 3600);
        second %= 3600;
    }
    if (second >= 60) {
        time[3] = parseInt(second / 60);
        second %= 60;
    }
    if (second > 0) time[4] = second;
    return time;
}

const checkAdminLogin = async () => {
    let basePath = location.href.split('?')[0];
    if (localStorage.getItem('loginStatus') !== 'True') {
        history.replaceState(null, '', basePath + '?login');
    } else history.replaceState(null, '', basePath);
}

const returnRoundColor = () => {
    const colorList = ['#23b7e5','#27c24c','#3a3f51','#fad733','#7266ba','#f05050','#42b883','#fbb9b6','#0099FF','#2AAE67','#FF5967','#26CEAA','#F16C8D','#3296FA','#425AEF','#ff7242'];
    let colorIndex = Math.floor(Math.random() * colorList.length);
    return colorList[colorIndex];
}

const findItemInArray = (arr, key) => {
    return arr.find(item => item.item_name === key);
}

const backToTop = async () => document.querySelector('#Reomecho').scrollTo({top: 0,behavior: 'smooth'});

const checkStringUrl = (urlstr) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(urlstr);
}

export default {
    axios, Cookies, siteConfig, Swal, Valine, prettyLog, toast,
    useReomEchoStore, usePostsEchoStore, useMusicEchoStore, useNextEchoStore,
    openAdminPage, openRssFeedPage, useDeviceMsg, isMobile, backToTop, writeClipBoardLink, secondToDate, returnRoundColor, readUserCopyOption, isDeveloper, getRandomIntInclusiveInter, toRenderDominColor, reloadSystemStyles, checkAdminLogin, checkStringUrl, findItemInArray
}