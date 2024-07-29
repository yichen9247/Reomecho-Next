
<!-- eslint-disable no-undef -->
<script setup>
    import Pace from 'pace-js'
    import "@/scripts/prints.min.js"
    import Icons from 'feather-icons'
    import { ref, onMounted } from 'vue'
    import { useRoute } from "vue-router"
    import { useTitle } from 'vue-hooks-plus'
    import utils from "@/scripts/utils.min.js"
    import ArticleFoot from "@/model/ArticleFoot.vue"
    import NotDataView from "@/model/NotDataView.vue"
    import CommentView from "@/model/CommentView.vue"
    import { postInit } from '@/stores/NextEchoStore'
    import SiteNotFounds from '@/model/SiteNotFounds.vue'
    import renderMarkdown from "@/scripts/markdown.min.js"

    const Swal = utils.Swal;
    const postWords = ref(0);
    const config = ref(null);
    const route = useRoute();
    const toast = utils.toast;
    const axios = utils.axios;
    const showShare = ref(false);
    const showDraws = ref(false);
    const showQrcod = ref(false);
    const dataStatus = ref(false);
    const htmlContent = ref(null);
    const Cookies = utils.Cookies;
    const articleLock = ref(false);
    const siteConfig = utils.siteConfig;
    const locationHref = ref(location.href);
    const NextEchoStore = utils.useNextEchoStore();
    const ReomEchoStore = utils.useReomEchoStore();
    const PostsEchoStore = utils.usePostsEchoStore();
    const defaultQrCodeColor = ref(NextEchoStore.configStyles.qrcodeColor);
    let filePath = siteConfig.system.server_adress + '/api/article?post=' +  route.params.alias;

    try {
        config.value = NextEchoStore.application.actives.find(item => item.path == route.params.alias).config;
        useTitle(NextEchoStore.application.actives.find(item => item.path == route.params.alias).config.name + ' - ' + NextEchoStore.setConfigGlobal.site_title);
    } catch {
        config.value = undefined;
    }

    /**
     * Markdown渲染的图片灯箱效果
    */

    const checkImageClick = async () => {
        let images = document.querySelectorAll("img.post-block-image");
        for (let i = 0; i < images.length; i++) {
            images[i].addEventListener('click', async function(e) {
                if (NextEchoStore.configStyles.imgsandbox == 1) {
                    ReomEchoStore.setImageLightBoxSta(true);
                    ReomEchoStore.setImageLightBoxSrc(e.target.src);
                } else 
                if (NextEchoStore.configStyles.imgsandbox == 2) {
                    Promise.all([
                        await import("layui"),
                        await import("layui/dist/css/layui.css")
                    ]).then(async () => layer.photos({ photos: { "title": '文章图片',"start": 0, "data": [{"alt": '文章图片',"pid": 1,"src": e.target.src}] } }));
                }
                
                /* let clone = this.parentNode.cloneNode(true);
                clone.childNodes[0].classList.add("post-block-image-full");
                this.parentNode.parentNode.appendChild(clone);
                clone.childNodes[0].focus();
                clone.childNodes[0].onblur = () => {
                    this.parentNode.parentNode.removeChild(clone);
                }; */ // 旧版图片预览逻辑
            });
        }
    }

    const toRenderDominColor = async () => {
        if (NextEchoStore.configStyles.dynamic_color) {
            Pace.on('done', async () => {
                await utils.toRenderDominColor(config.value.image).then(data => {
                    defaultQrCodeColor.value = data[0];
                    document.body.style.setProperty('--dominColor', data[0]);
                    document.body.style.setProperty('--buttoColor', `rgba(${data[1][0][0]},${data[1][0][1]},${data[1][0][2]},0.75)`);
                });
            });
        }
    };

    const toRenderMarkdown = async (data) => {
        if (config.value !== undefined) {
            const decodedArray = new Uint8Array(atob(data).split('').map(char => char.charCodeAt(0)));
            const decodedString = new TextDecoder('utf-8').decode(decodedArray);
            htmlContent.value = renderMarkdown(decodedString, route.params.alias);postWords.value = decodedString.length;
        }
        dataStatus.value = true
    }

    const toastIsDeveloper = async () => {
        showDraws.value = false;
        await utils.isDeveloper();
    };

    const shareSelect = async (option) => {
        showShare.value = false;
        if (option.id == 'wechat') {
            await utils.isDeveloper();
        }

        if (option.id == 'weibo') {
            await utils.isDeveloper();
        }

        if (option.id == 'link') {
            utils.writeClipBoardLink();
        }

        if (option.id == 'poster') {
            await utils.isDeveloper();
        }

        if (option.id == 'qrcode') {
            showQrcod.value = true;
        }
    }

    const letGetPostData = async () => {
        try {
            const response = await axios.get(filePath);
            await toRenderMarkdown(response.data).then(async () => await checkImageClick());
        } catch (e) {
            ElMessage({type: 'error',message: "文章加载失败！"});
        }
    }

    const toUnlockArticle = async () => {
        let lockCookie = Cookies.get(`${config.value.path}-lock`);
        if (lockCookie != 'True') {
            articleLock.value = true;
            await Swal.fire({
                title: "需要解锁才能查看",
                input: "text",
                inputAttributes: {
                  autocapitalize: "off"
                },
                showCancelButton: true,
                cancelButtonText: "取消",
                showLoaderOnConfirm: true,
                confirmButtonText: "解锁查看",
                inputPlaceholder: "请输入解锁密码",
                allowOutsideClick: () => !Swal.isLoading(),
                preConfirm: async (password) => await validPassword(password),
            });
        } else await toRenderArticle();
    }

    const validPassword = async (password) => {
        let realPassword = config.value.password;
        if (password == realPassword) {
            await toRenderArticle();
            articleLock.value = false;
            await ElMessage({type: 'success',message: "解锁文章成功！"});
            Cookies.set(`${config.value.path}-lock`, 'True', { expires: config.value.expires });
        } else {
            toUnlockArticle();
            await ElMessage({type: 'error',message: "密码错误！"});
        }
    }

    const toRenderArticle = async () => {
        await Promise.all([
            await letGetPostData(),
            await toRenderDominColor(),
            await ReomEchoStore.setIsHeaderBarShows(true)
        ]).then(async () => {});
        if (NextEchoStore.configArticle.post_copynoti) utils.readUserCopyOption();
    }

    onMounted(async () => {
        if (NextEchoStore.configArticle === null) await postInit();
        if (config.value !== undefined) {
            if (config.value.lock) {
                await toUnlockArticle();
            } else await toRenderArticle();
        } else {
            try {
                if (route.params.alias != '/' + NextEchoStore.application.actives.find(item => item.path == route.params.alias).path) toast.error('文章配置文件不存在！');
            } catch {
                config.value = undefined;
            }
        }
    });
    const printfArticlePost = async () => Print('.article-content', {});
</script>

<template>
    <div class="frame-container frame-article" v-if="config != undefined && NextEchoStore.configArticle !== null">
        <h1 class="article-title van-multi-ellipsis--l2">{{ config.name }}</h1>
        <div class="break-box">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">
                    <svg width="15" height="15" viewBox="0 0 24 24" class="feather feather-code"  xmlns="http://www.w3.org/2000/svg" 
                        :fill="Icons.icons['home'].attrs.fill" v-html="Icons.icons['home'].toString()" :style="{ stroke: Icons.icons['home'].attrs.stroke, color: '#000000' }">
                    </svg>首页
                </el-breadcrumb-item>
                <el-breadcrumb-item>文章正文</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="article-content">
            <van-skeleton class="headimg-skeleton" :loading="!dataStatus" v-if="ReomEchoStore.isDeviceMobilePhone">
                <template #template>
                  <div :style="{ display: 'flex', width: '100%' }">
                    <van-skeleton-image />
                  </div>
                </template>
                <div class="image-box">
                    <img class="article-image" v-lazy="utils.checkStringUrl(config.image) ? config.image : siteConfig.system.server_adress + '/api' + config.image" draggable="false" :alt="config.name">
                </div>
            </van-skeleton>
    
            <el-skeleton style="width: 100%" :loading="!dataStatus" animated class="headimg-skeleton" v-else>
                <template #template>
                    <el-skeleton-item variant="image"/>
                </template>
                <template #default>
                    <div class="image-box">
                        <img class="article-image" v-lazy="utils.checkStringUrl(config.image) ? config.image : siteConfig.system.server_adress + '/api' + config.image" draggable="false" :alt="config.name">
                    </div>
                </template>
            </el-skeleton>

            <div id="markdown" class="markdown-post" v-if="htmlContent != null">
                <div class="markdown-body" v-if="htmlContent != null">
                    <a-watermark :content="NextEchoStore.configArticle.watermark_text" v-if="NextEchoStore.configArticle.post_watermark">
                        <section id="section" v-html="htmlContent"></section>
                    </a-watermark>
                    <section id="section" v-else v-html="htmlContent"></section>
                </div>
            </div>

            <div class="markdown-body" :style="{ minHeight: '100%',marginTop: '35px' }" v-if="articleLock">
                <NotDataView v-if="articleLock" :description="'此文章需要解锁才能查看'" @click="toUnlockArticle"/>
            </div>
        </div>

        <div class="article-tags">
            <van-space align="baseline" :wrap="true" style="margin-top: 10px" :size="10">
                <span class="tag" v-for="(tag,index) in !ReomEchoStore.isDeviceMobilePhone ? config.tags : []" :key="index" v-wave="NextEchoStore.configSundry.moused_waves">
                    <span class="tag-text">{{ config.tags[index] }}</span>
                </span>
            
                <span class="tag" v-if="NextEchoStore.configArticle.post_staticspa && !ReomEchoStore.isDeviceMobilePhone" v-wave="NextEchoStore.configSundry.moused_waves">
                    <span class="tag-text">全文共 {{ postWords }} 字</span>
                </span>
            
                <span class="tag" @click="printfArticlePost" v-if="!ReomEchoStore.isDeviceMobilePhone && NextEchoStore.configArticle.post_printbtn" v-wave="NextEchoStore.configSundry.moused_waves">
                    <span class="tag-text">打印文章</span>
                </span>
            
                <span class="tag" @click="showDraws = true" v-if="ReomEchoStore.isDeviceMobilePhone && NextEchoStore.configArticle.post_graphsbtn" v-wave="NextEchoStore.configSundry.moused_waves">
                    <span class="tag-text">留下签名</span>
                </span>

                <a-popover :overlay-inner-style="{ padding: 0 }" placement="top"  v-if="!ReomEchoStore.isDeviceMobilePhone && NextEchoStore.configArticle.post_sharebtn">
                    <template #content>
                      <a-qrcode :value="locationHref" :color="defaultQrCodeColor" :bordered="false" />
                    </template>
                    <span class="tag" v-wave="NextEchoStore.configSundry.moused_waves">
                        <span class="tag-text">分享文章</span>
                    </span>
                </a-popover>
            
                <span class="tag" @click="showShare = true" v-if="ReomEchoStore.isDeviceMobilePhone && NextEchoStore.configArticle.post_sharebtn" v-wave="NextEchoStore.configSundry.moused_waves">
                    <span class="tag-text">分享文章</span>
                </span>
            </van-space>
        </div>

        <ArticleFoot v-if="NextEchoStore.configArticle.post_copyright" :config="config"/>
        <CommentView v-if="config.comment && !ReomEchoStore.isSiLodingStatus"/>
    </div>
    
    <SiteNotFounds v-if="config === undefined" :description="'文章未找到'"/>
    <van-share-sheet v-model:show="showShare" title="立即分享给好友" :options="PostsEchoStore.postShare" @select="shareSelect" v-if="ReomEchoStore.isDeviceMobilePhone" />
    <van-popup v-if="ReomEchoStore.isDeviceMobilePhone" v-model:show="showQrcod" round position="bottom" :style="{ height: 'auto', padding: '15px' }" teleport="body">
        <!-- <vue-qr class="qrcode" :text="locationHref" :size="200" :autoColor="true" :colorDark="NextEchoStore.configStyles.qrcodeColor"></vue-qr> -->
        <a-qrcode :size="185" :value="locationHref" :color="NextEchoStore.configStyles.qrcodeColor" :style="{ margin: '0 auto' }" />
    </van-popup>
    <van-popup v-if="ReomEchoStore.isDeviceMobilePhone" v-model:show="showDraws" round position="bottom" :style="{ height: 'auto', padding: '15px' }" teleport="body">
        <van-signature background-color="#eeeeee" @submit="toastIsDeveloper" pen-color="#ff0000" clear-button-text="清空签名"/>
    </van-popup>
</template>

<style>
    @import url("./assets/ArticleFrame.css");
    
    img.qrcode {
        margin: 0 auto;
        display: block!important;
    }

    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .wrapper img {
        width: 100%;
        max-height: 65%;
        object-fit: cover;
        margin: auto !important;
    }

    .van-signature .van-signature__footer {
        margin-top: 15px;
    }
</style>