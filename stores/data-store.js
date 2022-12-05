import {defineStore} from 'pinia'
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
          {module: 'Signal', name: 'Signal', container: 'main', forMenu: false},
          {module: 'index', name: 'Start page', container: 'main', forMenu: false},
        ],
        user: []
      },
      waitingForAuthorization: null,
      signalHistory: {}
    }
  },
  getters: {
    userRepresentingString: (state) => {
      const user = state.userInfo
      if (user.firstName && user.lastName && user.patronymic) {
        return user.firstName.substring(0, 1) + '.' + user.patronymic.substring(0, 1) + '. ' + user.lastName
      }
      if (user.firstName && user.lastName) {
        return user.firstName.substring(0, 1) + '. ' + user.lastName
      }
      if (user.firstName) {
        return user.firstName
      }
      if (user.lastName) {
        return user.lastName
      }
      return user.email
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
    getTransformers: state => {
      return state.modules.user.filter(module => module.transformer)
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
        this.modules.user = response.data
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
    },
    addSignalToHistory(signal) {
      let historyKey = String(signal.id || 0)
      if (!this.signalHistory[historyKey]) {
        this.signalHistory[historyKey] = []
      }
      let numberOfSignalInHistory = this.signalHistory[historyKey].length
      this.signalHistory[historyKey].push(JSON.stringify(signal))
      return `${historyKey}-${numberOfSignalInHistory}`
    },
    getSignalFromHistory(signalKey) {
      let signalKeySplit = signalKey.split('-')
      let historyKey = signalKeySplit[0], numberOfSignalInHistory = signalKeySplit[1]
      let value = this.signalHistory[historyKey]?.[numberOfSignalInHistory]
      if (value) {
        return JSON.parse(value)
      }
    },
    clearSignalHistory() {
      this.signalHistory = {}
    }
  },
})
