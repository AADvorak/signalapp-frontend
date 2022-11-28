import { defineStore } from 'pinia'

export const modules = defineStore('modules', {
  state: () => {
    return {
      base: [
        {module: 'SignalGenerator', name: 'Signal generator', container: 'left', forMenu: true},
        {module: 'SignalRecorder', name: 'Signal recorder', container: 'left', forMenu: true},
        {module: 'SignalManager', name: 'Signal manager', container: 'main', forMenu: true},
        {module: 'ModuleManager', name: 'Module manager', container: 'main', forMenu: true},
      ],
      user: []
    }
  },
  getters: {
    getAllModules: state => {
      return [...state.base, ...state.user]
    },
    getModulesForMenu: state => {
      return [...state.base, ...state.user].filter(module => module.forMenu)
    },
  },
  actions: {
    async loadModules() {

    }
  },
})
