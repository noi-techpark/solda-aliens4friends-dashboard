window.Vue = require('vue').default;
import store from './store';
import router from './router';
import App from './layouts/App.vue';
import vuetify from './plugins/vuetify' // path to vuetify export
import VueApexCharts from 'vue-apexcharts'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

const files = require.context('./', true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

const app = new Vue({
    router,
    store,
    vuetify,
    el: '#app',
    render: h => h(App)
});


