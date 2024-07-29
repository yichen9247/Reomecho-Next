<!-- eslint-disable no-undef -->
<script setup>
    import Artalk from 'artalk'
    import "./assets/CommentView.css"
    import utils from '@/scripts/utils'
    import { onMounted, ref, onUnmounted } from 'vue'
    import { Waline } from '@waline/client/component'
    import emojeList from '@/scripts/emojeList.min.js'
    import { commentInit } from '@/stores/NextEchoStore'

    let artalk, pathName = location.hostname + '/' + location.pathname;
    const commentContainer = ref(null),NextEchoStore = utils.useNextEchoStore(),Valine = utils.Valine;

    const valineInit = async () => {
        if (commentContainer.value && NextEchoStore.configComment.comment_type == 'Valine') {
            valineContainer = new Valine(NextEchoStore.configComment.valine_emoje ? {
                recordIP: true,enableQQ: true,
                emojiMaps: emojeList,
                el: commentContainer.value,
                requiredFields: ['nick','mail'],
                lang: NextEchoStore.configComment.comment_lang,
                appId: NextEchoStore.configComment.valine_appid, 
                appKey: NextEchoStore.configComment.valine_appkey,
                pageSize: NextEchoStore.configComment.comment_psiz,
                emojiCDN: "https://i0.hdslb.com/bfs/emote/",
                path: location.hostname + '/' + location.pathname,
                placeholder: NextEchoStore.configComment.comment_placehoter,
            } : {
                recordIP: true,enableQQ: true,
                pageSize: NextEchoStore.configComment.comment_psiz,
                path: location.pathname,
                el: commentContainer.value,
                requiredFields: ['nick','mail'],
                lang: NextEchoStore.configComment.comment_lang,
                appId: NextEchoStore.configComment.valine_appid, 
                appKey: NextEchoStore.configComment.valine_appkey,
                placeholder: NextEchoStore.configComment.comment_placehoter,
            });
        }
    }

    onMounted(async () => {
        if (NextEchoStore.configComment === null) await commentInit();
        await valineInit();
        await artalkInit();
        await walineInit();
    });

    const walineInit = async () => {
        if (NextEchoStore.configComment.comment_type == 'Waline') import('@waline/client/style');
    }

    const artalkInit = async () => {
        if (commentContainer.value && NextEchoStore.configComment.comment_type == 'Artalk') {
            import('artalk/dist/Artalk.css');
            artalk = Artalk.init({
                el: commentContainer.value,
                pageTitle: `${document.title}`,
                site: NextEchoStore.configGlobal.site_title,
                server: NextEchoStore.configComment.artalk_server,
                placeholder: NextEchoStore.configComment.comment_placehoter,
                pageKey: location.hostname + '/' + location.pathname,
            })
        }
    }

    const twikooInit = async () => {
        if (NextEchoStore.configComment.comment_type == 'Twikoo') {
            const decodedArray = new Uint8Array(atob(NextEchoStore.configComment.twikoo_envid).split('').map(char => char.charCodeAt(0)));
            setTimeout(() => twikoo.init({ 
                el: '#comment-twikoo',
                lang: NextEchoStore.configComment.comment_lang,
                envId: new TextDecoder('utf-8').decode(decodedArray),
                path: location.hostname + '/' + location.pathname
            },100));
            import('@/assets/twikoo/twikoo.css');

            if (NextEchoStore.configComment.comment_styl == 1) {
                import('./comment/style1.css');
            }

            if (NextEchoStore.configComment.comment_styl == 2) {
                import('./comment/style2.css');
            }

            if (NextEchoStore.configComment.comment_styl == 3) {
                import('./comment/style3.css');
            }

            if (NextEchoStore.configComment.comment_styl == 4) {
                import('./comment/style4.css');
            }

            if (NextEchoStore.configComment.comment_styl == 5) {
                import('./comment/style5.css');
            }

            if (NextEchoStore.configComment.comment_styl == 6) {
                import('./comment/style6.css');
            }
        }
    }

    onUnmounted(() => {
        if (commentContainer.value && NextEchoStore.configComment.comment_type == 'Artalk') artalk.destroy();
    });
</script>

<template>
    <div class="comment-model" v-if="NextEchoStore.configComment !== null && NextEchoStore.configComment.comment_glba">
        <div ref="commentContainer" id="comment-artalk" v-if="NextEchoStore.configComment.comment_type == 'Artalk'"></div>
        <div ref="commentContainer" id="comment-valine" v-if="NextEchoStore.configComment.comment_type == 'Valine'"></div>
        <div ref="commentContainer" id="comment-twikoo" v-if="NextEchoStore.configComment.comment_type == 'Twikoo'"></div>
        <component :is="'script'" async src="/twikoo/twikoo.min.js" ref="twikooJs" @load="twikooInit" v-if="NextEchoStore.configComment.comment_type == 'Twikoo'"></component>
        <Waline :lang="NextEchoStore.configComment.comment_lang" :serverURL="NextEchoStore.configComment.waline_server" :path="pathName" :copyright="false" :reaction="NextEchoStore.configComment.waline_reaction" :pageSize="NextEchoStore.configComment.comment_psiz" :wordLimit="NextEchoStore.configComment.comment_maxs" :login="NextEchoStore.configComment.waline_login" v-if="NextEchoStore.configComment.comment_type == 'Waline'"/>
    </div>
</template>