<!-- eslint-disable no-empty -->
<script setup>
    import utils from '@/scripts/utils'
    import { onMounted, ref } from 'vue'
    import MusicCardView from "./MusicCardView.vue"

    const axios = utils.axios;
    defineProps({player: Boolean});
    const MusicEchoStore = utils.useMusicEchoStore(),NextEchoStore = utils.useNextEchoStore();
 
    const getHttpLyric = async (url) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return
        }
    }
    
    const fetchMusicListData = async () => {
        const musicList = ref(NextEchoStore.configFunction.musics);
        const lyricPromises = musicList.value.map(item => getHttpLyric(item.lyric));
        try {
            const lyricData = await Promise.all(lyricPromises);
            musicList.value.forEach((item, index) => {
                item.lyric = lyricData[index];
            });
            MusicEchoStore.setClosestatus(true);
            MusicEchoStore.setUserMusic(musicList.value)
        } catch (error) {}
    };
    onMounted(async () => { if (!MusicEchoStore.closestatus && MusicEchoStore.userMusic == null) await fetchMusicListData() });
</script>

<template>
    <MusicCardView  progressColor="rgba(211, 16, 16, 0.1)"  diskHW="110px" :musicList="MusicEchoStore.userMusic" :offsetY="25" v-if="MusicEchoStore.closestatus" :player="player"/>
</template>