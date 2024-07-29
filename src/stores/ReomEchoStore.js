/* eslint-disable no-undef */

import { ref } from "vue"
import Cookies from "js-cookie"
import { defineStore } from "pinia"
import utils from "@/scripts/utils.js"

const ready = ref(false);
onload = async () => ready.value = true;

export const useReomEchoStore = defineStore('ReomEchoStore',() => {
    const imageLightBoxSrc = ref("");
    const searchDialogStat = ref(false);
    const isSiLodingStatus = ref(true);
    const isHeaderBarShows = ref(false);
    const imageLightBoxSta = ref(false);
    const mobileDrawerStat = ref(false);
    const sponsDialogState = ref(false);
    const sitePathNameStatus = ref(location.pathname);
    const isDeviceMobilePhone = ref(utils.isMobile());
    const pageResizeStatus = ref(Cookies.get('resize'));
    const darksThemeStatus = ref(Cookies.get('darkTheme'));

    const setImageLightBoxSrc = async (value) => imageLightBoxSrc.value = value;
    const setImageLightBoxSta = async (value) => imageLightBoxSta.value = value;
    const setMobileDrawerStat = async (value) => mobileDrawerStat.value = value;
    const setIsHeaderBarShows = async (value) => isHeaderBarShows.value = value;
    const setIsSiLodingStatus = async (value) => isSiLodingStatus.value = value;
    const setSearchDialogStat = async (value) => searchDialogStat.value = value;
    const setPageResizeStatus = async (value) => pageResizeStatus.value = value;
    const setDarksThemeStatus = async (value) => darksThemeStatus.value = value;
    const setSponsDialogState = async (value) => sponsDialogState.value = value;
    const resetSitePathName = async () => sitePathNameStatus.value = location.pathname;

    const resizeWindowInitConfig = async () => {
        let device = utils.isMobile();
        isDeviceMobilePhone.value = device;
    }

    return ({ 
        pageResizeStatus, 
        imageLightBoxSrc, 
        imageLightBoxSta, 
        mobileDrawerStat, 
        isSiLodingStatus, 
        isHeaderBarShows, 
        searchDialogStat, 
        sponsDialogState, 
        darksThemeStatus, 
        sitePathNameStatus, 
        isDeviceMobilePhone, 

        resetSitePathName,
        setPageResizeStatus,
        setDarksThemeStatus, 
        setImageLightBoxSrc, 
        setImageLightBoxSta, 
        setMobileDrawerStat, 
        setIsHeaderBarShows, 
        setIsSiLodingStatus, 
        setSearchDialogStat, 
        setSponsDialogState,
        resizeWindowInitConfig,
    });
});