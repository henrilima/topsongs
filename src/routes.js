import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "HomePage",
        component: () => import("@/views/Home.vue"),
    },
    {
        path: "/songs",
        name: "selectSongs",
        component: () => import("@/views/SelectSongs.vue"),
    },
    {
        path: "/order",
        name: "orderCanvas",
        component: () => import("@/views/orderCanvas.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
