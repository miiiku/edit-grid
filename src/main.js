import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import EditPage from './pages/EditPage'
import ShowPage from './pages/ShowPage'

const routes = [
  { path: '/', name: "EditPage", component: EditPage },
  { path: '/show', name: "ShowPage", component: ShowPage },
]

const router = new VueRouter({ mode: 'history', routes })

Vue.config.productionTip = false

Vue.use(VueRouter)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
