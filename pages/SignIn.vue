<template>
  <v-container fluid class="pt-0">
    <v-row class="justify-center align-center" style="min-height: 70vh !important;">
      <v-col cols="12" sm="8" md="6" style="max-width: 600px;">
        <v-card class="pa-6 px-lg-10" color="rgba(17, 17, 17, 0.5)" elevation="15">
          <form @submit.prevent="onSignIn">
            <v-row class="align-center justify-center">
              <v-col cols="12" class="pb-2">

                <v-text-field
                  class="mt-6"
                  name="email"
                  label="Email"
                  id="email"
                  v-model="email"
                  type="email"
                  required
                ></v-text-field>

                <v-text-field
                  class="mt-6"
                  name="password"
                  label="Password"
                  id="password"
                  v-model="password"
                  type="password"
                  required
                ></v-text-field>

                <v-card-actions style="width: 100%;">
                  <v-row class="justify-center">
                    <v-col cols="12" class="text-center py-0">
                      <v-col cols="12" lg="8" class="text-xs-center" v-if="error">
                        <Alert @dismissed="onDismissed" :text="error.message" />
                      </v-col>
                      <v-col cols="12" class="my-2 text-center">
                        <v-btn
                          type="submit"
                          large
                          class="text-capitalize px-12"
                          style="background-color: rgba(120, 47, 64, 0.6);"
                        >Sign In</v-btn>
                      </v-col>
                      <v-col cols="12" class="text-center mt-2 pb-0">
                        <v-btn text to="/signup" class="title secondary--text text-capitalize">
                          <v-icon left>mdi-star</v-icon>Get Account Here
                          <v-icon right>mdi-star</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12" class="text-center py-0">
                        <ForgotPassword />
                      </v-col>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-col>
            </v-row>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Alert from "@/components/Alert";
import ForgotPassword from "@/components/ForgotPassword";

export default {
  components: {
    Alert,
    ForgotPassword
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  methods: {
    onSignIn() {
      this.$store.dispatch("signUserIn", {
        email: this.email,
        password: this.password
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  }
};
</script>
