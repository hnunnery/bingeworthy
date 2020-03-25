<template>
  <v-container fluid class="pt-0">
    <v-row class="justify-center align-center" style="height: 70vh !important;">
      <v-col cols="12" lg="11" xl="10" class="mt-0">
        <h1
          class="secondary--text text-center font-weight-bold font-italic mt-1 mb-2"
          style="letter-spacing: 2px; font-size: 6vmax;"
        >BingeWorthy</h1>
      </v-col>
      <v-col cols="12" sm="8" md="6" lg="4" style="max-width: 600px;">
        <v-card class="pa-6" color="#111111">
          <form @submit.prevent="onSignIn">
            <v-row class="align-center justify-center">
              <v-col cols="12" class="pb-2">
                <h2
                  class="display-1 text-center font-italic mt-1 pb-0"
                  style="letter-spacing: 1.2px;"
                >Welcome Back</h2>

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
                          class="primary white--text text-capitalize px-12"
                        >Sign In</v-btn>
                      </v-col>
                      <v-col cols="12" class="text-center mt-2 pb-0">
                        <v-btn
                          to="/signup"
                          class="accent white--text text-capitalize"
                        >New Users Sign Up Here</v-btn>
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
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
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
