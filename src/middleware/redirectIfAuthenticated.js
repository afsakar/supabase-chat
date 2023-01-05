import {useAuthStore} from "@/composables/useAuthStore.js";

export default function redirectIfAuthenticated({ next, router }) {
    const authStore = useAuthStore();

    authStore.getSession().then(() => {
        if (authStore.sessionData) {
            return router.go(-1);
        } else {
            return next();
        }
    })
}