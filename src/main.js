import { createApp, markRaw  } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics';
const pinia = createPinia()
inject();
const app = createApp(App);
pinia.use(({ store }) => {
    store.router = markRaw(router);
});
app.use(pinia)
app.use(router);
app.mount('#app')
