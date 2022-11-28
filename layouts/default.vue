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
    <v-main>
      <slot/>
    </v-main>
  </v-app>
</template>

<script>

import {userInfo} from "../stores/user-info";
import {modules} from "../stores/modules";
import ApiProvider from "../api/api-provider";

export default {
  data() {
    return {
      darkMode: localStorage.getItem('darkMode') || false,
    }
  },
  computed: {
    theme() {
      return this.darkMode ? 'dark' : 'light'
    },
    userButtonText() {
      return userInfo().userRepresentingString
    },
    isSignedIn() {
      return userInfo().isSignedIn
    },
    modulesForMenu() {
      return modules().getModulesForMenu
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
      userInfo().clearUserInfo()
    },
    toMainPage() {
      useRouter().push('/')
    }
  },
  mounted() {
    if (!userInfo().isSignedIn) {
      userInfo().loadUserInfo()
    }
  }
}
</script>
