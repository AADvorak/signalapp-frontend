import { defineStore } from 'pinia'
import ApiProvider from "~/api/api-provider";

export const dataStore = defineStore('dataStore', {
  state: () => {
    return {
      userInfo: {
        id: 0,
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        emailConfirmed: null
      },
      modules: {
        base: [
          {module: 'SignalGenerator', name: 'Signal generator', container: 'left', forMenu: true},
          {module: 'SignalRecorder', name: 'Signal recorder', container: 'left', forMenu: true},
          {module: 'SignalManager', name: 'Signal manager', container: 'main', forMenu: true},
          {module: 'ModuleManager', name: 'Module manager', container: 'main', forMenu: true},
          {module: 'SignIn', name: 'Sign in', container: 'main', forMenu: false},
          {module: 'index', name: 'Start page', container: 'main', forMenu: false},
        ],
        user: []
      },
      waitingForAuthorization: null,
    }
  },
  getters: {
    userRepresentingString: (state) => {
      // todo
      const userInfo = state.userInfo
      if (userInfo.firstName && userInfo.lastName) {
        return userInfo.firstName + ' ' + userInfo.lastName
      }
      return userInfo.email
    },
    isSignedIn: (state) => {
      return !!state.userInfo.id
    },
    getAllModules: state => {
      return [...state.modules.base, ...state.modules.user]
    },
    getModulesForMenu: state => {
      return [...state.modules.base, ...state.modules.user].filter(module => module.forMenu)
    },
    getWaitingForAuthorization: state => {
      return state.waitingForAuthorization
    },
  },
  actions: {
    async loadUserInfo() {
      let userInfoJson = localStorage.getItem('userInfo')
      if (!userInfoJson) {
        await this.fetchUserInfo()
      } else {
        this.userInfo = JSON.parse(userInfoJson)
      }
    },
    async fetchUserInfo() {
      let response = await ApiProvider.get('/api/users/me/', true)
      if (response.ok) {
        this.setUserInfo(response.data)
      }
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },
    async loadModules() {
      let response = await ApiProvider.get('/api/modules')
      if (response.ok) {
        this.user = response.data
      }
    },
    setWaitingForAuthorization(waitingForAuthorization) {
      this.waitingForAuthorization = waitingForAuthorization
    },
    clearWaitingForAuthorization() {
      this.waitingForAuthorization = null
    },
    clearUserInfo() {
      this.userInfo = {
        id: 0,
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        emailConfirmed: null
      }
      localStorage.setItem('userInfo', '')
    }
  },
})
