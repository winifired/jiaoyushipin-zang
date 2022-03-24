import {
    createRouter,
    createWebHistory
} from "vue-router";
const routes = [{
    path: "/",
    name: "index",
    meta: {
        title: 'ཏི་སེའི་དྲ་མིག་སློབ་གསོ།',
        currentPage: 1,
        showTabar: true,
    },
    component: () =>
        import ("../views/index.vue"),
}, {
    path: "/vip",
    name: "vip",
    meta: {
        title: 'རྒྱུན་མི།',
        currentPage: 2,
        showTabar: true,
    },
    component: () =>
        import ("../views/vip.vue"),
}, {
    path: "/login",
    name: "login",
    meta: {
        title: 'ཐོ་འགོད་བྱེད་པ།',
    },
    component: () =>
        import ("../views/login.vue"),
}, {
    path: "/loginCode",
    name: "loginCode",
    meta: {
        title: 'ཐོ་འགོད་བྱེད་པ།',
    },
    component: () =>
        import ("../views/loginCode.vue"),
}, {
    path: "/register",
    name: "register",
    meta: {
        title: 'ཐོ་འགོད།',
    },
    component: () =>
        import ("../views/register.vue"),
}, {
    path: "/resetPass",
    name: "resetPass",
    meta: {
        title: 'གསང་ཨང་བརྗེ་བ།',
    },
    component: () =>
        import ("../views/resetPass.vue"),
}, {
    path: "/asidePage/:type",
    name: 'asidePage',
    meta: {
        title: '',
    },
    component: () =>
        import ("../views/asidePage.vue"),
}, {
    path: "/systemMsg",
    name: "systemMsg",
    meta: {
        title: 'གནས་ཚུལ།',
    },
    component: () =>
        import ("../views/systemMsg.vue"),
}, {
    path: "/search",
    name: "search",
    meta: {
        title: 'སློབ་ཁྲིད་འཚོལ་བཤེར།',
    },
    component: () =>
        import ("../views/search.vue"),
}, {
    path: "/detail/:id",
    name: "detail",
    meta: {
        title: 'སློབ་ཁྲིད་ངོ་སྤྲོད།',
    },
    component: () =>
        import ("../views/detail.vue"),
}, {
    path: "/evalist",
    name: "evalist",
    meta: {
        title: 'སློབ་ཁྲིད་ཀྱི་དཔྱད་བརྗོད།',
    },
    component: () =>
        import ("../views/evalist.vue"),
}, {
    path: "/eva_use",
    name: "eva_use",
    meta: {
        title: 'སློབ་ཁྲིད་ཀྱི་དཔྱད་བརྗོད།',
    },
    component: () =>
        import ("../views/eva_use.vue"),
}, {
    path: "/freeClass",
    name: "freeClass",
    meta: {
        currentPage: 3,
        showTabar: true,
        title: 'རིན་མེད་སློབ་ཁྲིད།',
    },
    component: () =>
        import ("../views/freeClass.vue"),
}, {
    path: "/user",
    name: "user",
    meta: {
        currentPage: 4,
        showTabar: true,
        title: '',
    },
    component: () =>
        import ("../views/user.vue"),
}, {
    path: "/userMsg",
    name: "userMsg",
    meta: {
        title: 'སྒེར་གྱི་གནས་ཚུལ་རྩོམ་སྒྲིག',
    },
    component: () =>
        import ("../views/userMsg.vue"),
}, {
    path: "/editphone",
    name: "editphone",
    meta: {
        title: 'སྒེར་གྱི་གནས་ཚུལ་རྩོམ་སྒྲིག',
    },
    component: () =>
        import ("../views/editphone.vue"),
}, {
    path: "/userCollect",
    name: "userCollect",
    meta: {
        title: 'ངའི་གསོག་ཉར།',
    },
    component: () =>
        import ("../views/userCollect.vue"),
}, {
    path: "/userLean",
    name: "userLean",
    meta: {
        title: 'སློབ་སྦྱོང་གི་ཟིན་ཐོ།',
    },
    component: () =>
        import ("../views/userLean.vue"),
}];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;