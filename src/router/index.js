/* eslint-disable no-undef */

import Pace from "pace-js";
import siteConfig from "../../config/config.js";
import HomeFrame from "@/frame/HomeFrame.vue";
import axiostool from "@/scripts/axiostool.js";
import { createRouter, createWebHistory } from "vue-router";
import { useReomEchoStore } from "@/stores/ReomEchoStore.js";
import { useNextEchoStore } from "@/stores/NextEchoStore.js";
Pace.options = { ignoreURLs: [/.*.min\.js$/, /.*.min\.css$/, /.*\.mp3$/, /.*\.mp4$/, /.*\.wav$/, /.*\.jpg$/, /.*\.png$/, /.*\.webp$/, /.*\.jpeg$/, /.*\.gif$/, /.*\.svg$/, /.*\.ico$/, /.*\.woff$/, /.*\.woff2$/, /.*\.ttf$/, /.*\.eot$/, /.*\.json$/, /.*\.lrc$/] };

const createDynamicRoutes = async () => {
	let routerPath = [];

	const setLoadingStatus = () => {
		const ReomEchoStore = useReomEchoStore();
		Pace.on("done", async () => await ReomEchoStore.setIsSiLodingStatus(false).then(async () => await checkSiteHref()));
	};
	
	const checkSiteHref = async () => {
		const ReomEchoStore = useReomEchoStore();
		let links = Array.from(document.getElementsByTagName("a"));
		links.forEach(link => {
			if (link.href.includes(location.host)) {
				link.addEventListener("click", (e) => {
					e.preventDefault();
					createRoutes.push(new URL(link.href).pathname).then(() => ReomEchoStore.resetSitePathName()).then(() => ReomEchoStore.resizeWindowInitConfig()).then(() => {
						document.querySelector("#Reomecho").scrollTo(0, 0);
					}).catch((error) => {
						ElMessage({
							type: "error",
							message: "系统功能异常：" + error.message,
						});
					});
				});
			}
		});
	};
	
	const reloadSystemStyles = async () => {
		document.body.className = "";
		const NextEchoStore = useNextEchoStore();
		if (NextEchoStore.configStyles !== null) {
			document.body.style.setProperty('--dominColor', NextEchoStore.configStyles.dominColor);
			document.body.style.setProperty('--buttoColor', NextEchoStore.configStyles.buttoColor);
			document.body.style.setProperty('--transition', NextEchoStore.configStyles.transition);
			document.body.style.setProperty('--dotted_color1', NextEchoStore.configStyles.dottedColor1);
			document.body.style.setProperty('--dotted_color2', NextEchoStore.configStyles.dottedColor2);
			document.body.style.setProperty('--background', `url(${siteConfig.system.server_adress}/api${NextEchoStore.configStyles.background})`);
		}
	}

	await axiostool.sendHttpGet(`${siteConfig.system.server_adress}/api/config/application`).then(res => {
		routerPath = [
			{
				path: "/",
				name: "home",
				component: HomeFrame,
				meta: { route: "Home", scrollToTop: true },
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
			{
				path: "/docs/:alias",
				name: "docs",
				component: () => import("@/frame/ArticleFrame.vue"),
				meta: {
					route: "Home",
					config: { path: false },
					scrollToTop: true,
					type: "post",
				},
				beforeEnter: [setLoadingStatus],
			},
			res.data.pages.circle && {
				path: res.data.pages.circle.path,
				component: () => import("@/frame/PagesFrame.vue"),
				meta: {
					route: "Home",
					type: "circle",
					config: res.data.pages.circle.config,
					scrollToTop: true,
				},
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
			res.data.pages.project && {
				path: res.data.pages.project.path,
				component: () => import("@/frame/PagesFrame.vue"),
				meta: {
					route: "Home",
					type: "repo",
					config: res.data.pages.project.config,
					scrollToTop: true,
				},
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
			res.data.pages.privacy && {
				path: res.data.pages.privacy.path,
				component: () => import("@/frame/PagesFrame.vue"),
				meta: {
					route: "Home",
					type: "post",
					config: res.data.pages.privacy.config,
					scrollToTop: true,
				},
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
			res.data.pages.friends && {
				path: res.data.pages.friends.path,
				component: () => import("@/frame/PagesFrame.vue"),
				meta: {
					route: "Home",
					type: "link",
					config: res.data.pages.friends.config,
					scrollToTop: true,
				},
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
			res.data.pages.feedback && {
				path: res.data.pages.feedback.path,
				component: () => import("@/frame/PagesFrame.vue"),
				meta: {
					route: "Home",
					type: "feed",
					config: res.data.pages.feedback.config,
					scrollToTop: true,
				},
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
			{
				path: "/:catchAll(.*)",
				meta: { route: "Home" },
				component: () => import("@/model/SiteNotFounds.vue"),
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
		]
	}).catch(async (error) => {
		routerPath = [
			{
				path: "/",
				name: "error",
				component: () => import("@/model/SiteCatchError.vue"),
				meta: {
					route: "Error", scrollToTop: true, errorInfo: {
						name: '路由异常',
						message: error
					}
				},
				beforeEnter: [setLoadingStatus, reloadSystemStyles],
			},
		]
	});

	const createRoutes = createRouter({
		routes: routerPath,
		history: createWebHistory(import.meta.env.BASE_URL),
		scrollBehavior(to, from, savedPosition) {
			if (savedPosition) return savedPosition;
			if (to.meta.scrollToTop) return { top: 0 };
			if (to.hash) return { el: to.hash, behavior: "smooth" };
		},
	});
	
	createRoutes.beforeEach(async (to, from, next) => {
		if (to === from) return;
		const ReomEchoStore = useReomEchoStore();
		Pace.on("start", async () => await ReomEchoStore.setIsSiLodingStatus(true));
		next();
	});

	return createRoutes;
}

export default { createDynamicRoutes };
