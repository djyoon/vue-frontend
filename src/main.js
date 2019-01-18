import Vue from 'vue'
import App from './app.vue'
import router from './router'
import axios from 'axios'
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import numberFormat from 'vue-filter-number-format';
import vueNiceScrollbar from './components/vue-nice-scrollbar'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueI18Next)
Vue.use(require('vue-moment'))
Vue.use(vueNiceScrollbar)
Vue.use(VueClipboard)

Vue.prototype.$http = axios
Vue.prototype.apiURI = "http://api.nexbill.net/backend/"
Vue.filter('numberFormat', numberFormat);

const locales = {
  en: require("./locale/en.json")
}

i18next.init({
  lng: 'en',
  resources: {
    en: { translation: locales.en },
  },
})

const i18n = new VueI18Next(i18next);

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  i18n: i18n
})
