
<script setup>
    import utils from "@/scripts/utils"
    const NextEchoStore = utils.useNextEchoStore();
</script>

<template>
    <footer id="footer">
        <div class="footer-box">
            <p class="copyright-text" v-html="NextEchoStore.configFooter.footer_copyright"></p>
        </div>
    </footer>
</template>

<style>
    @import url("./assets/FootLayout.css");
    @import url("../assets/footbadge/FootBadge.css");
</style>