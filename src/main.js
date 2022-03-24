/* eslint-disable */
import {
    createApp
} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
    Toast,
    Image as VanImage
} from 'vant';
import {
    post
} from "./utils/request";
import {
    Apis
} from "./utils/apis";
import {
    formatTime
} from "./utils/check";
import i18n from './lang'
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    };
    next();
});
const app = createApp(App);
app.config.globalProperties.$post = post;
app.config.globalProperties.Apis = Apis;
app.config.globalProperties.$filters = {
    gettime(value) {
        return formatTime(value)
    }
}
app.use(i18n).use(store).use(router).use(Toast).use(VanImage).mount("#app");