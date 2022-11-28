import { defineStore } from 'pinia'
import ApiProvider from "~/api/api-provider";

export const userInfo = defineStore('userInfo', {
  state: () => {
    return {
      userInfo: {
        id: 0,
        firstName: '',
        lastName: '',
        patronymic: '',
        email: '',
        emailConfirmed: null
      }
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
    }
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
