import { createApp, markRaw  } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App);
pinia.use(({ store }) => {
    store.router = markRaw(router);
});
app.use(pinia)
app.use(router);
app.mount('#app')
