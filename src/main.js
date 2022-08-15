import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import init from '@/common/init.js';
import * as Icons from '@element-plus/icons-vue';
import icon from '@/components/icon/index.vue';

let app = createApp(App);

for (let i in Icons) {
    app.component(i, Icons[i]);
}


app.component('icon', icon);


app.use(createPinia());


init().then(() => {
    app.use(router).mount('#app');
})