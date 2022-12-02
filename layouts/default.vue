<template>
  <v-app :theme="theme">
    <v-app-bar app>
      <v-app-bar-nav-icon class="ml-4" @click="showMainMenu = !showMainMenu">
      </v-app-bar-nav-icon>
      <v-img class="ml-4"
             src="../img/oscilloscope-logo.png"
             max-width="80"
             min-width="80"
             @click="toMainPage"
      ></v-img>
      <v-spacer></v-spacer>
      <v-app-bar-title>{{ header }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary">
        {{ isSignedIn ? userButtonText : 'User' }}
        <v-menu activator="parent">
          <v-list>
            <v-list-item v-if="isSignedIn" @click="signOut">
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="!isSignedIn" to="/signin">
              <v-list-item-title>Sign in</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container width="100%" style="padding: 12px">
        <v-row>
          <v-col style="padding: 4px" v-if="showMainMenu" :cols="mainMenuCols" :sm="mainMenuCols" :md="mainMenuCols" :lg="mainMenuCols">
            <v-card width="100%">
              <v-card-title>Modules</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                      v-for="item in modulesForMenu"
                      :key="item.module"
                      @click="toPage('/' + item.module.toLowerCase())"
                  >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
            <v-card width="100%">
              <v-card-title>Page settings</v-card-title>
              <v-card-text>
                <v-switch hide-details v-model="darkMode" :label="`Dark mode: ${darkModeStr}`">
                </v-switch>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col style="padding: 4px" :cols="pageCols" :sm="pageCols" :md="pageCols" :lg="pageCols">
            <slot/>
          </v-col>
        </v-row>
      </v-container>
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
      header: '',
      showMainMenu: false,
      mainMenuCols: 3,
    }
  },
  computed: {
    theme() {
      return this.darkMode ? 'dark' : 'light'
    },
    darkModeStr() {
      return this.darkMode ? 'on' : 'off'
    },
    userButtonText() {
      return dataStore().userRepresentingString
    },
    isSignedIn() {
      return dataStore().isSignedIn
    },
    modulesForMenu() {
      return dataStore().getModulesForMenu
    },
    pageCols() {
      return this.showMainMenu ? 12 - this.mainMenuCols : 12
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
      this.toMainPage()
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
