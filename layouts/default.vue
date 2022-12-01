<template>
  <v-app :theme="theme">
    <v-app-bar app>
      <v-img
          src="../img/oscilloscope-logo.png"
          max-width="100"
          @click="toMainPage"
      ></v-img>
      <v-btn
          color="primary"
          dark
          id="modulesMenuButton"
          on=""
      >
        Modules
      </v-btn>
      <v-menu activator="#modulesMenuButton" offset-y>
        <v-list>
          <v-list-item
              v-for="item in modulesForMenu"
              :key="item.module"
              @click="toPage('/' + item.module.toLowerCase())"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-switch hide-details v-model="darkMode"></v-switch>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          dark
          id="userMenuButton"
          on=""
      >
        {{ isSignedIn ? userButtonText : 'User' }}
      </v-btn>
      <v-menu offset-y activator="#userMenuButton">
        <v-list>
          <v-list-item v-if="isSignedIn" @click="signOut">
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!isSignedIn" to="/signin">
            <v-list-item-title>Sign in</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-app-bar>
      <v-spacer></v-spacer>
      <h2>{{ header }}</h2>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <slot/>
    </v-main>
  </v-app>
</template>

<script>

import {dataStore} from "../stores/data-store";
import ApiProvider from "../api/api-provider";

export default {
  data() {
    return {
      darkMode: localStorage.getItem('darkMode') || false,
      header: ''
    }
  },
  computed: {
    theme() {
      return this.darkMode ? 'dark' : 'light'
    },
    userButtonText() {
      return dataStore().userRepresentingString
    },
    isSignedIn() {
      return dataStore().isSignedIn
    },
    modulesForMenu() {
      return dataStore().getModulesForMenu
    }
  },
  watch: {
    darkMode(newValue) {
      localStorage.setItem('darkMode', newValue)
    }
  },
  methods: {
    async signOut() {
      await ApiProvider.del('/api/sessions/')
      dataStore().clearUserInfo()
    },
    toMainPage() {
      this.toPage('/')
    },
    toPage(page) {
      useRouter().push(page)
    },
    setHeaderByRoute() {
      let routeName = useRoute().name
      for (let module of dataStore().getAllModules) {
        if (module.module.toLowerCase() === routeName) {
          this.header = module.name
          break
        }
      }
    }
  },
  mounted() {
    if (!dataStore().isSignedIn) {
      dataStore().loadUserInfo()
    }
    dataStore().loadModules()
    this.setHeaderByRoute()
  }
}
</script>
