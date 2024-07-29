<!-- eslint-disable no-undef -->
<script setup>
    import { ref, watch } from 'vue'
    import utils from "@/scripts/utils"
    import NotDataView from '@/model/NotDataView.vue'

    let posts = [];
    const siteConfig = utils.siteConfig;
    const NextEchoStore = utils.useNextEchoStore();

    NextEchoStore.application.actives.map(async (item) => {
        if (item.isFixed) {
            posts.unshift(item);
            let index = posts.indexOf(item);
            let removedElements = posts.splice(index, 1);
            posts.push(removedElements[0]);
        } else posts.push(item);
    });

    const postIndex = ref(NextEchoStore.configIndex.post_eachNum);
    const postArray = ref(posts.reverse().slice(0,postIndex.value));
    watch(postIndex,async () => postArray.value = posts.slice(0,postIndex.value));

    const currentChange = async (page) => {
        await utils.backToTop();
        postArray.value = posts.reverse().slice((page - 1) * postArray.value,postIndex.value);
    }
</script>

<template>
    <div class="model-acticle">
        <a class="article-item" v-for="(item,index) in postArray" :key="index" :href="'/docs/' + item.path">
            <div class="image-box">
                <img class="article-image" v-lazy="utils.checkStringUrl(item.config.image) ? item.config.image : siteConfig.system.server_adress + '/api' + item.config.image" :alt="item.config.name" draggable="false">
            </div>
            <div class="article-content">
                <p class="article-title van-ellipsis">
                    <span class="article-fixed" v-if="item.isFixed">置顶</span>
                    {{ item.config.name }}
                </p>
            </div>
        </a>

        <NotDataView description="博主暂时还没有文章哦" v-if="NextEchoStore.application.actives.length === 0"/>
        <div class="load-more">
            <el-pagination size="small" background layout="prev, pager, next" :total="NextEchoStore.application.actives.length" class="mt-4" :hide-on-single-page="true"  :page-size="postIndex" @current-change="currentChange"/>
        </div>
    </div>
</template>