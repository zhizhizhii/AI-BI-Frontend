import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    meta: {
      breadList: [{
        name: ["首页"],
        path: "/"
      }, {
        name: ["首页","人物查询"],
        path: "/person"
      }, {
        name: ["首页","企业查询"],
        path: "/org"
      }, {
        name: ["首页","人物信息"],
        path: "/personinfo"
      }, {
        name: ["首页","企业信息"],
        path: "/orginfo"
      }]
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
