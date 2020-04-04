<template>
  <v-container fluid class="pt-0">
    <v-row class="mt-lg-12 justify-center align-center" style="min-height: 80vh !important;">
      <v-col cols="12" sm="8" md="6" style="max-width: 600px;">
        <v-card class="py-6 px-6 px-lg-10" color="rgba(17, 17, 17, 0.5)" elevation="15">
          <form @submit.prevent="onSignUp">
            <v-row class="align-center justify-center">
              <v-col cols="12" class="pb-2">
                <h2
                  class="display-1 secondary--text text-center font-italic mt-1 pb-0"
                  style="letter-spacing: 1.2px;"
                >Create Account</h2>

                <v-text-field
                  class="mt-5"
                  name="displayName"
                  label="Full Name"
                  id="displayName"
                  v-model="displayName"
                  type="text"
                  required
                ></v-text-field>

                <v-text-field
                  class="mt-5"
                  name="email"
                  label="Email"
                  id="email"
                  v-model="email"
                  type="email"
                  required
                ></v-text-field>

                <v-text-field
                  class="mt-5"
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
                        >Sign Up</v-btn>
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

export default {
  components: {
    Alert
  },
  data() {
    return {
      email: "",
      password: "",
      displayName: ""
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
    onSignUp() {
      this.$store.dispatch("signUserUp", {
        email: this.email,
        password: this.password,
        displayName: this.displayName
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
  }
};
</script>
