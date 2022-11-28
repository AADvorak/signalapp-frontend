<template>
  <NuxtLayout name="default">
    <div class="d-flex align-center flex-column">
      <v-card width="50%" min-width="400">
        <v-card-title>Sign in</v-card-title>

        <v-card-text>
          <v-form @submit.prevent="loginRequest">
            <v-text-field
                v-model="form.email"
                label="Email"
                :error="!!validation.email.length"
                :error-messages="validation.email"
                required
            ></v-text-field>

            <v-text-field
                v-model="form.password"
                :append-icon="show1 ? mdiEyeOff : mdiEye"
                :type="show1 ? 'text' : 'password'"
                label="Password"
                @click:append="show1 = !show1"
                :error="!!validation.password.length"
                :error-messages="validation.password"
                required
            >
            </v-text-field>

            <div class="d-flex">
              <v-btn color="success" class="mr-4" @click="loginRequest">
                Sign in
              </v-btn>
              <v-btn @click="register">
                Sign up
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </NuxtLayout>
</template>

<script>
import {mdiEye, mdiEyeOff} from "@mdi/js";
import ApiProvider from "../api/api-provider";
import {userInfo} from "../stores/user-info";

export default {
  data: () => ({
    mdiEye,
    mdiEyeOff,
    show1: false,
    form: {
      email: '',
      password: '',
    },
    validation: {
      email: [],
      password: []
    },
  }),
  methods: {
    // todo to abstract component or mixin
    parseValidation(errors) {
      for (let error of errors) {
        this.validation[error.field]?.push(error.message)
      }
    },
    resetValidation() {
      this.validation = {
        email: [],
        password: []
      }
    },
    async loginRequest() {
      this.resetValidation()
      let response = await ApiProvider.postJson('/api/sessions/', this.form)
      if (!response.ok) {
        if (response.status === 400) {
          this.parseValidation(response.errors)
        }
      } else {
        await userInfo().setUserInfo(response.data)
        useRouter().push('/')
      }
    },
    register() {
      useRouter().push('/register')
    },
  },
};
</script>
