<template>
  <NuxtLayout name="default">
    <div class="d-flex align-center flex-column">
      <v-card width="100%" min-width="400">
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
import {dataStore} from "../stores/data-store";
import formValidation from "../mixins/form-validation"

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
  mixins: [formValidation],
  methods: {
    async loginRequest() {
      this.clearValidation()
      let response = await ApiProvider.postJson('/api/sessions/', this.form)
      if (!response.ok) {
        if (response.status === 400) {
          this.parseValidation(response.errors)
        }
      } else {
        await dataStore().setUserInfo(response.data)
        let waitingForAuthorization = dataStore().getWaitingForAuthorization
        useRouter().push(waitingForAuthorization ? waitingForAuthorization : '/')
        waitingForAuthorization && dataStore().clearWaitingForAuthorization()
      }
    },
    register() {
      useRouter().push('/register')
    },
  },
};
</script>
